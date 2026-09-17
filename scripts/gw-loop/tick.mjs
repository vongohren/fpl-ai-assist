#!/usr/bin/env node
// =============================================================================
// gw-loop tick — the DETERMINISTIC clock behind the FPL gameweek cycle.
//
// Runs hourly (jobctl job `fpl-gw-loop`). Costs no LLM. Reads the public FPL
// API, decides which PHASE each gameweek is in, and wakes an agent only at the
// three moments where judgement is needed:
//
//   FORWARD    T-72h before the next deadline .... research + proposal   (agent)
//   WAITING    proposal exists, deadline coming .. nudges, watches the team (this)
//   LOCK       deadline passed ..................... record what was done  (agent)
//   BACKWARD   FPL finalised the gameweek ......... outcome + learnings    (agent)
//
// The forward run reads the backward run's learnings, so the loop is one
// continuous cycle: post-mortem(N-1) -> research(N) -> wait -> lock(N) ->
// post-mortem(N) -> research(N+1) ...
//
// WHAT IT NEVER DOES: transfers, captaincy or chip changes. The proposal is a
// document; Snorre acts in the FPL app; this script watches the team via the
// authenticated my-team endpoint and reports whether what he did matches.
// Flipping that later is a change to briefs/research.md, not to this file.
//
// THE FINALISATION GATE (backward) is inherited from the GW3 one-shot gate:
// events[N].finished AND events[N].data_checked, both from a cache-busted
// bootstrap-static (the CDN serves stale copies), plus a conditional veto: a
// 0-minute starter with empty automatic_subs means autosubs have not run.
// fixture-level finished_provisional means nothing. The MCP server's own
// bootstrap cache is 24h, which is why GW4's post-mortem saw is_finished=false
// while the live API said true; this script never goes through the MCP.
//
// LATCHES. Every spawn is recorded in state BEFORE the spawn fires, so a crash
// mid-dispatch costs one wake-up, never a loop. Re-spawns are bounded.
//
// State: /workspace/.spawn/fpl-gw-loop/ (durable across respawn, not in git).
//   state.json          phases per gameweek
//   events.jsonl        one line per decision the tick took
//   briefs/gw<N>-<phase>.md   the rendered brief an agent was told to read
//   snapshots/gw<N>-team.json  my-team at proposal time (the "pending" baseline)
//   proposals/gw<N>.json       written by the research AGENT, read by this tick
//   locks/gw<N>.json           picks vs proposal, written here after the deadline
//
//   tick.mjs [--dry-run] [--status]
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawn, spawnSync } from "node:child_process";

const REPO = process.env.FPL_LOOP_REPO || "/workspace/fpl-ai-assist";
const STATE_DIR = process.env.FPL_LOOP_STATE || "/workspace/.spawn/fpl-gw-loop";
const SECRETS = path.join(process.env.HOME || "/home/node", ".fpl", "secrets.env");
const NTFY = process.env.FPL_LOOP_NTFY || "/workspace/it-management/deployments/ntfy/ntfy-send";
const ACP = process.env.FPL_LOOP_ACP || "/usr/local/bin/acp";
// Briefs live next to this file, so a tick run from any checkout renders its own.
const BRIEFS = process.env.FPL_LOOP_BRIEFS || path.join(import.meta.dirname, "briefs");
const API = "https://fantasy.premierleague.com/api";

const RESEARCH_LEAD_H = Number(process.env.FPL_LOOP_LEAD_H || 72);
// Nudge thresholds (hours before deadline) while the proposal is unanswered.
const NUDGES = [
  { h: 48, prio: "default" },
  { h: 24, prio: "default" },
  { h: 6, prio: "high" },
  { h: 2, prio: "urgent" },
];
const RESPAWN_AFTER_H = 6; // an agent that has not produced in this long is presumed dead
const MAX_ATTEMPTS = 3;

const DRY = process.argv.includes("--dry-run");
const STATUS_ONLY = process.argv.includes("--status");

for (const d of ["", "briefs", "snapshots", "proposals", "locks"]) {
  fs.mkdirSync(path.join(STATE_DIR, d), { recursive: true });
}

