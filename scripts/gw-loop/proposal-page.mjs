#!/usr/bin/env node
// =============================================================================
// proposal-page — the ONE visual a research run produces.
//
// Deterministic (no LLM): reads the proposal JSON the research agent wrote, the
// live FPL API and the agent's sourced notes, and renders a self-contained,
// phone-first HTML page, the same view every gameweek. The doc (gw<N>.md) is
// what the next run reads; this page is what the human decides on.
//
// Sections, in this order, always:
//   header + the "calculated, not predicted" warning
//   the call (chip, transfers, captain, calculated XI vs keeping the squad)
//   the pitch (proposed XI by position, bench below; tap a shirt for its card)
//   transfers (out -> in, side by side) and who is kept
//   one card per proposed player: points, last five matches with scores, next
//     six fixtures, this week's matchup + head-to-head, why (sourced), news,
//     calculated points, feedback buttons
//   the sold players, same cards
//   your feedback (collected from the buttons, copy it into the session)
//   how the calculation works + a table view
//
// Add a section here when we add one to the process; do not improvise per week.
//
//   proposal-page.mjs --gw 6 [--proposal file] [--notes file] [--session url]
//                     [--out /tmp/x.html] [--publish]
//
// --proposal defaults to $FPL_LOOP_STATE/proposals/gw<N>.json. Notes come from
// the proposal's "notes" key, or --notes <file> (same shape, see below).
// --publish hands the file to `artifact publish` under the slug
// fpl-gw<N>-proposal and prints the URL, which is stable across re-publishes.
//
// Notes shape (all optional; written by the research agent, every claim sourced):
//   { "h2h":     { "MUN-TOT": { "text": "...", "url": "..." } },          // home-away short names
//     "players": { "426": { "why":   [{ "text": "...", "source": "...", "url": "..." }],
//                           "news":  { "text": "...", "url": "..." },
//                           "avail": { "6": 0.25 } } } }                    // P(start) override per GW
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

const STATE_DIR = process.env.FPL_LOOP_STATE || "/workspace/.spawn/fpl-gw-loop";
const SECRETS = path.join(process.env.HOME || "/home/node", ".fpl", "secrets.env");
const API = "https://fantasy.premierleague.com/api";
const HORIZON = 6; // gameweeks in the "next six" calculation
const REG = 0.5; // attacking rates shrunk halfway to the positional mean (GW3 method)
const SHR = 0.5; // team attack/defence factors shrunk halfway to 1

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dflt;
};
const GW = Number(opt("gw"));
if (!GW) {
  console.error("usage: proposal-page.mjs --gw <N> [--proposal file] [--notes file] [--session url] [--out file] [--publish]");
  process.exit(2);
}
const PUBLISH = args.includes("--publish");
const proposalPath = opt("proposal", path.join(STATE_DIR, "proposals", `gw${GW}.json`));
const proposal = JSON.parse(fs.readFileSync(proposalPath, "utf8"));
if (proposal.error) {
  console.error(`proposal for GW${GW} is an error record (${proposal.error}); nothing to render`);
  process.exit(1);
}
const notesPath = opt("notes");
const notes = notesPath ? JSON.parse(fs.readFileSync(notesPath, "utf8")) : proposal.notes || {};
const SESSION = opt("session", proposal.session_url || "");

// ----------------------------------------------------------------------------- io
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
    /* public endpoints still work */
  }
  return out;
}
const secrets = readSecrets();
const ENTRY = process.env.FPL_MANAGER_ID || secrets.FPL_MANAGER_ID;