// ----------------------------------------------------------------------------- io
const nowIso = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
function log(gw, event, detail = "") {
  const line = JSON.stringify({ ts: nowIso(), gw, event, detail });
  fs.appendFileSync(path.join(STATE_DIR, "events.jsonl"), line + "\n");
  if (DRY || STATUS_ONLY) console.log(line);
}
const statePath = path.join(STATE_DIR, "state.json");
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return { forward: {}, postmortem: {}, auth: {} };
  }
}
function saveState(s) {
  if (DRY) return;
  const tmp = statePath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(s, null, 2));
  fs.renameSync(tmp, statePath);
}
function readSecrets() {
  const out = {};
  try {
    for (const raw of fs.readFileSync(SECRETS, "utf8").split("\n")) {
      const line = raw.replace(/^export\s+/, "").trim();
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      out[m[1]] = v;
    }
  } catch {
    /* no secrets file: public endpoints still work */
  }
  return out;
}
const secrets = readSecrets();
const ENTRY = process.env.FPL_MANAGER_ID || secrets.FPL_MANAGER_ID;
const XAUTH = process.env.FPL_X_API_AUTH || secrets.FPL_X_API_AUTH;

// Cache-busted: the FPL CDN happily serves a pre-finalisation copy otherwise.
async function fetchJson(endpoint, { auth = false } = {}) {
  const url = `${API}/${endpoint}?_cb=${Date.now()}${process.pid}`;
  const headers = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "User-Agent": "FPL-MCP-Server/1.0 (+https://fantasy.premierleague.com)",
    Origin: "https://fantasy.premierleague.com",
    Referer: "https://fantasy.premierleague.com/",
    "x-requested-with": "XMLHttpRequest",
  };
  if (auth) {
    if (!XAUTH) return { status: 401, body: null };
    headers["X-Api-Authorization"] = XAUTH;
  }
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
  if (!res.ok) return { status: res.status, body: null };
  return { status: res.status, body: await res.json() };
}

function ntfy({ title, prio = "default", click, msg }) {
  if (DRY) return console.log(`DRY ntfy [${prio}] ${title}: ${msg} ${click || ""}`);
  const args = ["-t", title, "-p", prio, "-T", "soccer"];
  if (click) args.push("-c", click);
  args.push("--", msg);
  spawnSync(NTFY, args, { stdio: "ignore" }); // best-effort by contract, always exits 0
}

function acpSpawn(title, prompt) {
  if (DRY) {
    console.log(`DRY acp spawn --title "${title}": ${prompt}`);
    return "dry";
  }
  const r = spawnSync(
    ACP,
    ["spawn", "--cwd", REPO, "--background", "--no-callback", "--title", title, prompt],
    { encoding: "utf8" }
  );
  if (r.status !== 0) throw new Error(`acp spawn failed: ${r.stderr || r.stdout}`);
  // acp prints "conversation: c576"; a human needs the link, not the id.
  const id = ((r.stdout || "").match(/conversation:\s*(\S+)/) || [])[1];
  if (!id) return (r.stdout || "").trim().split("\n")[0];
  const link = spawnSync(ACP, ["link", id], { encoding: "utf8" });
  return link.status === 0 && link.stdout.trim() ? link.stdout.trim() : id;
}

function renderBrief(name, vars) {
  let t = fs.readFileSync(path.join(BRIEFS, `${name}.md`), "utf8");
  for (const [k, v] of Object.entries(vars)) t = t.replaceAll(`{{${k}}}`, String(v));
  const out = path.join(STATE_DIR, "briefs", `gw${vars.GW}-${name}.md`);
  if (!DRY) fs.writeFileSync(out, t);
  return out;
}