async function fetchJson(endpoint) {
  const sep = endpoint.includes("?") ? "&" : "?";
  const url = `${API}/${endpoint}${sep}_cb=${Date.now()}${process.pid}`;
  const headers = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "User-Agent": "FPL-MCP-Server/1.0 (+https://fantasy.premierleague.com)",
    Origin: "https://fantasy.premierleague.com",
    Referer: "https://fantasy.premierleague.com/",
  };
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`${endpoint} -> HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (attempt >= 2) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
}

// ----------------------------------------------------------------------------- data
const [boot, fixturesAll] = await Promise.all([fetchJson("bootstrap-static/"), fetchJson("fixtures/")]);
const ev = boot.events.find((e) => e.id === GW);
if (!ev) throw new Error(`no event ${GW} in bootstrap`);
const seasonStart = new Date(boot.events[0].deadline_time).getUTCFullYear();
const SEASON = opt("season", proposal.season || `${seasonStart}-${String(seasonStart + 1).slice(2)}`);
const teamShort = Object.fromEntries(boot.teams.map((t) => [t.id, t.short_name]));
const teamName = Object.fromEntries(boot.teams.map((t) => [t.id, t.name]));
const el = Object.fromEntries(boot.elements.map((p) => [p.id, p]));
const POS = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };
let entryName = "";
if (ENTRY) {
  try {
    entryName = (await fetchJson(`entry/${ENTRY}/`)).name;
  } catch {
    /* name is decoration */
  }
}

// Who is who: proposed fifteen, current fifteen (proposal with transfers undone).
const xi = proposal.xi || [];
const bench = proposal.bench || [];
const squad = [...xi, ...bench];
const ins = new Set((proposal.transfers || []).map((t) => t.in));
const outs = (proposal.transfers || []).map((t) => t.out);
const current = [...squad.filter((id) => !ins.has(id)), ...outs];
for (const id of [...squad, ...outs]) if (!el[id]) throw new Error(`element ${id} not in bootstrap`);

// ---- the calculation (GW3 model, as used in the GW6 research run) ----------
const finished = fixturesAll.filter((f) => f.finished);
const games = Object.fromEntries(boot.teams.map((t) => [t.id, 0]));
for (const f of finished) {
  games[f.team_h]++;
  games[f.team_a]++;
}
const tx = Object.fromEntries(boot.teams.map((t) => [t.id, { f: 0, a: 0 }]));
for (const e of boot.elements) {
  tx[e.team].f += Number(e.expected_goals) || 0;
  tx[e.team].a += (Number(e.expected_goals_conceded) || 0) / 11;
}
const ids = boot.teams.map((t) => t.id);
const perGame = (t, k) => tx[t][k] / Math.max(1, games[t]);
const lgFor = ids.reduce((s, t) => s + perGame(t, "f"), 0) / ids.length;
const lgAg = ids.reduce((s, t) => s + perGame(t, "a"), 0) / ids.length;
const ATT = Object.fromEntries(ids.map((t) => [t, 1 + SHR * (perGame(t, "f") / lgFor - 1)]));
const DEFF = Object.fromEntries(ids.map((t) => [t, 1 + SHR * (perGame(t, "a") / lgAg - 1)]));
const MU = (lgFor + lgAg) / 2;
const posAvg = {};
for (const p of [2, 3, 4]) {
  const L = boot.elements.filter((e) => e.element_type === p && e.minutes >= 300);
  const n = Math.max(1, L.length);
  posAvg[p] = {
    xg: L.reduce((s, e) => s + Number(e.expected_goals_per_90), 0) / n,
    xa: L.reduce((s, e) => s + Number(e.expected_assists_per_90), 0) / n,
  };
}
const GV = { 1: 6, 2: 6, 3: 5, 4: 4 };
const CSV = { 1: 4, 2: 4, 3: 1, 4: 0 };
const THR = { 2: 10, 3: 12, 4: 12 };
const gwFixtures = (team, g) =>
  fixturesAll.filter((f) => f.event === g && (f.team_h === team || f.team_a === team)).map((f) => ({ opp: f.team_h === team ? f.team_a : f.team_h, home: f.team_h === team, fdr: f.team_h === team ? f.team_h_difficulty : f.team_a_difficulty, kickoff: f.kickoff_time }));

function pStart(e, g) {
  const ov = notes.players?.[e.id]?.avail?.[g];
  const base = e.minutes ? Math.min(1, e.minutes / (90 * Math.max(1, games[e.team]))) : 0;
  if (ov != null) return base * ov;
  if (["u", "n", "s"].includes(e.status)) return 0;
  if (e.status === "i") return g <= GW + 1 ? 0 : base * 0.6;
  if (e.status === "d") {
    const c = (e.chance_of_playing_next_round ?? 0) / 100;
    return base * (g === GW ? c : Math.min(1, c + 0.2));
  }
  return base;
}
function xpFix(e, opp, home, ps) {
  const pos = e.element_type;
  let xg = Number(e.expected_goals_per_90) || 0;
  let xa = Number(e.expected_assists_per_90) || 0;
  if (pos !== 1) {
    xg = (1 - REG) * xg + REG * posAvg[pos].xg;
    xa = (1 - REG) * xa + REG * posAvg[pos].xa;
  }
  const m = DEFF[opp] * (home ? 1.1 : 0.9);
  const att = (xg * GV[pos] + xa * 3) * m;
  const la = MU * DEFF[e.team] * ATT[opp] * (home ? 0.9 : 1.1);
  const pcs = Math.exp(-la);
  const cs = pcs * CSV[pos];
  const pen = pos <= 2 ? -0.5 * la : 0;
  const dc90 = Number(e.defensive_contribution_per_90) || 0;
  const pdc = pos === 1 ? 0 : Math.max(0.03, Math.min(0.8, 0.5 + (dc90 / THR[pos] - 1) * 1.5));
  const saves = pos === 1 ? 0.3 + 0.4 * la : 0;
  const bonus = 0.25 + 0.5 * (xg + xa) * m + (pos <= 2 ? 0.3 : 0) * pcs;
  return { total: ps * (2 + att + cs + pen + 2 * pdc + saves + bonus), att: ps * att, pcs, ps };
}
function calc(e) {
  const per = [];
  for (let g = GW; g < GW + HORIZON; g++) {
    const fx = gwFixtures(e.team, g);
    const ps = pStart(e, g);
    const parts = fx.map((f) => xpFix(e, f.opp, f.home, ps));
    per.push({ gw: g, xp: parts.reduce((s, p) => s + p.total, 0), att: parts.reduce((s, p) => s + p.att, 0), pcs: parts[0]?.pcs ?? null, ps, fx: fx.map((f) => ({ opp: teamShort[f.opp], home: f.home, fdr: f.fdr })) });
  }
  return { gw: per[0].xp, six: per.reduce((s, p) => s + p.xp, 0), per };
}

// Best XI + captain for a set of fifteen, by calculated points (formation rules).
function bestXi(idsIn, key) {
  const by = { 1: [], 2: [], 3: [], 4: [] };
  for (const id of idsIn) by[el[id].element_type].push(id);
  for (const p in by) by[p].sort((a, b) => key(b) - key(a));
  let best = null;
  for (let d = 3; d <= 5; d++)
    for (let m = 2; m <= 5; m++) {
      const f = 10 - d - m;
      if (f < 1 || f > 3 || by[2].length < d || by[3].length < m || by[4].length < f || !by[1].length) continue;
      const pick = [by[1][0], ...by[2].slice(0, d), ...by[3].slice(0, m), ...by[4].slice(0, f)];
      const cap = pick.filter((id) => el[id].element_type >= 3).sort((a, b) => key(b) - key(a))[0] ?? pick[0];
      const total = pick.reduce((s, id) => s + key(id), 0) + key(cap);
      if (!best || total > best.total) best = { total, pick, cap, shape: `${d}-${m}-${f}` };
    }
  return best;
}

// ---- per-player detail ------------------------------------------------------
const everyone = [...new Set([...squad, ...outs])];
const summaries = {};
for (let i = 0; i < everyone.length; i += 6) {
  const chunk = everyone.slice(i, i + 6);
  const res = await Promise.all(chunk.map((id) => fetchJson(`element-summary/${id}/`)));
  chunk.forEach((id, j) => (summaries[id] = res[j]));
}
function teamForm(team, n = 5) {
  return finished
    .filter((f) => f.team_h === team || f.team_a === team)
    .sort((a, b) => a.event - b.event)
    .slice(-n)
    .map((f) => {
      const home = f.team_h === team;
      const gf = home ? f.team_h_score : f.team_a_score;
      const ga = home ? f.team_a_score : f.team_h_score;
      return { gw: f.event, opp: teamShort[home ? f.team_a : f.team_h], home, gf, ga, r: gf > ga ? "W" : gf < ga ? "L" : "D" };
    });
}
const calcs = {};
for (const id of everyone) calcs[id] = calc(el[id]);

const players = {};
for (const id of everyone) {
  const e = el[id];
  const s = summaries[id];
  const hist = (s.history || []).slice().sort((a, b) => a.round - b.round);
  const last5 = hist.slice(-5).map((h) => {
    const home = h.was_home;
    const gf = home ? h.team_h_score : h.team_a_score;
    const ga = home ? h.team_a_score : h.team_h_score;
    return { gw: h.round, opp: teamShort[h.opponent_team], home, gf, ga, r: gf > ga ? "W" : gf < ga ? "L" : "D", pts: h.total_points, min: h.minutes, g: h.goals_scored, a: h.assists, cs: h.clean_sheets, bonus: h.bonus, dc: h.defensive_contribution, xgi: Number(h.expected_goal_involvements) };
  });
  const next = (s.fixtures || []).slice(0, HORIZON).map((f) => ({ gw: f.event, opp: teamShort[f.is_home ? f.team_a : f.team_h], home: f.is_home, fdr: f.difficulty }));
  const thisFx = gwFixtures(e.team, GW)[0];
  const matchup = thisFx
    ? (() => {
        const hk = thisFx.home ? `${teamShort[e.team]}-${teamShort[thisFx.opp]}` : `${teamShort[thisFx.opp]}-${teamShort[e.team]}`;
        const met = finished.filter((f) => (f.team_h === e.team && f.team_a === thisFx.opp) || (f.team_a === e.team && f.team_h === thisFx.opp)).map((f) => `GW${f.event}: ${teamShort[f.team_h]} ${f.team_h_score}-${f.team_a_score} ${teamShort[f.team_a]}`);
        const vsOpp = hist.filter((h) => h.opponent_team === thisFx.opp).map((h) => `GW${h.round}: ${h.total_points} pts`);
        return { opp: teamShort[thisFx.opp], oppName: teamName[thisFx.opp], home: thisFx.home, fdr: thisFx.fdr, kickoff: thisFx.kickoff, oppForm: teamForm(thisFx.opp), ownForm: teamForm(e.team), h2h: notes.h2h?.[hk] || null, metThisSeason: met, playerVsOpp: vsOpp };
      })()
    : null;
  const past = (s.history_past || []).slice(-1)[0] || null;
  const n = notes.players?.[id] || {};
  players[id] = {
    id,
    name: e.web_name,
    full: `${e.first_name} ${e.second_name}`,
    team: teamShort[e.team],
    teamName: teamName[e.team],
    pos: POS[e.element_type],
    posN: e.element_type,
    price: e.now_cost / 10,
    own: Number(e.selected_by_percent),
    status: e.status,
    chance: e.chance_of_playing_next_round,
    news: e.news || "",
    newsAdded: e.news_added ? e.news_added.slice(0, 10) : "",
    total: e.total_points,
    ppg: Number(e.points_per_game),
    form: Number(e.form),
    minutes: e.minutes,
    starts: e.starts,
    teamGames: games[e.team],
    goals: e.goals_scored,
    assists: e.assists,
    cs: e.clean_sheets,
    bonus: e.bonus,
    xgi90: Number(e.expected_goal_involvements_per_90),
    xg: Number(e.expected_goals),
    xa: Number(e.expected_assists),
    dc90: Number(e.defensive_contribution_per_90),
    saves: e.saves,
    saves90: Number(e.saves_per_90) || 0,
    lastSeason: past ? { name: past.season_name, pts: past.total_points, min: past.minutes } : null,
    role: ins.has(id) ? "in" : outs.includes(id) ? "out" : "kept",
    slot: xi.includes(id) ? "xi" : bench.includes(id) ? "bench" : "sold",
    benchOrder: bench.indexOf(id) >= 0 ? bench.indexOf(id) + 1 : null,
    captain: proposal.captain === id,
    vice: proposal.vice === id,
    last5,
    next,
    matchup,
    calc: { gw: calcs[id].gw, six: calcs[id].six, per: calcs[id].per },
    why: n.why || [],
    noteNews: n.news || null,
    availOverride: n.avail || null,
  };
}

const propXi = xi.reduce((s, id) => s + calcs[id].gw, 0) + (proposal.captain ? calcs[proposal.captain].gw : 0);
const propXi6 = bestXi(squad, (id) => calcs[id].six);
const keepXi = bestXi(current, (id) => calcs[id].gw);
const keepXi6 = bestXi(current, (id) => calcs[id].six);
const transfersOut = (proposal.transfers || []).map((t) => ({ out: t.out, in: t.in }));
const priceOut = outs.reduce((s, id) => s + el[id].now_cost, 0) / 10;
const priceIn = [...ins].reduce((s, id) => s + el[id].now_cost, 0) / 10;

const data = {
  gw: GW,
  season: SEASON,
  entryName,
  deadline: ev.deadline_time,
  generated: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
  summary: proposal.summary || "",
  chip: proposal.chip || null,
  hit: proposal.hit || 0,
  prUrl: proposal.pr_url || "",
  session: SESSION,
  zeroAlt: proposal.zero_transfer_alternative || "",
  bankAfter: proposal.bank_after ?? null,
  xi,
  bench,
  outs,
  captain: proposal.captain,
  vice: proposal.vice,
  transfers: transfersOut,
  priceOut,
  priceIn,
  calcSummary: {
    propGw: propXi,
    keepGw: keepXi?.total ?? null,
    keepShape: keepXi?.shape,
    keepCap: keepXi ? el[keepXi.cap].web_name : null,
    prop6: propXi6?.total ?? null,
    keep6: keepXi6?.total ?? null,
  },
  players,
  horizon: HORIZON,
};

// ----------------------------------------------------------------------------- html
const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FPL GW${GW} proposal${entryName ? " · " + esc(entryName) : ""}</title>
<style>
  :root {
    color-scheme: light;
    --surface: #fcfcfb; --plane: #f9f9f7;
    --ink: #0b0b0b; --ink2: #52514e; --muted: #898781;
    --grid: #e1e0d9; --axis: #c3c2b7; --border: rgba(11,11,11,0.10);
    --s1: #2a78d6; --s2: #eb6834; --other: #c3c2b7;
    --good: #006300; --bad: #d03b3b; --warnbg: #fff4d6; --warnink: #5c3d00; --warnline: #fab219;
    --e1: #1c5cab; --e2: #8fbaf0; --e3: #e8e7e2; --e4: #f2a6a6; --e5: #c42f2f;
    --pitch1: #2f7d46; --pitch2: #2a7240; --pline: rgba(255,255,255,0.55);
    --new: #2a78d6; --kept: #898781; --out: #d03b3b;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
      --surface: #1a1a19; --plane: #0d0d0d;
      --ink: #ffffff; --ink2: #c3c2b7; --muted: #898781;
      --grid: #2c2c2a; --axis: #383835; --border: rgba(255,255,255,0.10);
      --s1: #3987e5; --s2: #d95926; --other: #52514e;
      --good: #0ca30c; --bad: #e66767; --warnbg: #3a2c05; --warnink: #ffe2a3; --warnline: #fab219;
      --e1: #3987e5; --e2: #1f4a7d; --e3: #383835; --e4: #7a2a2a; --e5: #e66767;
      --pitch1: #1f4d2c; --pitch2: #1b4527; --pline: rgba(255,255,255,0.35);
      --new: #3987e5; --kept: #898781; --out: #e66767;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--plane); color: var(--ink);
    font: 15px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 720px; margin: 0 auto; padding: 16px 12px 48px; }
  h1 { font-size: 20px; margin: 4px 0 2px; font-weight: 600; }
  .sub { color: var(--ink2); font-size: 13px; margin: 0 0 12px; }
  h2 { font-size: 16px; font-weight: 600; margin: 0 0 2px; }
  h3 { font-size: 14px; font-weight: 600; margin: 12px 0 4px; }
  .lede { color: var(--ink2); font-size: 13px; margin: 0 0 10px; }
  a { color: var(--s1); }
  section.card { background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 14px 12px; margin: 0 0 14px; }
  .warn { background: var(--warnbg); color: var(--warnink); border: 2px solid var(--warnline);
    border-radius: 10px; padding: 12px 14px; margin: 0 0 14px; font-size: 14px; }
  .warn b.big { display: block; font-size: 17px; margin-bottom: 4px; }
  .calc { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase; color: var(--warnink); background: var(--warnbg);
    border: 1px solid var(--warnline); border-radius: 4px; padding: 0 4px; vertical-align: 1px; }
  .tiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  @media (min-width: 560px) { .tiles.t3 { grid-template-columns: repeat(3, 1fr); } }
  .tile { border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
  .tile .label { font-size: 12px; color: var(--ink2); }
  .tile .value { font-size: 20px; font-weight: 600; line-height: 1.25; }
  .tile .d { font-size: 12px; color: var(--ink2); }
  .delta { font-weight: 600; color: var(--good); }
  .delta.down { color: var(--bad); }
  /* pitch */
  .pitch { position: relative; border-radius: 10px; padding: 10px 4px 6px;
    background: repeating-linear-gradient(180deg, var(--pitch1) 0 44px, var(--pitch2) 44px 88px);
    border: 2px solid var(--pline); overflow: hidden; }
  .pitch::before { content: ""; position: absolute; left: 50%; top: -60px; width: 120px; height: 120px;
    margin-left: -60px; border: 2px solid var(--pline); border-radius: 50%; }
  .pitch::after { content: ""; position: absolute; left: 22%; right: 22%; bottom: -2px; height: 54px;
    border: 2px solid var(--pline); border-bottom: 0; }
  .row { display: flex; justify-content: space-evenly; gap: 2px; margin: 6px 0 10px; position: relative; z-index: 1; }
  .shirt { width: 19%; max-width: 104px; text-align: center; color: #fff; text-decoration: none; cursor: pointer;
    background: none; border: 0; padding: 0; font: inherit; }
  .shirt .kit { position: relative; margin: 0 auto 3px; width: 40px; height: 40px; border-radius: 9px 9px 7px 7px;
    background: #f4f4f2; color: #0b0b0b; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; border: 3px solid var(--kept); }
  .shirt.in .kit { border-color: var(--new); }
  .shirt .badge { position: absolute; top: -8px; right: -10px; background: #0b0b0b; color: #fff; border-radius: 50%;
    width: 20px; height: 20px; font-size: 11px; line-height: 20px; border: 2px solid #fff; }
  .shirt .nm { display: block; background: rgba(0,0,0,0.72); border-radius: 4px 4px 0 0; font-size: 11.5px;
    font-weight: 600; padding: 1px 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .shirt .fx { display: block; border-radius: 0 0 4px 4px; font-size: 11px; padding: 1px 2px; color: #0b0b0b; font-weight: 600; }
  .shirt .xp { display: block; font-size: 11px; color: #fff; margin-top: 1px; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
  .benchrow { display: flex; justify-content: space-evenly; gap: 2px; margin-top: 8px; padding: 10px 4px 6px;
    background: var(--plane); border: 1px dashed var(--axis); border-radius: 10px; }
  .benchrow .shirt { color: var(--ink); }
  .benchrow .shirt .xp { color: var(--ink2); text-shadow: none; }
  .key { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: var(--ink2); margin: 8px 0 0; }
  .key span { display: inline-flex; align-items: center; gap: 5px; }
  .sq { width: 12px; height: 12px; border-radius: 3px; display: inline-block; border: 2px solid; background: #f4f4f2; }
  .fdr { display: inline-block; min-width: 18px; text-align: center; border-radius: 3px; font-weight: 600; }
  .f1 { background: var(--e1); color: #fff; } .f2 { background: var(--e2); color: #0b0b0b; }
  .f3 { background: var(--e3); color: var(--ink); } .f4 { background: var(--e4); color: #0b0b0b; }
  .f5 { background: var(--e5); color: #fff; }
  /* transfers */
  .tr { display: grid; grid-template-columns: 1fr 22px 1fr; gap: 6px; align-items: stretch; margin-bottom: 8px; }
  .tr .arrow { display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 18px; }
  .pm { border: 1px solid var(--border); border-left: 4px solid var(--kept); border-radius: 8px; padding: 6px 8px;
    font-size: 12px; cursor: pointer; background: none; text-align: left; color: inherit; font-family: inherit; width: 100%; }
  .pm.out { border-left-color: var(--out); } .pm.in { border-left-color: var(--new); }
  .pm b { font-size: 14px; display: block; }
  .pm .m { color: var(--ink2); }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { border: 1px solid var(--border); border-radius: 999px; padding: 3px 10px; font-size: 13px; background: none;
    color: inherit; font-family: inherit; cursor: pointer; }
  .tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .04em; border-radius: 4px;
    padding: 0 5px; vertical-align: 1px; color: #fff; }
  .tag.in { background: var(--new); } .tag.kept { background: var(--kept); } .tag.out { background: var(--out); }
  .tag.c { background: var(--ink); color: var(--surface); }
  /* player cards */
  details.pc { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin: 0 0 10px;
    border-left: 5px solid var(--kept); }
  details.pc.in { border-left-color: var(--new); } details.pc.out { border-left-color: var(--out); }
  details.pc > summary { list-style: none; cursor: pointer; padding: 10px 12px; display: flex; gap: 10px; align-items: center; }
  details.pc > summary::-webkit-details-marker { display: none; }
  .sumname { flex: 1; min-width: 0; }
  .sumname b { font-size: 15px; }
  .sumname .m { display: block; color: var(--ink2); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sumxp { text-align: right; font-size: 12px; color: var(--ink2); }
  .sumxp b { display: block; font-size: 18px; color: var(--ink); }
  .pcb { padding: 0 12px 12px; }
  .flagline { border-left: 3px solid var(--warnline); background: var(--warnbg); color: var(--warnink); padding: 6px 8px;
    border-radius: 4px; font-size: 13px; margin: 0 0 8px; }
  svg { display: block; width: 100%; height: auto; overflow: visible; }
  svg text { font-family: inherit; fill: var(--ink2); font-size: 11px; }
  svg .tick { fill: var(--muted); font-variant-numeric: tabular-nums; }
  svg .val { fill: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
  svg .grid { stroke: var(--grid); stroke-width: 1; }
  svg .base { stroke: var(--axis); stroke-width: 1; }
  .mark:hover, .mark:focus { filter: brightness(1.15); outline: none; }
  .strip { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; font-size: 11px; text-align: center; }
  .strip div { border-radius: 4px; padding: 3px 0; }
  .strip small { display: block; font-size: 10px; opacity: .85; }
  .res { display: inline-block; min-width: 18px; text-align: center; border-radius: 3px; font-size: 11px; font-weight: 700;
    border: 1px solid var(--border); margin-right: 2px; }
  .res.W { color: var(--good); } .res.L { color: var(--bad); } .res.D { color: var(--ink2); }
  ul.why { margin: 4px 0 0; padding-left: 18px; font-size: 13px; }
  ul.why li { margin-bottom: 3px; }
  ul.why .src { color: var(--muted); font-size: 12px; }
  .fb { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; align-items: center; }
  .fb button { border: 1px solid var(--border); background: var(--plane); color: var(--ink); border-radius: 999px;
    padding: 5px 10px; font: inherit; font-size: 13px; cursor: pointer; }
  .fb button[aria-pressed="true"] { background: var(--ink); color: var(--surface); }
  .fb input { flex: 1; min-width: 140px; border: 1px solid var(--border); border-radius: 8px; padding: 6px 8px;
    background: var(--plane); color: var(--ink); font: inherit; font-size: 13px; }
  textarea { width: 100%; min-height: 120px; border: 1px solid var(--border); border-radius: 8px; padding: 8px;
    background: var(--plane); color: var(--ink); font: 13px/1.4 ui-monospace, monospace; }
  .btn { border: 0; background: var(--s1); color: #fff; border-radius: 8px; padding: 8px 14px; font: inherit;
    font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
  .btn.ghost { background: none; color: var(--s1); border: 1px solid var(--s1); }
  #tip { position: fixed; pointer-events: none; background: var(--ink); color: var(--surface);
    padding: 6px 9px; border-radius: 6px; font-size: 12px; line-height: 1.35; display: none; max-width: 250px; z-index: 9; }
  #tip b { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  th, td { text-align: left; padding: 5px 4px; border-top: 1px solid var(--grid); vertical-align: top; }
  th { color: var(--ink2); font-weight: 500; border-top: 0; font-size: 12px; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  details.more summary { cursor: pointer; color: var(--ink2); font-size: 13px; margin: 6px 0; }
  footer { color: var(--muted); font-size: 12px; margin-top: 8px; }
  .muted { color: var(--muted); }
  code { font-size: 12px; }
</style>
</head>
<body>
<main>
  <h1 id="title"></h1>
  <p class="sub" id="sub"></p>
  <div class="warn" role="note">
    <b class="big">⚠️ Calculated, not predicted</b>
    Every "calc" number on this page comes from a simple model of this season's underlying stats
    (xG, xA, defensive contributions, team xG for and against, minutes). It does not know about
    injuries beyond the API flag, rotation, penalties, the referee or luck, and single-match
    scores swing far more than it can see: a "5.1" is routinely a 1 or a 15. Use it to compare
    options against each other, never as a forecast of what a player will score.
  </div>
  <section class="card" id="call"><h2>The call</h2><p class="lede" id="call-lede"></p><div class="tiles t3" id="call-tiles"></div></section>
  <section class="card">
    <h2>On the pitch</h2>
    <p class="lede">Tap a shirt for the player's card. Under each name: this week's opponent (capitals = home) coloured by FPL difficulty, then calculated points.</p>
    <div class="pitch" id="pitch"></div>
    <div class="benchrow" id="benchrow"></div>
    <div class="key">
      <span><i class="sq" style="border-color:var(--new)"></i>New this week</span>
      <span><i class="sq" style="border-color:var(--kept)"></i>Kept</span>
      <span>Difficulty <i class="fdr f1">1</i><i class="fdr f2">2</i><i class="fdr f3">3</i><i class="fdr f4">4</i><i class="fdr f5">5</i></span>
    </div>
  </section>
  <section class="card">
    <h2 id="tr-h">Transfers</h2>
    <p class="lede" id="tr-lede"></p>
    <div id="transfers"></div>
    <h3 id="kept-h">Kept</h3>
    <div class="chips" id="kept"></div>
  </section>
  <section class="card" id="players-card">
    <h2>The fifteen</h2>
    <p class="lede">One card per player, in pitch order. Open one to see the last five matches, the next six fixtures, this week's matchup and why the player is here. React on any card; it lands in the feedback box at the bottom.</p>
    <div id="cards"></div>
  </section>
  <section class="card" id="sold-card">
    <h2>Sold</h2>
    <p class="lede">The same cards for everyone going out, so you can see what you give up.</p>
    <div id="sold"></div>
  </section>
  <section class="card" id="feedback">
    <h2>Your feedback</h2>
    <p class="lede" id="fb-lede">Reactions from the cards collect here. Add anything general below, copy it, and paste it into the research session.</p>
    <div class="fb" style="margin:0 0 8px"><input id="fb-general" placeholder="General comment on the whole proposal"></div>
    <textarea id="fb-out" readonly></textarea>
    <div class="fb"><button class="btn" id="fb-copy" type="button">Copy feedback</button><a class="btn ghost" id="fb-session" target="_blank" rel="noopener">Open the session</a><span class="muted" id="fb-status"></span></div>
  </section>
  <details class="more"><summary>How the calculation works</summary><div class="lede" id="method"></div></details>
  <details class="more"><summary>Table view</summary><table id="tbl"></table></details>
  <footer id="foot"></footer>
</main>
<div id="tip" role="status"></div>
<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>
const D=JSON.parse(document.getElementById('data').textContent);
const P=D.players;
const NS='http://www.w3.org/2000/svg';
const sv=(t,a,parent)=>{const e=document.createElementNS(NS,t);for(const k in (a||{}))e.setAttribute(k,a[k]);if(parent)parent.appendChild(e);return e;};
const txt=(parent,x,y,s,cls,anchor)=>{const t=sv('text',{x:x,y:y,class:cls||'','text-anchor':anchor||'start','dominant-baseline':'middle'},parent);t.textContent=s;return t;};
const h=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
const f1=n=>(Math.round(n*10)/10).toFixed(1);
const sign=n=>(n>0?'+':'')+n;
const oppTxt=(o,home)=>home?o.toUpperCase():o.toLowerCase();
const tip=document.getElementById('tip');
function bindTip(node,lines){
  const show=e=>{tip.replaceChildren();lines.forEach((l,i)=>{const d=h('div');if(i===0)d.appendChild(h('b',null,l));else d.textContent=l;tip.appendChild(d);});tip.style.display='block';move(e);};
  const move=e=>{tip.style.left=Math.min((e.clientX||0)+12,window.innerWidth-260)+'px';tip.style.top=((e.clientY||0)+14)+'px';};
  const hide=()=>tip.style.display='none';
  node.classList.add('mark');node.setAttribute('tabindex','0');
  node.addEventListener('pointerenter',show);node.addEventListener('pointermove',move);node.addEventListener('pointerleave',hide);
  node.addEventListener('focus',()=>{const r=node.getBoundingClientRect();show({clientX:r.left+r.width/2,clientY:r.top});});node.addEventListener('blur',hide);
}
function vbar(x,y0,w,hgt,r){r=Math.min(r,hgt,w/2);if(hgt<=0)return '';
  return 'M'+x+','+y0+'v-'+(hgt-r)+'a'+r+','+r+',0,0,1,'+r+',-'+r+'h'+(w-2*r)+'a'+r+','+r+',0,0,1,'+r+','+r+'v'+(hgt-r)+'z';}
const calcTag=()=>h('span','calc','calc');
function openCard(id){const d=document.getElementById('card-'+id);if(!d)return;d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}

// header
const dl=new Date(D.deadline);
const oslo=dl.toLocaleString('en-GB',{timeZone:'Europe/Oslo',weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
document.getElementById('title').textContent='GW'+D.gw+' proposal'+(D.entryName?' · '+D.entryName:'');
document.getElementById('sub').textContent='Deadline '+oslo+' (Oslo) · FPL '+D.season+' · built '+D.generated+' from the live FPL API';

// the call
(function(){
  const C=D.calcSummary;
  document.getElementById('call-lede').textContent=D.summary;
  const tiles=document.getElementById('call-tiles');
  const tile=(label,value,d,isCalc)=>{const t=h('div','tile');const l=h('div','label',label);if(isCalc){l.append(' ');l.appendChild(calcTag());}t.appendChild(l);t.appendChild(h('div','value',value));const dd=h('div','d');if(typeof d==='string')dd.textContent=d;else dd.append.apply(dd,d);t.appendChild(dd);tiles.appendChild(t);};
  const chipName={wildcard:'Wildcard',freehit:'Free Hit',bboost:'Bench Boost','3xc':'Triple Captain'};
  tile('Chip',D.chip?chipName[D.chip]||D.chip:'None',D.chip==='wildcard'?'Unlimited free transfers this week':'');
  tile('Transfers',String(D.transfers.length),(D.hit?'-'+D.hit+' hit':'no hit')+' · £'+f1(D.priceOut)+'m out, £'+f1(D.priceIn)+'m in at today\'s prices'+(D.bankAfter!=null?' · £'+D.bankAfter+'m left':''));
  tile('Captain',P[D.captain]?P[D.captain].name:'?','Vice '+(P[D.vice]?P[D.vice].name:'?'));
  if(C.keepGw!=null){const d=C.propGw-C.keepGw;tile('GW'+D.gw+' XI points',f1(C.propGw),[h('span','delta'+(d<0?' down':''),sign(f1(d))),' vs keeping the squad ('+f1(C.keepGw)+', '+C.keepShape+', C '+C.keepCap+')'],true);}
  if(C.prop6!=null&&C.keep6!=null){const d=C.prop6-C.keep6;tile('Next '+D.horizon+' GWs',f1(C.prop6),[h('span','delta'+(d<0?' down':''),sign(f1(d))),' vs keeping the squad ('+f1(C.keep6)+')'],true);}
  const z=h('p','lede');z.style.margin='10px 0 0';z.appendChild(h('b',null,'If you say no: '));z.append(D.zeroAlt||'keep the squad and roll the free transfer.');document.getElementById('call').appendChild(z);
})();

// pitch
function shirt(id,onBench){
  const p=P[id];const m=p.matchup;
  const b=h('button','shirt '+p.role);b.type='button';
  const kit=h('div','kit',p.team);
  if(p.captain||p.vice){kit.appendChild(h('span','badge',p.captain?'C':'V'));}
  b.appendChild(kit);
  b.appendChild(h('span','nm',p.name));
  const fx=h('span','fx f'+(m?m.fdr:3),m?oppTxt(m.opp,m.home):'blank');b.appendChild(fx);
  b.appendChild(h('span','xp',(onBench?(p.benchOrder+'. '):'')+f1(p.calc.gw)+' calc'));
  b.addEventListener('click',()=>openCard(id));
  bindTip(b,[p.name+' · '+p.team+' '+p.pos+' · £'+p.price+'m',(p.role==='in'?'New':'Kept')+' · '+p.total+' pts this season · '+p.own+'% owned',m?('GW'+D.gw+': '+(m.home?'home to ':'away at ')+m.oppName+' (difficulty '+m.fdr+')'):'']);
  return b;
}
(function(){
  const pitch=document.getElementById('pitch');
  for(const pos of [4,3,2,1]){const row=h('div','row');D.xi.filter(id=>P[id].posN===pos).forEach(id=>row.appendChild(shirt(id,false)));pitch.appendChild(row);}
  const br=document.getElementById('benchrow');D.bench.forEach(id=>br.appendChild(shirt(id,true)));
})();

// transfers + kept
function mini(id,kind){
  const p=P[id];const b=h('button','pm '+kind);b.type='button';
  b.appendChild(h('b',null,p.name));
  b.appendChild(h('span','m',p.team+' '+p.pos+' · £'+p.price+'m · '+p.own+'% owned'));b.appendChild(h('br'));
  b.appendChild(h('span',null,p.total+' pts · form '+p.form+' · '+p.minutes+' min'));b.appendChild(h('br'));
  const c=h('span','m',f1(p.calc.gw)+' this GW · '+f1(p.calc.six)+' in '+D.horizon+' GWs ');c.appendChild(calcTag());b.appendChild(c);
  b.addEventListener('click',()=>openCard(id));
  return b;
}
(function(){
  const T=D.transfers;const w=document.getElementById('transfers');
  document.getElementById('tr-h').textContent=T.length?('Transfers: '+T.length+' out, '+T.length+' in'):'Transfers: none';
  const d6=T.reduce((s,t)=>s+P[t.in].calc.six-P[t.out].calc.six,0);
  document.getElementById('tr-lede').textContent=T.length?('Out on the left, in on the right. Together the incoming players add '+sign(f1(d6))+' calculated points over the next '+D.horizon+' gameweeks.'):'Roll the free transfer.';
  T.forEach(t=>{const r=h('div','tr');r.appendChild(mini(t.out,'out'));r.appendChild(h('div','arrow','→'));r.appendChild(mini(t.in,'in'));w.appendChild(r);});
  const kept=[...D.xi,...D.bench].filter(id=>P[id].role==='kept');
  document.getElementById('kept-h').textContent='Kept ('+kept.length+')';
  const k=document.getElementById('kept');kept.forEach(id=>{const c=h('button','chip',P[id].name+' · '+P[id].team);c.type='button';c.addEventListener('click',()=>openCard(id));k.appendChild(c);});
})();

// feedback state
const FB={};
function setFb(id,k,v){FB[id]=FB[id]||{};FB[id][k]=v;renderFb();}
function renderFb(){
  const lines=['FPL GW'+D.gw+' proposal feedback'];
  const g=document.getElementById('fb-general').value.trim();if(g)lines.push('- General: '+g);
  Object.keys(FB).forEach(id=>{const f=FB[id];const p=P[id];if(!f.r&&!f.n)return;
    const lab={agree:'agree',disagree:'disagree',question:'question'}[f.r]||'note';
    lines.push('- '+p.name+' ('+(p.role==='in'?'IN':p.role==='out'?'OUT':'KEPT')+'): '+lab+(f.n?': '+f.n:''));});
  const t=document.getElementById('fb-out');t.value=lines.length>1?lines.join('\n'):'';
  const n=lines.length-1;document.getElementById('fb-lede').textContent=n?(n+' reaction'+(n>1?'s':'')+' collected. Copy and paste into the research session.'):'Reactions from the cards collect here. Add anything general below, copy it, and paste it into the research session.';
}
document.getElementById('fb-general').addEventListener('input',renderFb);
document.getElementById('fb-copy').addEventListener('click',async()=>{
  const t=document.getElementById('fb-out');const st=document.getElementById('fb-status');
  if(!t.value){st.textContent='Nothing to copy yet';return;}
  try{await navigator.clipboard.writeText(t.value);st.textContent='Copied';}
  catch(e){t.removeAttribute('readonly');t.focus();t.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}st.textContent=ok?'Copied':'Selected: copy it by hand';}
});
(function(){const a=document.getElementById('fb-session');if(D.session)a.href=D.session;else a.style.display='none';})();

// one player card
function card(id){
  const p=P[id];const m=p.matchup;
  const d=h('details','pc '+p.role);d.id='card-'+id;
  const s=h('summary');
  const nm=h('div','sumname');const b=h('b',null,p.name+' ');nm.appendChild(b);
  const tg=h('span','tag '+p.role,p.role==='in'?'IN':p.role==='out'?'OUT':'KEPT');nm.appendChild(tg);
  if(p.captain){nm.append(' ');nm.appendChild(h('span','tag c','C'));} if(p.vice){nm.append(' ');nm.appendChild(h('span','tag c','V'));}
  if(p.status!=='a'){nm.append(' ');nm.appendChild(h('span','tag out',p.status==='d'?(p.chance+'%'):p.status.toUpperCase()));}
  nm.appendChild(h('span','m',p.team+' '+p.pos+' · £'+p.price+'m · '+p.own+'% owned · '+p.total+' pts'+(m?' · GW'+D.gw+' '+oppTxt(m.opp,m.home):'')+(p.slot==='bench'?' · bench '+p.benchOrder:'')));
  s.appendChild(nm);
  const x=h('div','sumxp');x.appendChild(h('b',null,f1(p.calc.gw)));x.appendChild(calcTag());s.appendChild(x);
  d.appendChild(s);
  const body=h('div','pcb');
  if(p.news){body.appendChild(h('div','flagline','⚠️ '+p.news+(p.newsAdded?' (FPL, '+p.newsAdded+')':'')));}
  // tiles
  const tiles=h('div','tiles t3');
  const tile=(l,v,dd)=>{const t=h('div','tile');t.appendChild(h('div','label',l));t.appendChild(h('div','value',v));if(dd)t.appendChild(h('div','d',dd));tiles.appendChild(t);};
  tile('Points',String(p.total),p.ppg+' per game · form '+p.form);
  tile('Minutes',String(p.minutes),p.starts+' starts of '+p.teamGames+' games');
  if(p.posN===1)tile('Clean sheets',String(p.cs),p.bonus+' bonus');
  else tile('Goals · assists',p.goals+' · '+p.assists,'xG '+f1(p.xg)+' · xA '+f1(p.xa));
  if(p.posN===1)tile('Saves',String(p.saves),p.saves90.toFixed(1)+' per 90');
  else tile('xGI per 90',p.xgi90.toFixed(2),'DC per 90 '+p.dc90.toFixed(1));
  tile('Price',' £'+p.price+'m',p.own+'% owned');
  tile('Last season',p.lastSeason?String(p.lastSeason.pts):'-',p.lastSeason?(p.lastSeason.name+' · '+p.lastSeason.min+' min'):'no PL history');
  body.appendChild(tiles);
  // last five
  body.appendChild(h('h3',null,'Last '+p.last5.length+' matches'));
  if(p.last5.length){
    const W=400,Hh=150,L=8,R=8,T=18,B=40;const n=p.last5.length;const slot=(W-L-R)/n;const bw=Math.min(36,slot*0.55);
    const max=Math.max(10,Math.ceil(Math.max.apply(null,p.last5.map(r=>r.pts))/5)*5);
    const ys=v=>T+(Hh-T-B)*(1-Math.max(0,v)/max);
    const g=sv('svg',{viewBox:'0 0 '+W+' '+Hh,role:'img','aria-label':'Points in the last '+n+' matches'});
    sv('line',{x1:L,x2:W-R,y1:ys(0),y2:ys(0),class:'base'},g);
    p.last5.forEach((r,i)=>{const cx=L+slot*(i+0.5);const grp=sv('g',{},g);
      const hgt=ys(0)-ys(r.pts);if(hgt>0)sv('path',{d:vbar(cx-bw/2,ys(0),bw,hgt,4),fill:'var(--s1)'},grp);
      sv('rect',{x:cx-slot/2,y:T-14,width:slot,height:Hh-T-B+14,fill:'transparent'},grp);
      txt(g,cx,ys(Math.max(0,r.pts))-9,String(r.pts),'val','middle');
      txt(g,cx,Hh-B+12,'GW'+r.gw+' '+oppTxt(r.opp,r.home),'tick','middle');
      txt(g,cx,Hh-B+27,r.r+' '+r.gf+'-'+r.ga,'tick','middle');
      const bits=[];if(r.g)bits.push(r.g+' goal'+(r.g>1?'s':''));if(r.a)bits.push(r.a+' assist'+(r.a>1?'s':''));if(r.cs&&p.posN<=3&&r.min>=60)bits.push('clean sheet');if(r.bonus)bits.push(r.bonus+' bonus');
      bindTip(grp,[r.pts+' pts','GW'+r.gw+' '+(r.home?'home v ':'away at ')+r.opp+' · '+(r.r==='W'?'won':r.r==='L'?'lost':'drew')+' '+r.gf+'-'+r.ga,r.min+' min · xGI '+r.xgi.toFixed(2)+' · DC '+r.dc,bits.join(', ')||'no returns']);});
    body.appendChild(g);
  } else body.appendChild(h('p','lede','No matches this season.'));
  // next six
  body.appendChild(h('h3',null,'Next '+p.next.length+' fixtures'));
  const strip=h('div','strip');
  p.next.forEach((f,i)=>{const c=h('div','f'+f.fdr);c.appendChild(h('small',null,'GW'+f.gw));c.append(oppTxt(f.opp,f.home));const cx=p.calc.per.find(q=>q.gw===f.gw);if(cx){c.appendChild(h('small',null,f1(cx.xp)+' calc'));}strip.appendChild(c);});
  body.appendChild(strip);
  // matchup
  if(m){
    body.appendChild(h('h3',null,'This week: '+(m.home?'home to ':'away at ')+m.oppName));
    const form=(arr,label)=>{const pp=h('p','lede');pp.appendChild(h('b',null,label+': '));if(!arr.length)pp.append('no results yet');arr.forEach(r=>{const sp=h('span','res '+r.r,r.r);pp.appendChild(sp);pp.append(oppTxt(r.opp,r.home)+' '+r.gf+'-'+r.ga+'  ');});
      const gf=arr.reduce((s,r)=>s+r.gf,0),ga=arr.reduce((s,r)=>s+r.ga,0);if(arr.length)pp.append('(scored '+gf+', conceded '+ga+')');return pp;};
    body.appendChild(form(m.oppForm,m.opp+' last '+m.oppForm.length));
    body.appendChild(form(m.ownForm,p.team+' last '+m.ownForm.length));
    const hh=h('p','lede');hh.appendChild(h('b',null,'Head-to-head: '));
    if(m.h2h){hh.append(m.h2h.text+' ');if(m.h2h.url){const a=h('a',null,'source');a.href=m.h2h.url;a.target='_blank';a.rel='noopener';hh.appendChild(a);}}
    else if(m.metThisSeason.length)hh.append(m.metThisSeason.join(' · '));
    else hh.append('No meeting this season, and no sourced note.');
    if(m.playerVsOpp.length)hh.append(' · '+p.name+' v '+m.opp+' this season: '+m.playerVsOpp.join(', '));
    body.appendChild(hh);
  }
  // why
  body.appendChild(h('h3',null,p.role==='out'?'Why sell':'Why this player'));
  if(p.why.length){const ul=h('ul','why');p.why.forEach(w=>{const li=h('li',null,w.text+' ');if(w.url){const a=h('a','src',w.source||'source');a.href=w.url;a.target='_blank';a.rel='noopener';li.appendChild(a);}else if(w.source)li.appendChild(h('span','src',w.source));ul.appendChild(li);});body.appendChild(ul);}
  else body.appendChild(h('p','lede','No sourced takeaway for this player. The case rests on the numbers above.'));
  if(p.noteNews){const nn=h('p','lede');nn.appendChild(h('b',null,'News: '));nn.append(p.noteNews.text+' ');if(p.noteNews.url){const a=h('a',null,'source');a.href=p.noteNews.url;a.target='_blank';a.rel='noopener';nn.appendChild(a);}body.appendChild(nn);}
  // calculated
  const ch=h('h3',null,'Calculated points ');ch.appendChild(calcTag());body.appendChild(ch);
  const c0=p.calc.per[0];
  const cp=h('p','lede',f1(p.calc.gw)+' this gameweek, '+f1(p.calc.six)+' over the next '+D.horizon+'. Built from '+(p.posN===1?'clean-sheet odds and saves':'xG '+f1(p.xg)+' and xA '+f1(p.xa)+' this season (shrunk halfway to the average for the position)')+', the opponent\'s underlying defence and attack, and a '+Math.round(c0.ps*100)+'% chance of starting'+(p.availOverride&&p.availOverride[D.gw]!=null?' (set by the research run from the news, not the API flag)':'')+(c0.pcs!=null&&p.posN<=2?'; clean-sheet chance '+Math.round(c0.pcs*100)+'%':'')+'. Not a forecast.');
  body.appendChild(cp);
  // feedback
  const fb=h('div','fb');
  [['agree','👍 Agree'],['disagree','👎 Disagree'],['question','❓ Question']].forEach(([k,l])=>{const bt=h('button',null,l);bt.type='button';bt.setAttribute('aria-pressed','false');
    bt.addEventListener('click',()=>{const on=bt.getAttribute('aria-pressed')!=='true';fb.querySelectorAll('button').forEach(o=>o.setAttribute('aria-pressed','false'));bt.setAttribute('aria-pressed',on?'true':'false');setFb(id,'r',on?k:null);});fb.appendChild(bt);});
  const inp=h('input');inp.placeholder='Comment on '+p.name;inp.addEventListener('input',()=>setFb(id,'n',inp.value.trim()));fb.appendChild(inp);
  body.appendChild(fb);
  d.appendChild(body);
  return d;
}
(function(){
  const cards=document.getElementById('cards');
  const order=[...[1,2,3,4].flatMap(pos=>D.xi.filter(id=>P[id].posN===pos)),...D.bench];
  order.forEach(id=>cards.appendChild(card(id)));
  const sold=document.getElementById('sold');
  if(!D.outs.length){document.getElementById('sold-card').style.display='none';}
  D.outs.forEach(id=>sold.appendChild(card(id)));
})();

// method + table + footer
(function(){
  const m=document.getElementById('method');
  m.textContent='Per fixture: 2 points for starting, plus goals and assists from the player\'s xG and xA per 90 (shrunk halfway to the average for the position) scaled by how leaky the opponent is and home/away, plus clean-sheet points from a Poisson model of goals against (team xG against × opponent xG for), minus a goals-conceded penalty, plus defensive-contribution points from DC per 90 against the threshold, plus saves and a small bonus. All multiplied by the chance of starting: minutes so far, times the FPL flag, unless the research run overrode it from the news. Team strengths are underlying xG, not results, shrunk halfway to the league average. "Keeping the squad" picks the best legal XI and captain of the current fifteen on the same numbers.';
  const t=document.getElementById('tbl');
  const row=(cells,th)=>{const tr=h('tr');cells.forEach((c,i)=>tr.appendChild(h(th?'th':'td',(!th&&i>2)?'n':null,String(c))));t.appendChild(tr);};
  row(['Player','Status','GW'+D.gw,'Pts','Form','Min','xGI/90','Calc GW','Calc '+D.horizon],true);
  [...D.xi,...D.bench,...D.outs].forEach(id=>{const p=P[id];const m=p.matchup;row([p.name+' ('+p.team+' '+p.pos+')',p.role+(p.captain?' C':p.vice?' V':'')+(p.slot==='bench'?' bench':''),m?oppTxt(m.opp,m.home):'-',p.total,p.form,p.minutes,p.xgi90.toFixed(2),f1(p.calc.gw),f1(p.calc.six)]);});
  const ft=document.getElementById('foot');ft.textContent='Decision log: docs/gw-decisions/'+D.season+'/gw'+D.gw+'.md';
  if(D.prUrl){ft.append(' · ');const a=h('a',null,'the PR');a.href=D.prUrl;a.target='_blank';a.rel='noopener';ft.appendChild(a);}
  renderFb();
})();
</script>
</body>
</html>
`;

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

const out = opt("out", path.join(os.tmpdir(), `fpl-gw${GW}-proposal.html`));
fs.writeFileSync(out, html);
if (!PUBLISH) {
  console.log(out);
  process.exit(0);
}
const r = spawnSync("artifact", ["publish", out, "--name", `fpl-gw${GW}-proposal`, "--title", `FPL GW${GW} proposal`], { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const url = ((r.stdout || "").match(/https?:\/\/\S+/) || [])[0];
console.log(url || (r.stdout || "").trim());