// Is the Outcome of gw<N>.md filled in on origin/main? Reads the remote ref,
// never the working tree, so it does not care what the shared clone is doing.
function outcomeOnMain(season, gw) {
  try {
    execFileSync("git", ["-C", REPO, "fetch", "-q", "origin"], { stdio: "ignore", timeout: 60000 });
  } catch {
    /* offline: fall through to whatever origin/main we have */
  }
  const file = `docs/gw-decisions/${season}/gw${gw}.md`;
  let text;
  try {
    text = execFileSync("git", ["-C", REPO, "show", `origin/main:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return { exists: false, filled: false };
  }
  // "**Actual points: 75**" or "**Actual points:** 75" both count; the empty
  // template has "**Actual points:**" followed by a newline.
  const outcome = text.split(/^## Outcome/m)[1] || "";
  const filled = /\*\*Actual points:\*?\*?\s*\d/i.test(outcome);
  return { exists: true, filled };
}

function openPrForBranch(branch) {
  try {
    const out = execFileSync("gh", ["pr", "list", "--repo", ghRepo(), "--head", branch, "--state", "open", "--json", "url", "-q", ".[0].url"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 30000,
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}
let _ghRepo;
function ghRepo() {
  if (_ghRepo) return _ghRepo;
  const url = execFileSync("git", ["-C", REPO, "remote", "get-url", "origin"], { encoding: "utf8" }).trim();
  const m = url.match(/github\.com[:/]([^/]+\/[^/.]+)/);
  _ghRepo = m ? m[1] : "vongohren/fpl-ai-assist";
  return _ghRepo;
}

// ----------------------------------------------------------------------------- team compare
function teamShape(myTeam) {
  const picks = myTeam.picks || [];
  return {
    squad: picks.map((p) => p.element).sort((a, b) => a - b),
    xi: picks.filter((p) => p.position <= 11).map((p) => p.element).sort((a, b) => a - b),
    bench: picks.filter((p) => p.position > 11).sort((a, b) => a.position - b.position).map((p) => p.element),
    captain: picks.find((p) => p.is_captain)?.element ?? null,
    vice: picks.find((p) => p.is_vice_captain)?.element ?? null,
    transfers_made: myTeam.transfers?.made ?? 0,
    active_chip: (myTeam.chips || []).find((c) => c.status_for_entry === "active")?.name ?? null,
  };
}
const sameSet = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// pending | matched | partial | diverged, plus the reasons, so the nudge can say
// exactly which half of the proposal is still open.
function compareToProposal(current, baseline, proposal) {
  const untouched =
    sameSet(current.squad, baseline.squad) &&
    sameSet(current.xi, baseline.xi) &&
    current.captain === baseline.captain &&
    current.vice === baseline.vice &&
    current.transfers_made === 0 &&
    !current.active_chip;
  const checks = {};
  const squad = new Set(current.squad);
  const ins = (proposal.transfers || []).map((t) => t.in).filter(Boolean);
  const outs = (proposal.transfers || []).map((t) => t.out).filter(Boolean);
  checks.transfers = ins.every((id) => squad.has(id)) && outs.every((id) => !squad.has(id));
  checks.captain = proposal.captain == null || current.captain === proposal.captain;
  checks.vice = proposal.vice == null || current.vice === proposal.vice;
  checks.xi = !proposal.xi?.length || sameSet(current.xi, [...proposal.xi].sort((a, b) => a - b));
  checks.chip = (proposal.chip || null) === (current.active_chip || null);
  const ok = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const noTransfersProposed = ins.length === 0 && outs.length === 0;
  let status;
  if (ok === total) status = noTransfersProposed && untouched ? "matched-by-default" : "matched";
  else if (untouched) status = "pending";
  else if (ok === 0) status = "diverged";
  else status = "partial";
  return { status, checks, ok, total };
}

// ----------------------------------------------------------------------------- main
async function main() {
  const state = loadState();
  const boot = (await fetchJson("bootstrap-static/")).body;
  if (!boot) return log(null, "fetch-failed", "bootstrap-static");

  const events = boot.events;
  const firstYear = new Date(events[0].deadline_time).getUTCFullYear();
  const season = `${firstYear}-${String((firstYear + 1) % 100).padStart(2, "0")}`;
  const next = events.find((e) => e.is_next) || null;
  const current = events.find((e) => e.is_current) || null;
  const now = Date.now();
  const hoursTo = (e) => (new Date(e.deadline_time).getTime() - now) / 36e5;
  const teams = Object.fromEntries(boot.teams.map((t) => [t.id, t.short_name]));
  const players = Object.fromEntries(boot.elements.map((p) => [p.id, p.web_name]));

  if (STATUS_ONLY) {
    console.log(JSON.stringify({ season, current: current?.id, next: next?.id, hours_to_next: next ? +hoursTo(next).toFixed(1) : null, state }, null, 2));
    return;
  }

  // ========================================================================= BACKWARD
  // Every finished+checked gameweek of this season whose Outcome is not yet on
  // main gets one post-mortem agent. Bounded to the two most recent so a fresh
  // install mid-season does not fan out over the whole history.
  const finished = events.filter((e) => e.finished && e.data_checked).slice(-2);
  for (const ev of finished) {
    const gw = ev.id;
    const pm = (state.postmortem[gw] ||= { attempts: 0 });
    if (pm.done) continue;

    const doc = outcomeOnMain(season, gw);
    if (doc.filled) {
      pm.done = nowIso();
      log(gw, "postmortem-landed", "Outcome filled on origin/main");
      continue;
    }
    const prUrl = openPrForBranch(`gw${gw}-outcome`);
    if (prUrl) {
      log(gw, "postmortem-pr-open", prUrl);
      continue;
    }
    if (pm.spawned_at && (now - new Date(pm.spawned_at).getTime()) / 36e5 < RESPAWN_AFTER_H) continue;
    if (pm.attempts >= MAX_ATTEMPTS) {
      if (!pm.alerted) {
        pm.alerted = nowIso();
        ntfy({ title: `FPL GW${gw}: post-mortem sitter fast`, prio: "high", msg: `${MAX_ATTEMPTS} forsøk uten PR. Sjekk acp list / events.jsonl i ${STATE_DIR}.` });
      }
      continue;
    }

    // Autosub veto: a 0-minute starter with automatic_subs == [] means the
    // finalisation pass has not actually run yet, whatever the flags say.
    const picks = (await fetchJson(`entry/${ENTRY}/event/${gw}/picks/`)).body;
    const live = (await fetchJson(`event/${gw}/live/`)).body;
    if (!picks || !live) {
      log(gw, "fetch-failed", "picks-or-live");
      continue;
    }
    const mins = Object.fromEntries(live.elements.map((e) => [e.id, e.stats.minutes]));
    const zeroStarters = picks.picks.filter((p) => p.position <= 11 && (mins[p.element] ?? 0) === 0);
    if (zeroStarters.length && !(picks.automatic_subs || []).length) {
      log(gw, "autosubs-pending", zeroStarters.map((p) => players[p.element]).join(","));
      continue;
    }

    const brief = renderBrief("postmortem", {
      GW: gw,
      SEASON: season,
      REPO,
      ENTRY,
      AVG: ev.average_entry_score,
      HIGHEST: ev.highest_score,
      MOST_CAPTAINED: players[ev.most_captained] || ev.most_captained,
      OUR_POINTS: picks.entry_history?.points,
      OUR_RANK: picks.entry_history?.overall_rank,
      DOC_EXISTS: doc.exists ? "exists" : "DOES NOT EXIST (write it retro-style, like 2026-27/gw2.md)",
    });
    pm.attempts += 1;
    pm.spawned_at = nowIso();
    saveState(state); // latch BEFORE dispatch
    const conv = acpSpawn(`FPL GW${gw} post-mortem`, `FPL GW${gw} is finalised. Read ${brief} and follow it exactly.`);
    pm.conversation = conv;
    log(gw, "postmortem-spawned", conv);
    ntfy({ title: `FPL GW${gw} ferdig: ${picks.entry_history?.points} poeng (snitt ${ev.average_entry_score})`, msg: `Post-mortem er i gang. ${conv}` });
  }

  // ========================================================================= LOCK
  // The deadline for `current` has passed. If we proposed something for it,
  // record what was actually done, once, from the now-public picks endpoint.
  if (current) {
    const fw = state.forward[current.id];
    if (fw && fw.phase !== "locked" && fw.phase !== "idle" && hoursTo(current) < 0) {
      const picks = (await fetchJson(`entry/${ENTRY}/event/${current.id}/picks/`)).body;
      if (picks?.picks?.length) {
        const proposalPath = path.join(STATE_DIR, "proposals", `gw${current.id}.json`);
        const proposal = fs.existsSync(proposalPath) ? JSON.parse(fs.readFileSync(proposalPath, "utf8")) : null;
        const actual = teamShape({ picks: picks.picks, transfers: { made: picks.entry_history?.event_transfers ?? 0 }, chips: picks.active_chip ? [{ name: picks.active_chip, status_for_entry: "active" }] : [] });
        const baseline = fw.baseline || actual;
        const cmp = proposal ? compareToProposal(actual, baseline, proposal) : { status: "no-proposal" };
        const lock = {
          gw: current.id,
          locked_at: nowIso(),
          deadline: current.deadline_time,
          proposal,
          actual: { ...actual, names: { captain: players[actual.captain], vice: players[actual.vice], xi: actual.xi.map((i) => players[i]), bench: actual.bench.map((i) => players[i]) } },
          transfers_cost: picks.entry_history?.event_transfers_cost ?? 0,
          active_chip: picks.active_chip,
          comparison: cmp,
        };
        if (!DRY) fs.writeFileSync(path.join(STATE_DIR, "locks", `gw${current.id}.json`), JSON.stringify(lock, null, 2));
        const brief = renderBrief("lock", { GW: current.id, SEASON: season, REPO, ENTRY, LOCK_JSON: path.join(STATE_DIR, "locks", `gw${current.id}.json`), STATUS: cmp.status, PROPOSAL_PR: proposal?.pr_url || "(none)" });
        fw.phase = "locked";
        fw.locked_at = nowIso();
        fw.lock_status = cmp.status;
        saveState(state);
        const conv = acpSpawn(`FPL GW${current.id} lock`, `The GW${current.id} deadline has passed. Read ${brief} and follow it exactly.`);
        fw.lock_conversation = conv;
        log(current.id, "lock-spawned", `${cmp.status} ${conv}`);
        ntfy({ title: `FPL GW${current.id} låst: ${cmp.status}`, msg: `C: ${players[actual.captain]}, ${actual.transfers_made} bytte(r)${lock.transfers_cost ? ` (-${lock.transfers_cost})` : ""}${picks.active_chip ? `, chip ${picks.active_chip}` : ""}. Beslutningen logges nå.` });
      } else {
        log(current.id, "lock-waiting", "picks not public yet");
      }
    }
  }

  // ========================================================================= FORWARD
  if (!next) {
    log(null, "season-over", "no is_next event");
    saveState(state);
    return;
  }
  const gw = next.id;
  const T = hoursTo(next);
  const fw = (state.forward[gw] ||= { phase: "idle", attempts: 0, nudged: {} });

  if (T > RESEARCH_LEAD_H) {
    log(gw, "idle", `T-${T.toFixed(1)}h`);
    saveState(state);
    return;
  }

  if (fw.phase === "idle") {
    // Forward reads backward: do not research GW N on top of an unwritten GW N-1.
    const prevPm = state.postmortem[gw - 1];
    const prevEvent = events.find((e) => e.id === gw - 1);
    const prevPending = prevEvent && prevEvent.finished && !(prevPm?.done);
    if (prevPending && T > 24) {
      log(gw, "waiting-postmortem", `gw${gw - 1} outcome not on main yet, T-${T.toFixed(1)}h`);
      saveState(state);
      return;
    }
    const team = await fetchJson(`my-team/${ENTRY}/`, { auth: true });
    if (team.status === 401 || team.status === 403) {
      authAlert(state, gw, T);
      saveState(state);
      return;
    }
    if (!team.body) {
      log(gw, "fetch-failed", `my-team ${team.status}`);
      saveState(state);
      return;
    }
    state.auth = { ok: nowIso() };
    const baseline = teamShape(team.body);
    if (!DRY) fs.writeFileSync(path.join(STATE_DIR, "snapshots", `gw${gw}-team.json`), JSON.stringify({ taken_at: nowIso(), ...baseline, raw: team.body }, null, 2));
    const brief = renderBrief("research", {
      GW: gw,
      SEASON: season,
      REPO,
      ENTRY,
      DEADLINE: next.deadline_time,
      HOURS_LEFT: T.toFixed(0),
      PROPOSAL_JSON: path.join(STATE_DIR, "proposals", `gw${gw}.json`),
      PREV_NOTE: prevPending ? `GW${gw - 1}'s Outcome is NOT on main yet (deadline is inside 24h, so we are not waiting). Read whatever exists and say so in the doc.` : `GW${gw - 1}'s post-mortem is on main. Read its Learnings and Adjustments first; they are the constraints for this week.`,
    });
    fw.phase = "researching";
    fw.attempts += 1;
    fw.spawned_at = nowIso();
    fw.baseline = baseline;
    saveState(state); // latch BEFORE dispatch
    const conv = acpSpawn(`FPL GW${gw} research`, `GW${gw} deadline is ${next.deadline_time} (${T.toFixed(0)}h away). Read ${brief} and follow it exactly.`);
    fw.conversation = conv;
    log(gw, "research-spawned", conv);
    ntfy({ title: `FPL GW${gw}: research i gang`, msg: `Frist ${fmtOslo(next.deadline_time)}. Forslag kommer når agenten er ferdig. ${conv}` });
    saveState(state);
    return;
  }

  if (fw.phase === "researching") {
    const proposalPath = path.join(STATE_DIR, "proposals", `gw${gw}.json`);
    if (fs.existsSync(proposalPath)) {
      let proposal;
      try {
        proposal = JSON.parse(fs.readFileSync(proposalPath, "utf8"));
      } catch (e) {
        log(gw, "proposal-unreadable", String(e));
        saveState(state);
        return;
      }
      if (proposal.error) {
        // The agent hit the stale-data hard stop and said so instead of waiting.
        if (!DRY) fs.renameSync(proposalPath, proposalPath + `.error-${Date.now()}`);
        fw.phase = "idle";
        log(gw, "research-aborted", proposal.error);
        if (proposal.error === "auth") authAlert(state, gw, T, true);
        saveState(state);
        return;
      }
      fw.phase = "proposed";
      fw.proposed_at = nowIso();
      fw.pr_url = proposal.pr_url || null;
      log(gw, "proposed", proposal.summary || "");
      ntfy({
        title: `FPL GW${gw}: forslag klart`,
        prio: "high",
        click: proposal.pr_url,
        msg: `${proposal.summary || "Se PR."} Frist ${fmtOslo(next.deadline_time)}. Gjør byttene i appen, så ser jeg det.`,
      });
      saveState(state);
      return;
    }
    const age = (now - new Date(fw.spawned_at).getTime()) / 36e5;
    if (age >= RESPAWN_AFTER_H) {
      if (fw.attempts >= MAX_ATTEMPTS) {
        if (!fw.alerted) {
          fw.alerted = nowIso();
          ntfy({ title: `FPL GW${gw}: research sitter fast`, prio: "high", msg: `${MAX_ATTEMPTS} forsøk, ingen proposal. Frist ${fmtOslo(next.deadline_time)}. Sjekk ${fw.conversation}` });
        }
      } else {
        fw.phase = "idle"; // next tick re-spawns with a fresh baseline
        log(gw, "research-timeout", `attempt ${fw.attempts} produced nothing in ${age.toFixed(1)}h`);
      }
    } else {
      log(gw, "researching", `${age.toFixed(1)}h in`);
    }
    saveState(state);
    return;
  }

  if (fw.phase === "proposed") {
    const proposal = JSON.parse(fs.readFileSync(path.join(STATE_DIR, "proposals", `gw${gw}.json`), "utf8"));
    const team = await fetchJson(`my-team/${ENTRY}/`, { auth: true });
    if (team.status === 401 || team.status === 403) {
      authAlert(state, gw, T);
      saveState(state);
      return;
    }
    if (!team.body) {
      log(gw, "fetch-failed", `my-team ${team.status}`);
      saveState(state);
      return;
    }
    state.auth = { ok: nowIso() };
    const cmp = compareToProposal(teamShape(team.body), fw.baseline, proposal);
    if (cmp.status !== fw.last_status) {
      log(gw, "team-status", `${fw.last_status || "-"} -> ${cmp.status} (${cmp.ok}/${cmp.total})`);
      fw.last_status = cmp.status;
      // matched-by-default = the proposal was "roll it" and the team already
      // looks like that; nothing to nudge about and nothing the human did.
      if (cmp.status !== "pending" && cmp.status !== "matched-by-default" && !fw.acted_at) {
        fw.acted_at = nowIso();
        const open = Object.entries(cmp.checks).filter(([, v]) => !v).map(([k]) => k);
        ntfy({
          title: `FPL GW${gw}: ser at du har gjort noe (${cmp.status})`,
          msg: open.length ? `Gjenstår fra forslaget: ${open.join(", ")}. Frist ${fmtOslo(next.deadline_time)}.` : `Laget matcher forslaget. Frist ${fmtOslo(next.deadline_time)}.`,
        });
      }
    }
    if (cmp.status === "pending") {
      for (const n of NUDGES) {
        if (T <= n.h && !fw.nudged[n.h]) {
          fw.nudged[n.h] = nowIso();
          ntfy({
            title: `FPL GW${gw}: ${T < 3 ? Math.round(T * 60) + " min" : Math.round(T) + "t"} til frist, ingen endringer sett`,
            prio: n.prio,
            click: proposal.pr_url,
            msg: proposal.summary || "Forslaget ligger i PR-en.",
          });
          log(gw, "nudged", `T-${n.h}h`);
          break;
        }
      }
    }
    saveState(state);
    return;
  }

  saveState(state);
}

function authAlert(state, gw, T, force = false) {
  const last = state.auth?.alerted ? (Date.now() - new Date(state.auth.alerted).getTime()) / 36e5 : Infinity;
  log(gw, "auth-dead", `my-team 401, T-${T.toFixed(1)}h`);
  if (last < 6 && !force) return; // one ring per six hours, not one per tick
  state.auth = { ...state.auth, alerted: nowIso() };
  const prio = T < 24 ? "urgent" : "high";
  const keepalive = path.join(REPO, "scripts", "auth-keepalive.sh");
  const broker = spawnSync("sh", ["-c", "command -v oauth-token"], { stdio: "ignore" }).status === 0;
  if (broker) {
    // ONE notification, and its tap IS the fix: auth-keepalive.sh --login
    // runs `oauth-token login fpl --force`, which rings ntfy with the broker's
    // approve page as the click action and waits (20 min) for the human. The
    // keepalive owns the doorbell (and rate-limits it to one ring per 6 h via
    // --if-due, shared with its own scheduled run), so this tick sends nothing
    // of its own — a second buzz saying "go tap the other buzz" is noise.
    // Detached: the tick never blocks on a phone. (Until 2026-09-17 this rang
    // itself and pointed at fpl-auth.beast.go, the box's own paste-back page;
    // the broker's approve page is that page now.)
    const env = { ...process.env, OAUTH_TOKEN_NTFY_PRIORITY: prio,
      FPL_LOGIN_LABEL: `FPL GW${gw} · innloggingen er død · frist om ${Math.round(T)}t` };
    if (DRY) { console.log(`DRY ${keepalive} --login --if-due (detached, ${prio})`); return; }
    try {
      const child = spawn("nohup", [keepalive, "--login", "--if-due"], { cwd: REPO, env, detached: true, stdio: "ignore" });
      child.unref();
    } catch (e) {
      log(gw, "auth-login-spawn-failed", String(e?.message || e));
    }
    return;
  }
  ntfy({
    title: "FPL: innloggingen er død",
    prio,
    msg: `my-team svarer 401 og GW${gw}-fristen er om ${Math.round(T)}t. Logg inn på nytt (source setup.sh --login på boksen), så fortsetter loopen av seg selv.`,
  });
}

function fmtOslo(iso) {
  return new Date(iso).toLocaleString("nb-NO", { timeZone: "Europe/Oslo", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

main().catch((e) => {
  log(null, "tick-crashed", String(e?.stack || e));
  process.exit(0); // never a red job for a transient error; the next hour retries
});
