#!/usr/bin/env node
// =============================================================================
// outcome-page — the ONE visual a post-mortem produces.
//
// Deterministic (no LLM): reads the live FPL API plus the finished decision log
// and renders a self-contained, phone-first HTML page, the same view every
// gameweek. The post-mortem agent runs it once the doc is written; the page is
// what the human looks at, the doc is what the next research run reads.
//
// Sections, in this order, always, in the house brand (brand.mjs):
//   title + readout (points vs average, rank move, GW rank, captain, bench, season)
//   mini-leagues (every classic league of type "x", us highlighted, GW score)
//   where the points went (top 50 of the overall league: their effective
//     ownership against our multiplier, times points; by player and by club)
//   bought against sold (this GW's transfers, and every transfer of the
//     season with the points each side has scored since)
//   who scored it (all 15 picks, captain doubled, bench not counted)
//   points against the average + overall rank
//   the armband ledger (our captain x2 vs the field's captain x2, cumulative)
//   the flags (parsed from `### Flag outcomes` in gw<N>.md, grouped by the
//     (+N) / (-N) / (=) / (?) read the post-mortem puts in front of each)
//   a table view of everything above
//
// Add a section here when we add one to the process; do not improvise per week.
//
//   outcome-page.mjs --gw 5 [--season 2026-27] [--out /tmp/x.html] [--publish]
//
// --publish hands the file to `artifact publish` under the slug
// fpl-gw<N>-outcome and prints the URL, which is stable across re-publishes.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { brandHead, brandSprite, BRAND_VERSION } from "./brand.mjs";

const REPO = process.env.FPL_LOOP_REPO || path.resolve(import.meta.dirname, "..", "..");
const SECRETS = path.join(process.env.HOME || "/home/node", ".fpl", "secrets.env");
const API = "https://fantasy.premierleague.com/api";

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dflt;
};
const GW = Number(opt("gw"));
if (!GW) {
  console.error("usage: outcome-page.mjs --gw <N> [--season YYYY-YY] [--out file] [--publish]");
  process.exit(2);
}
const PUBLISH = args.includes("--publish");

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
const XAUTH = process.env.FPL_X_API_AUTH || secrets.FPL_X_API_AUTH;
if (!ENTRY) {
  console.error("FPL_MANAGER_ID missing (env or ~/.fpl/secrets.env)");
  process.exit(2);
}

async function fetchJson(endpoint) {
  const sep = endpoint.includes("?") ? "&" : "?";
  const url = `${API}/${endpoint}${sep}_cb=${Date.now()}${process.pid}`;
  const headers = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "User-Agent": "FPL-MCP-Server/1.0 (+https://fantasy.premierleague.com)",
    Origin: "https://fantasy.premierleague.com",
    Referer: "https://fantasy.premierleague.com/",
    "x-requested-with": "XMLHttpRequest",
  };
  if (XAUTH) headers["X-Api-Authorization"] = XAUTH;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`${endpoint} -> HTTP ${res.status}`);
  return res.json();
}

// ----------------------------------------------------------------------------- data
const boot = await fetchJson("bootstrap-static/");
const ev = boot.events.find((e) => e.id === GW);
if (!ev) throw new Error(`no event ${GW} in bootstrap`);
const seasonStart = new Date(boot.events[0].deadline_time).getUTCFullYear();
const SEASON = opt("season", `${seasonStart}-${String(seasonStart + 1).slice(2)}`);
const teams = Object.fromEntries(boot.teams.map((t) => [t.id, t.short_name]));
const el = Object.fromEntries(boot.elements.map((p) => [p.id, p]));
const POS = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };

const [picks, live, fixtures, history, entry, transfers] = await Promise.all([
  fetchJson(`entry/${ENTRY}/event/${GW}/picks/`),
  fetchJson(`event/${GW}/live/`),
  fetchJson(`fixtures/?event=${GW}`),
  fetchJson(`entry/${ENTRY}/history/`),
  fetchJson(`entry/${ENTRY}/`),
  fetchJson(`entry/${ENTRY}/transfers/`),
]);
const stats = Object.fromEntries(live.elements.map((e) => [e.id, e]));
const fixtureOf = (teamId) => fixtures.find((f) => f.team_h === teamId || f.team_a === teamId);
const eh = picks.entry_history;
const net = (h) => h.points - (h.event_transfers_cost || 0);
const season = history.current.filter((h) => h.event <= GW);
const prev = season.find((h) => h.event === GW - 1);

// Every gameweek's live points and our picks, fetched once: the armband ledger
// and the transfer ledger both read them.
const ptsByGw = {};
const picksByGw = {};
for (let g = 1; g <= GW; g++) {
  const l = g === GW ? live : await fetchJson(`event/${g}/live/`);
  ptsByGw[g] = Object.fromEntries(l.elements.map((e) => [e.id, e.stats.total_points]));
  picksByGw[g] = g === GW ? picks : await fetchJson(`entry/${ENTRY}/event/${g}/picks/`);
}
const P = ptsByGw[GW];

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]).catch(() => null);
      }
    }),
  );
  return out;
}

// Armband ledger, from the API rather than the doc: the pick carrying the
// multiplier is the effective captain (vice, if the captain did not play);
// the field's captain is events[N].most_captained.
const ledger = [];
let cum = 0;
for (let g = 1; g <= GW; g++) {
  const p = picksByGw[g];
  const s = ptsByGw[g];
  const cap = p.picks.find((x) => x.multiplier > 1) || p.picks.find((x) => x.is_captain);
  const e = boot.events.find((x) => x.id === g);
  const ours = s[cap.element] ?? 0;
  const mult = Math.max(cap.multiplier, 1);
  const field = s[e.most_captained] ?? 0;
  const swing = ours * mult - field * 2;
  cum += swing;
  ledger.push({ gw: g, ours: el[cap.element]?.web_name || cap.element, o: ours, mult, field: el[e.most_captained]?.web_name || e.most_captained, f: field, swing, cum });
}

// Mini-leagues: the classic leagues the human created or joined (type "x"),
// with every rival's picks for the "where the points went" section.
const leagues = [];
const rivals = [];
for (const lg of (entry.leagues?.classic || []).filter((l) => l.league_type === "x")) {
  const st = await fetchJson(`leagues-classic/${lg.id}/standings/`);
  const rows = st.standings.results.map((r) => ({ id: r.entry, name: r.entry_name, player: r.player_name, total: r.total, gw: r.event_total, rank: r.rank, last: r.last_rank, us: r.entry === Number(ENTRY) }));
  for (const r of rows) if (!r.us && !rivals.some((x) => x.id === r.id)) rivals.push(r);
  const us = rows.find((r) => r.us);
  const gwRank = us ? rows.filter((r) => r.gw > us.gw).length + 1 : null;
  const ord = (n) => n + (["th", "st", "nd", "rd"][((n % 100) - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th");
  let move = "";
  if (us) {
    const dir = us.last === 0 ? "" : us.last === us.rank ? "unchanged" : us.last > us.rank ? `up from ${ord(us.last)}` : `down from ${ord(us.last)}`;
    const score = gwRank === 1 ? "Best score in the league this week" : `${ord(gwRank)}-best score in the league this week`;
    const others = rows.filter((r) => !r.us).map((r) => r.gw);
    const avg = others.length ? Math.round(others.reduce((a, b) => a + b, 0) / others.length) : null;
    move = `${ord(us.rank)} of ${rows.length}${dir ? ", " + dir : ""}. ${score}${avg != null ? `: ${us.gw} against their average of ${avg}` : ""}.`;
  }
  leagues.push({ name: lg.name, move, rows });
}
const rivalPicks = await pool(rivals, 8, (r) => fetchJson(`entry/${r.id}/event/${GW}/picks/`));

// Where the points went: the top 50 of the overall league this week, their
// effective ownership (share who fielded him, captain counted twice) against
// our multiplier, times his points. Negative = they had him and we did not.
const ourMult = Object.fromEntries(picks.picks.map((p) => [p.element, p.multiplier]));
const overall = (entry.leagues?.classic || []).find((l) => l.name === "Overall")?.id || 314;
const top = (await fetchJson(`leagues-classic/${overall}/standings/`)).standings.results.slice(0, 50);
const topPicks = (await pool(top, 8, (r) => fetchJson(`entry/${r.entry}/event/${GW}/picks/`))).filter(Boolean);
const eo = {};
for (const tp of topPicks) for (const x of tp.picks) if (x.multiplier > 0) eo[x.element] = (eo[x.element] || 0) + x.multiplier / topPicks.length;
const topAvg = topPicks.length ? Math.round(topPicks.reduce((a, tp) => a + net(tp.entry_history), 0) / topPicks.length) : null;
const rivalHad = (id) => rivalPicks.filter((rp) => rp && rp.picks.some((x) => x.element === id && x.multiplier > 0)).length;
const gaps = Object.keys({ ...eo, ...ourMult })
  .map(Number)
  .map((id) => ({ id, n: el[id].web_name, team: teams[el[id].team], pts: P[id] ?? 0, us: ourMult[id] || 0, eo: eo[id] || 0, rivals: rivalHad(id) }))
  .map((g) => ({ ...g, gap: Math.round(g.pts * (g.us - g.eo) * 10) / 10 }))
  .filter((g) => Math.abs(g.gap) >= 0.5);
const losses = gaps.filter((g) => g.gap < 0).sort((a, b) => a.gap - b.gap).slice(0, 8);
const gains = gaps.filter((g) => g.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 5);
const byClub = {};
for (const g of gaps) byClub[g.team] = (byClub[g.team] || 0) + g.gap;
const clubLosses = Object.entries(byClub)
  .filter(([, v]) => v < -3)
  .sort((a, b) => a[1] - b[1])
  .slice(0, 3)
  .map(([team, v]) => ({ team, gap: Math.round(v), ours: picks.picks.filter((p) => p.multiplier > 0 && teams[el[p.element].team] === team).length, theirs: Math.round(topPicks.reduce((a, tp) => a + tp.picks.filter((x) => x.multiplier > 0 && teams[el[x.element].team] === team).length, 0) / Math.max(1, topPicks.length) * 10) / 10 }));
const field = { n: topPicks.length, avg: topAvg, rivals: rivals.length, losses, gains, clubs: clubLosses };

// Bought against sold: this week's transfers as FPL pairs them, and every
// transfer of the season with the points each side has scored since.
const since = (id, from, to = GW) => {
  let s = 0;
  for (let g = from; g <= to; g++) s += ptsByGw[g][id] ?? 0;
  return s;
};
// A bought player who was sold again later only counts while we held him.
const ordered = transfers.filter((t) => t.event <= GW).sort((a, b) => a.event - b.event || a.time.localeCompare(b.time));
const heldTo = (t) => {
  const later = ordered.find((x) => x.element_out === t.element_in && x.event > t.event);
  return later ? later.event - 1 : GW;
};
const moves = ordered.map((t) => {
  const to = heldTo(t);
  return { gw: t.event, out: el[t.element_out]?.web_name, in: el[t.element_in]?.web_name, soldOn: to < GW ? to + 1 : null, outGw: ptsByGw[GW][t.element_out] ?? 0, inGw: ptsByGw[GW][t.element_in] ?? 0, outSince: since(t.element_out, t.event, to), inSince: since(t.element_in, t.event, to) };
});
const hits = season.reduce((a, h) => a + (h.event_transfers_cost || 0), 0);
const chipOf = (g) => (history.chips || []).find((c) => c.event === g)?.name || null;
const market = { thisWeek: moves.filter((m) => m.gw === GW), all: moves, hits, chip: chipOf(GW) };

// Per-player rows, notes built from the live stats, mechanism first.
const subsIn = new Set((picks.automatic_subs || []).map((s) => s.element_in));
const subsOut = new Set((picks.automatic_subs || []).map((s) => s.element_out));
const players = picks.picks
  .slice()
  .sort((a, b) => a.position - b.position)
  .map((p) => {
    const e = el[p.element];
    const s = stats[p.element]?.stats || {};
    const explain = (stats[p.element]?.explain || []).flatMap((x) => x.stats);
    // Bench rows show the raw score they would have given; only multiplier>0 counts.
    const pts = (s.total_points ?? 0) * Math.max(p.multiplier, 1);
    const counted = p.multiplier > 0;
    const fx = fixtureOf(e.team);
    const score = fx && fx.finished ? `${teams[fx.team_h]} ${fx.team_h_score}-${fx.team_a_score} ${teams[fx.team_a]}` : "";
    const n = [];
    if (!s.minutes) n.push("did not play");
    if (s.goals_scored) n.push(`${s.goals_scored} goal${s.goals_scored > 1 ? "s" : ""} (${s.expected_goals} xG)`);
    if (s.assists) n.push(`${s.assists} assist${s.assists > 1 ? "s" : ""}`);
    if (s.clean_sheets && e.element_type <= 3) n.push("clean sheet");
    if (s.goals_conceded >= 2 && e.element_type <= 2) n.push(`conceded ${s.goals_conceded}`);
    if (s.bonus) n.push(`${s.bonus} bonus`);
    const dcPts = explain.find((x) => x.identifier === "defensive_contribution")?.points || 0;
    if (dcPts) n.push(`DC ${s.defensive_contribution} banked`);
    else if (s.minutes && s.defensive_contribution >= (e.element_type === 2 ? 9 : 11)) n.push(`DC ${s.defensive_contribution}, one short`);
    if (s.saves >= 3) n.push(`${s.saves} saves`);
    if (s.penalties_saved) n.push("penalty saved");
    if (s.penalties_missed) n.push("penalty missed");
    if (s.own_goals) n.push("own goal");
    if (s.red_cards) n.push("red card");
    else if (s.yellow_cards) n.push("yellow");
    if (s.minutes && !n.length) n.push(`appearance only (${s.expected_goal_involvements} xGI)`);
    const tag = p.is_captain ? `C, ${s.total_points}×${p.multiplier || 2}` : p.is_vice_captain && p.multiplier > 1 ? `V as C, ×${p.multiplier}` : p.is_vice_captain ? "V" : subsIn.has(p.element) ? "autosub in" : subsOut.has(p.element) ? "did not play" : "";
    return { n: e.web_name, pos: POS[e.element_type], min: s.minutes ?? 0, pts, counted, tag, note: [n.join(", "), score].filter(Boolean).join(" · ") };
  });
const benchPts = players.filter((p) => !p.counted && p.pts > 0);

// Flags, parsed from the doc's `### Flag outcomes` block:
//   - [x] (+6) **<flag>: <VERDICT>.** <first sentence of the rest>
// The parenthesis is the read: (+N) paid us, (-N) cost us, (=) level,
// (?) untested / still running; N is optional. No marker = unmarked.
const docPath = opt("doc", path.join(REPO, "docs", "gw-decisions", SEASON, `gw${GW}.md`));
const flags = [];
try {
  const text = fs.readFileSync(docPath, "utf8");
  const block = (text.split(/^### Flag outcomes/m)[1] || "").split(/^(?:---|## )/m)[0];
  // Verdicts are written in caps; the page shows them in sentence case. A word
  // keeps its capitals (Anfield, DC, B) when the doc never writes it lowercase.
  const forms = {};
  for (const w of text.match(/[\p{L}\p{N}][\p{L}\p{N}'.]*/gu) || []) (forms[w.toLowerCase()] ||= {})[w] = (forms[w.toLowerCase()][w] || 0) + 1;
  const COMMON = new Set(["yes", "no", "and", "the", "but", "not", "our", "for", "all", "two", "was", "one", "won", "off", "out", "to", "of", "in", "on", "it", "is", "a"]);
  const sentence = (s) =>
    s.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{N}'.]*/gu, (w, i) => {
      const f = forms[w] || {};
      // Prefer a mixed-case form (Anfield, xG); an all-caps one (DC, B) only if short and alone.
      const ks = f[w] ? [] : Object.keys(f).sort((a, b) => f[b] - f[a]);
      const out = ks.find((k) => k !== k.toUpperCase()) || ks.find((k) => k.length <= 3 && !COMMON.has(w)) || w;
      return i === 0 ? out.charAt(0).toUpperCase() + out.slice(1) : out;
    }).replace(/([.!?] )(\p{Ll})/gu, (_, a, b) => a + b.toUpperCase());
  const items = block.split(/^- \[[ x]\] /m).slice(1);
  for (const raw of items) {
    let item = raw.replace(/\s+/g, " ").trim();
    let read = null;
    let num = "";
    const mk = item.match(/^\(([+\-=?−])(\d+(?:\.\d+)?)?\)\s*/);
    if (mk) {
      read = { "+": "paid", "-": "cost", "−": "cost", "=": "level", "?": "open" }[mk[1]];
      num = mk[2] ? (read === "cost" ? "-" : "+") + mk[2] : "";
      item = item.slice(mk[0].length);
    }
    const m = item.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (!m) {
      flags.push({ flag: item.slice(0, 80), verdict: "", note: "", read, num });
      continue;
    }
    const bold = m[1].replace(/\.$/, "");
    const i = bold.lastIndexOf(": ");
    const flag = i > 0 ? bold.slice(0, i) : bold;
    const verdict = i > 0 ? sentence(bold.slice(i + 2)) : "";
    const rest = m[2].replace(/\*\*|`/g, "");
    const note = (rest.match(/^.*?[.!?](?=\s|$)/) || [rest])[0].trim();
    flags.push({ flag, verdict, note: note.length > 200 ? note.slice(0, 197) + "…" : note, read, num });
  }
} catch {
  /* no doc: the page still renders, the flags section says so */
}

const cap = players.find((p) => p.tag.startsWith("C") || p.tag.startsWith("V as C"));
const data = {
  gw: GW,
  seasonName: SEASON,
  entryName: entry.name,
  finalised: new Date().toISOString().slice(0, 10),
  brand: BRAND_VERSION,
  hero: {
    points: net(eh),
    avg: ev.average_entry_score,
    highest: ev.highest_score,
    rank: eh.overall_rank,
    prevRank: prev?.overall_rank ?? null,
    gwRank: eh.rank,
    totalPlayers: boot.total_players,
    total: eh.total_points,
    seasonPts: season.map((h) => net(h)),
    bench: eh.points_on_bench,
    benchWho: benchPts.map((p) => p.n).join(", "),
    hit: eh.event_transfers_cost,
    chip: picks.active_chip,
    captain: cap ? `${cap.n} ${cap.pts / 2}×2` : "",
    mostCaptained: el[ev.most_captained]?.web_name,
    mostCaptainedPts: stats[ev.most_captained]?.stats.total_points,
  },
  players,
  season: season.map((h) => ({ gw: h.event, pts: net(h), avg: boot.events.find((e) => e.id === h.event)?.average_entry_score ?? 0, rank: h.overall_rank })),
  ledger,
  leagues,
  field,
  market,
  flags,
};

// ----------------------------------------------------------------------------- html
const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>FPL GW${GW} outcome · ${esc(entry.name)}</title>
${brandHead()}
<style>
/* page-specific, semantic tokens only */
section{margin-top:var(--space-7)}
section>h2:first-child{margin-top:0}
.chartbox{padding:12px 8px 6px}
.chart text{font:11px var(--font-code);fill:var(--text-muted)}
.chart text.lab{fill:var(--text)}
.chart text.nm{font:12px var(--font-body);fill:var(--text)}
.chart text.us{font-weight:700;fill:var(--text)}
.mark:hover,.mark:focus{opacity:.82;outline:none}
#tip{position:fixed;pointer-events:none;background:var(--text);color:var(--bg);font:12px/1.4 var(--font-code);padding:6px 8px;border-radius:var(--radius);display:none;max-width:260px;z-index:9}
#tip b{font-family:var(--font-body);font-size:var(--step--1)}
.mini{display:grid;gap:var(--space-5)}
.mini h3{font-size:var(--step-0);font-family:var(--font-body);font-weight:700;margin:0}
.flags .row{align-items:flex-start}
.flags .st{min-width:92px;justify-content:flex-start;margin-top:2px}
.tbl td.sum,.tbl th.sum{border-top:2px solid var(--text);font-weight:700}
.tbl .st{font-family:var(--font-code)}
.foot{margin-top:var(--space-7)}
</style>
</head>
<body>
${brandSprite(["g-ok", "g-fault", "g-info", "g-idle"])}
<main>
<div class="kick"><span class="plate plate-emoji plate-fjord plate-32" aria-hidden="true">⚽</span><span>FPL ${esc(SEASON)} · GW${GW} outcome · ${esc(entry.name)}</span></div>
<h1 id="title"></h1>
<p class="lede" id="lede"></p>
<p class="meta" id="meta"></p>
<dl class="readout" id="readout"></dl>

<section>
  <h2>Mini-leagues</h2>
  <p class="cap" id="leagues-lede"></p>
  <div class="mini" id="leagues"></div>
</section>

<section>
  <h2>Where the points went</h2>
  <p class="cap" id="field-cap"></p>
  <p id="field-lede"></p>
  <div class="legend"><span><i style="background:var(--series-1)"></i>We had him, they mostly did not</span><span><i style="background:var(--series-5)"></i>They had him, we did not</span></div>
  <div class="chartbox"><svg class="chart" id="field" role="img" aria-label="Points gained and lost against the top 50 managers, per player"></svg></div>
</section>

<section>
  <h2>Bought against sold</h2>
  <p id="market-lede"></p>
  <div class="tablewrap"><table class="tbl" id="market-week"></table></div>
  <h2>Every transfer this season, points since</h2>
  <p class="cap">Each side counted from the gameweek of the transfer to now, or to the week before we sold the bought player on. Raw player points, started or not; the captain's double is not in it.</p>
  <div class="tablewrap"><table class="tbl" id="market-all"></table></div>
</section>

<section>
  <h2>Who scored it</h2>
  <p class="cap" id="players-lede"></p>
  <div class="legend"><span><i style="background:var(--series-1)"></i>Counted</span><span><i style="background:var(--series-muted)"></i>Bench, not counted</span></div>
  <div class="chartbox"><svg class="chart" id="players" role="img" aria-label="Points per player"></svg></div>
</section>

<section>
  <h2>Against the average</h2>
  <p class="cap" id="points-lede"></p>
  <div class="legend"><span><i style="background:var(--series-1)"></i><span id="us-name"></span></span><span><i style="background:var(--series-muted)"></i>GW average</span></div>
  <div class="chartbox"><svg class="chart" id="points" role="img" aria-label="Our points against the gameweek average"></svg></div>
  <h2>Overall rank</h2>
  <p class="cap" id="rank-lede"></p>
  <div class="chartbox"><svg class="chart" id="rank" role="img" aria-label="Overall rank by gameweek"></svg></div>
</section>

<section>
  <h2>The armband ledger</h2>
  <p class="cap" id="armband-lede"></p>
  <div class="legend"><span><i style="background:var(--series-1)"></i>Swing for us</span><span><i style="background:var(--series-5)"></i>Swing against</span><span><i style="background:var(--text)"></i>Cumulative</span></div>
  <div class="chartbox"><svg class="chart" id="armband" role="img" aria-label="Captain swing against the field's captain, by gameweek"></svg></div>
</section>

<section>
  <h2 id="flags-h">The flags</h2>
  <p class="cap" id="flags-lede"></p>
  <ul class="list flags" id="flags"></ul>
</section>

<details class="tv"><summary>Show everything as tables</summary><div class="tablewrap"><table class="tbl" id="tbl"></table></div></details>
<p class="meta foot" id="foot"></p>
</main>
<div id="tip" role="status"></div>
<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>
const D = JSON.parse(document.getElementById('data').textContent);
const NS='http://www.w3.org/2000/svg';
const sv=(t,a={},parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(parent)parent.appendChild(e);return e;};
const txt=(parent,x,y,s,cls,anchor)=>{const t=sv('text',{x,y,class:cls||'','text-anchor':anchor||'start','dominant-baseline':'middle'},parent);t.textContent=s;return t;};
const h=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
const fmt=n=>n.toLocaleString('en');
const M=n=>n>=1e6?(n/1e6).toFixed(2).replace(/0$/,'')+'M':n>=1e3?Math.round(n/1e3)+'K':String(n);
const sign=n=>(n>0?'+':'')+n;
const num=s=>{const e=h('span','num',String(s));return e;};
const tip=document.getElementById('tip');
function bindTip(node,lines){
  const show=e=>{tip.replaceChildren();lines.forEach((l,i)=>{const d=h('div');if(i===0){d.appendChild(h('b',null,l));}else d.textContent=l;tip.appendChild(d);});tip.style.display='block';move(e);};
  const move=e=>{tip.style.left=Math.min((e.clientX??0)+12,window.innerWidth-270)+'px';tip.style.top=((e.clientY??0)+14)+'px';};
  const hide=()=>tip.style.display='none';
  node.classList.add('mark');node.setAttribute('tabindex','0');
  node.addEventListener('pointerenter',show);node.addEventListener('pointermove',move);node.addEventListener('pointerleave',hide);
  node.addEventListener('focus',()=>{const r=node.getBoundingClientRect();show({clientX:r.left+r.width/2,clientY:r.top});});node.addEventListener('blur',hide);
}
const bar=(parent,x,y,w,ht,fill)=>sv('rect',{x:Math.min(x,x+w),y,width:Math.max(0,Math.abs(w)),height:ht,rx:1,fill},parent);
const chip=(read,word)=>{const k={paid:['st-ok','g-ok'],cost:['st-fault','g-fault'],level:['st-idle','g-idle'],open:['st-info','g-info']}[read]||['st-idle','g-idle'];
  const s=h('span','st '+k[0]);const u=document.createElementNS(NS,'svg');u.setAttribute('aria-hidden','true');const use=document.createElementNS(NS,'use');use.setAttribute('href','#'+k[1]);u.appendChild(use);s.appendChild(u);s.append(word);return s;};
const H=D.hero;
document.getElementById('us-name').textContent=D.entryName;

// title, lede, readout
(function(){
  const d=H.points-H.avg;
  document.getElementById('title').textContent='GW'+D.gw+': '+H.points+(d===0?', exactly the average':', '+Math.abs(d)+(d<0?' under':' over')+' the average');
  const mv=H.prevRank!=null?H.prevRank-H.rank:null;
  let lede=mv==null?'Overall rank '+fmt(H.rank)+'.':(mv>=0?'Up ':'Down ')+fmt(Math.abs(mv))+' places to '+M(H.rank)+'.';
  if(D.field.avg!=null) lede+=' The top '+D.field.n+' managers in the world averaged '+D.field.avg+'.';
  document.getElementById('lede').textContent=lede;
  document.getElementById('meta').textContent='Finalised '+D.finalised+'. Every number from the live FPL API.';
  const R=document.getElementById('readout');
  const row=(dt,val,rn)=>{const d=h('div');d.appendChild(h('dt',null,dt));d.appendChild(h('dd','num',val));const r=h('dd','rn');if(typeof rn==='string')r.textContent=rn;else r.append(...rn);d.appendChild(r);R.appendChild(d);};
  row('Points',String(H.points),'average '+H.avg+' · highest '+H.highest+(D.field.avg!=null?' · top '+D.field.n+' averaged '+D.field.avg:''));
  if(H.prevRank!=null) row('Overall rank',fmt(H.rank),['was ',Object.assign(h('span','was',fmt(H.prevRank))),' · '+(mv>=0?'up ':'down ')+fmt(Math.abs(mv))]);
  else row('Overall rank',fmt(H.rank),'of '+fmt(H.totalPlayers));
  row('GW rank',fmt(H.gwRank),'of '+fmt(H.totalPlayers));
  row('Captain',H.captain,'most captained in the game: '+H.mostCaptained+' '+H.mostCaptainedPts+'×2');
  row('Bench',String(H.bench),(H.benchWho||'nobody scored')+' · '+(H.hit?'-'+H.hit+' hit':'no hit')+' · '+(H.chip?'chip: '+H.chip:'no chip'));
  row('Season total',String(H.total),H.seasonPts.join(' · '));
})();

// mini-leagues
(function(){
  const wrap=document.getElementById('leagues');
  document.getElementById('leagues-lede').textContent=D.leagues.length?'Total after GW'+D.gw+', this week\'s score at the end of each bar.':'No mini-leagues on this entry.';
  D.leagues.forEach(lg=>{
    const box=h('div'); box.appendChild(h('h3',null,lg.name)); box.appendChild(h('p','cap',lg.move));
    const W=400,rowH=24,L=150,R=70,Hh=lg.rows.length*rowH+4;
    const svg=sv('svg',{viewBox:'0 0 '+W+' '+Hh,class:'chart'});
    const lo=Math.min(...lg.rows.map(r=>r.total)), hi=Math.max(...lg.rows.map(r=>r.total));
    const min=Math.max(0,Math.floor((lo-(hi-lo)*0.6)/20)*20), max=Math.ceil(hi/20)*20;
    const sx=v=>(W-L-R)*(v-min)/Math.max(1,max-min);
    sv('line',{x1:L,x2:L,y1:0,y2:Hh-4,class:'axis'},svg);
    lg.rows.forEach((r,i)=>{const y=i*rowH+4;
      txt(svg,L-8,y+8,r.rank+'. '+r.name,r.us?'nm us':'nm','end');
      const g=sv('g',{},svg);
      bar(g,L,y,sx(r.total),16,r.us?'var(--series-1)':'var(--series-muted)');
      sv('rect',{x:L-2,y:y-4,width:W-L-R+10,height:rowH,fill:'transparent'},g);
      txt(svg,L+sx(r.total)+6,y+8,r.total+' · '+r.gw,r.us?'lab us':'lab');
      bindTip(g,[r.total+' total',r.name+' · '+r.player,'GW'+D.gw+': '+r.gw+' pts · rank '+r.rank+(r.last&&r.last!==r.rank?' (was '+r.last+')':'')]);});
    if(min>0) txt(svg,L,Hh+6,'axis starts at '+min,'');
    const cb=h('div','chartbox'); cb.appendChild(svg); box.appendChild(cb); wrap.appendChild(box);
  });
})();

// where the points went
(function(){
  const F=D.field;
  document.getElementById('field-cap').textContent='Against the top '+F.n+' of the overall league this week: his points × (our multiplier minus their effective ownership, captain counted twice). Bars left: they had him and we did not.';
  const worst=F.losses.slice(0,3).map(g=>g.n+' '+g.gap).join(', ');
  const clubs=F.clubs.map(c=>c.team+' '+c.gap+' (they fielded '+c.theirs+' a team, we '+c.ours+')').join('; ');
  document.getElementById('field-lede').textContent=(F.losses.length?'Biggest gaps: '+worst+'. ':'')+(clubs?'By club: '+clubs+'.':'');
  const rows=[...F.losses,...F.gains.slice().reverse()];
  const W=400,rowH=24,L=100,R=40,Hh=rows.length*rowH+20;
  const svg=document.getElementById('field'); svg.setAttribute('viewBox','0 0 '+W+' '+Hh);
  const big=Math.max(5,...rows.map(r=>Math.abs(r.gap))), lim=big*1.35;
  const mid=L+(W-L-R)*lim/(2*lim), sx=v=>(W-L-R)*v/(2*lim);
  sv('line',{x1:mid,x2:mid,y1:0,y2:Hh-18,class:'axis'},svg);
  [-big,0,big].forEach(v=>txt(svg,mid+sx(v),Hh-6,sign(Math.round(v)),'','middle'));
  rows.forEach((r,i)=>{const y=i*rowH+2;
    txt(svg,L-8,y+9,r.n,'nm','end');
    const g=sv('g',{},svg);
    bar(g,mid,y+1,sx(r.gap),16,r.gap<0?'var(--series-5)':'var(--series-1)');
    sv('rect',{x:L,y:y-2,width:W-L-R,height:rowH,fill:'transparent'},g);
    txt(svg,r.gap<0?mid+sx(r.gap)-4:mid+sx(r.gap)+4,y+9,sign(r.gap),'lab',r.gap<0?'end':'start');
    bindTip(g,[sign(r.gap)+' against the top '+F.n,r.n+' ('+r.team+') scored '+r.pts,'Top '+F.n+' effective ownership '+Math.round(r.eo*100)+'%, ours ×'+r.us,(F.rivals?r.rivals+' of '+F.rivals+' mini-league rivals had him':'')]);});
})();

// bought against sold
(function(){
  const K=D.market, wk=K.thisWeek;
  const tw=document.getElementById('market-week');
  const so=wk.reduce((a,m)=>a+m.outGw,0), si=wk.reduce((a,m)=>a+m.inGw,0);
  document.getElementById('market-lede').textContent=wk.length?'GW'+D.gw+(K.chip?' ('+K.chip+')':'')+': the '+wk.length+' bought scored '+si+', the '+wk.length+' sold '+so+'. '+(si>=so?'Bought ahead by '+(si-so)+'.':'Sold ahead by '+(so-si)+'.')+' Paired the way FPL records them; raw player points, the captain\'s double is not in it.':'No transfers in GW'+D.gw+'.';
  if(wk.length){
    const hr=h('tr');['Sold','Pts','Bought','Pts','Net'].forEach((c,i)=>hr.appendChild(h('th',i%2||i===4?'n':null,c)));tw.appendChild(h('thead')).appendChild(hr);
    const tb=h('tbody');tw.appendChild(tb);
    wk.forEach(m=>{const tr=h('tr');tr.appendChild(h('td',null,m.out));tr.appendChild(h('td','n',String(m.outGw)));tr.appendChild(h('td',null,m.in));tr.appendChild(h('td','n',String(m.inGw)));
      const d=m.inGw-m.outGw;const td=h('td','n');td.appendChild(chip(d>0?'paid':d<0?'cost':'level',sign(d)));tr.appendChild(td);tb.appendChild(tr);});
    const tr=h('tr');[['Total',null],[String(so),'n'],['',null],[String(si),'n']].forEach(([c,k])=>tr.appendChild(h('td',(k?k+' ':'')+'sum',c)));
    const td=h('td','n sum');td.appendChild(chip(si>so?'paid':si<so?'cost':'level',sign(si-so)));tr.appendChild(td);tb.appendChild(tr);
  }
  const ta=document.getElementById('market-all');
  const hr=h('tr');['GW','Sold → bought','Sold','Bought','Net'].forEach((c,i)=>hr.appendChild(h('th',i>=2?'n':null,c)));ta.appendChild(h('thead')).appendChild(hr);
  const tb=h('tbody');ta.appendChild(tb);let a=0,b=0;
  K.all.forEach(m=>{a+=m.outSince;b+=m.inSince;const tr=h('tr');tr.appendChild(h('td','n',String(m.gw)));tr.appendChild(h('td',null,m.out+' → '+m.in+(m.soldOn?' (sold GW'+m.soldOn+')':'')));tr.appendChild(h('td','n',String(m.outSince)));tr.appendChild(h('td','n',String(m.inSince)));
    const d=m.inSince-m.outSince;const td=h('td','n');td.appendChild(chip(d>0?'paid':d<0?'cost':'level',sign(d)));tr.appendChild(td);tb.appendChild(tr);});
  const tr=h('tr');tr.appendChild(h('td','sum',''));tr.appendChild(h('td','sum','Season'+(K.hits?', after '+K.hits+' in hits':'')));tr.appendChild(h('td','n sum',String(a)));tr.appendChild(h('td','n sum',String(b)));
  const d=b-a-K.hits;const td=h('td','n sum');td.appendChild(chip(d>0?'paid':d<0?'cost':'level',sign(d)));tr.appendChild(td);tb.appendChild(tr);
})();

// players
(function(){
  const P=D.players;
  const counted=P.filter(p=>p.counted).map(p=>p.pts).sort((a,b)=>b-a);
  const top4=counted.slice(0,4).reduce((a,b)=>a+b,0);
  document.getElementById('players-lede').textContent=top4+' of '+H.points+' from the four best slots. Captain doubled; the bench is shown but not counted.';
  const W=400,rowH=24,L=92,R=72,Hh=P.length*rowH+16;
  const svg=document.getElementById('players'); svg.setAttribute('viewBox','0 0 '+W+' '+Hh);
  const max=Math.max(10,Math.ceil(Math.max(...P.map(p=>p.pts))/5)*5), sx=v=>(W-L-R)*v/max;
  for(let v=0;v<=max;v+=5){sv('line',{x1:L+sx(v),x2:L+sx(v),y1:0,y2:Hh-16,class:'grid'},svg);txt(svg,L+sx(v),Hh-6,v,'','middle');}
  sv('line',{x1:L,x2:L,y1:0,y2:Hh-16,class:'axis'},svg);
  P.forEach((p,i)=>{const y=i*rowH+2;
    txt(svg,L-8,y+9,p.n,'nm','end');
    const g=sv('g',{},svg);
    bar(g,L,y+1,sx(p.pts),16,p.counted?'var(--series-1)':'var(--series-muted)');
    sv('rect',{x:L-2,y:y-2,width:W-L-R+10,height:rowH,fill:'transparent'},g);
    txt(svg,L+sx(p.pts)+6,y+9,p.pts+(p.tag?'  '+p.tag:''),'lab');
    bindTip(g,[p.pts+' pts',p.n+' · '+p.pos+' · '+p.min+' min'+(p.counted?'':' · bench'),p.note]);
  });
})();

// points vs average
(function(){
  const S=D.season; if(S.length<2){document.getElementById('points-lede').textContent='One gameweek so far.';return;}
  const above=S.filter(s=>s.pts>s.avg).length;
  document.getElementById('points-lede').textContent=above+' of '+S.length+' weeks above the average.';
  const W=400,Hh=200,L=30,R=56,T=14,B=26;
  const svg=document.getElementById('points'); svg.setAttribute('viewBox','0 0 '+W+' '+Hh);
  const ymax=Math.ceil(Math.max(...S.flatMap(s=>[s.pts,s.avg]))/25)*25;
  const xs=i=>L+(W-L-R)*i/(S.length-1), ys=v=>T+(Hh-T-B)*(1-v/ymax);
  for(let v=0;v<=ymax;v+=25){sv('line',{x1:L,x2:W-R,y1:ys(v),y2:ys(v),class:'grid'},svg);txt(svg,L-6,ys(v),v,'','end');}
  const every=Math.ceil(S.length/8);
  S.forEach((s,i)=>{if(i%every===0||i===S.length-1)txt(svg,xs(i),Hh-8,'GW'+s.gw,'','middle');});
  const line=(key,color)=>{sv('path',{d:S.map((s,i)=>(i?'L':'M')+xs(i)+','+ys(s[key])).join(''),class:'ln',stroke:color},svg);
    S.forEach((s,i)=>sv('circle',{cx:xs(i),cy:ys(s[key]),r:S.length>15?3:4,fill:color,class:'dot'},svg));};
  line('avg','var(--series-muted)'); line('pts','var(--series-1)');
  const last=S[S.length-1]; const n=S.length-1;
  const sep=Math.abs(ys(last.pts)-ys(last.avg))<12;
  txt(svg,xs(n)+10,ys(last.pts)-(sep?6:0),last.pts+' us','lab us'); txt(svg,xs(n)+10,ys(last.avg)+(sep?6:0),last.avg+' avg','');
  const cross=sv('line',{y1:T,y2:Hh-B,class:'axis',style:'display:none'},svg);
  S.forEach((s,i)=>{const hit=sv('rect',{x:xs(i)-(W-L-R)/(2*n),y:T,width:(W-L-R)/n,height:Hh-T-B,fill:'transparent'},svg);
    hit.addEventListener('pointerenter',()=>{cross.setAttribute('x1',xs(i));cross.setAttribute('x2',xs(i));cross.style.display='';});
    hit.addEventListener('pointerleave',()=>cross.style.display='none');
    bindTip(hit,[s.pts+' pts','GW'+s.gw+' · average '+s.avg+' · '+sign(s.pts-s.avg)]);});
})();

// rank
(function(){
  const S=D.season; if(S.length<2){document.getElementById('rank-lede').textContent=M(S[0].rank);return;}
  document.getElementById('rank-lede').textContent=M(S[0].rank)+' after GW'+S[0].gw+', '+M(S[S.length-1].rank)+' now. Lower is better.';
  const W=400,Hh=150,L=34,R=56,T=12,B=26;
  const svg=document.getElementById('rank'); svg.setAttribute('viewBox','0 0 '+W+' '+Hh);
  const lo=Math.floor(Math.min(...S.map(s=>s.rank))/1e6)*1e6, hi=Math.ceil(Math.max(...S.map(s=>s.rank))/1e6)*1e6;
  const xs=i=>L+(W-L-R)*i/(S.length-1), ys=v=>T+(Hh-T-B)*(v-lo)/Math.max(1,hi-lo);
  const step=(hi-lo)/1e6>6?2e6:1e6;
  for(let v=lo;v<=hi;v+=step){sv('line',{x1:L,x2:W-R,y1:ys(v),y2:ys(v),class:'grid'},svg);txt(svg,L-6,ys(v),(v/1e6)+'M','','end');}
  const every=Math.ceil(S.length/8);
  S.forEach((s,i)=>{if(i%every===0||i===S.length-1)txt(svg,xs(i),Hh-8,'GW'+s.gw,'','middle');});
  sv('path',{d:S.map((s,i)=>(i?'L':'M')+xs(i)+','+ys(s.rank)).join(''),class:'ln',stroke:'var(--series-1)'},svg);
  S.forEach((s,i)=>{sv('circle',{cx:xs(i),cy:ys(s.rank),r:S.length>15?3:4,fill:'var(--series-1)',class:'dot'},svg);
    bindTip(sv('circle',{cx:xs(i),cy:ys(s.rank),r:14,fill:'transparent'},svg),[fmt(s.rank),'GW'+s.gw+' overall rank']);});
  const n=S.length-1; txt(svg,xs(n)+10,ys(S[n].rank),M(S[n].rank),'lab us');
})();

// armband
(function(){
  const A=D.ledger; const last=A[A.length-1];
  document.getElementById('armband-lede').textContent='Our captain ×2 minus the field\'s captain ×2, every week. Cumulative '+sign(last.cum)+'.';
  const W=400,Hh=190,L=30,R=52,T=14,B=26;
  const bw=Math.min(22,Math.floor((W-L-R)/A.length*0.6));
  const svg=document.getElementById('armband'); svg.setAttribute('viewBox','0 0 '+W+' '+Hh);
  const vals=A.flatMap(a=>[a.swing,a.cum]); const lim=Math.max(10,Math.ceil(Math.max(...vals.map(Math.abs))/10)*10);
  const xs=i=>L+(W-L-R)*(i+0.5)/A.length, ys=v=>T+(Hh-T-B)*(1-(v+lim)/(2*lim));
  for(let v=-lim;v<=lim;v+=10){sv('line',{x1:L,x2:W-R,y1:ys(v),y2:ys(v),class:v===0?'axis':'grid'},svg);txt(svg,L-6,ys(v),sign(v),'','end');}
  const every=Math.ceil(A.length/8);
  A.forEach((a,i)=>{const x=xs(i); if(i%every===0||i===A.length-1) txt(svg,x,Hh-8,'GW'+a.gw,'','middle');
    const g=sv('g',{},svg); const y0=ys(0), y1=ys(a.swing);
    if(a.swing!==0) bar(g,x-bw/2,Math.min(y0,y1),bw,Math.abs(y1-y0),a.swing>0?'var(--series-1)':'var(--series-5)');
    sv('rect',{x:x-(W-L-R)/(2*A.length),y:T,width:(W-L-R)/A.length,height:Hh-T-B,fill:'transparent'},g);
    if(A.length<=10) txt(svg,x,a.swing>=0?y1-9:y1+9,sign(a.swing),'lab','middle');
    bindTip(g,[sign(a.swing)+' swing','GW'+a.gw+' · '+a.ours+' '+a.o+' (×'+a.mult+' = '+(a.o*a.mult)+') vs '+a.field+' '+a.f+' (×2 = '+(a.f*2)+')','Cumulative '+sign(a.cum)]);});
  sv('path',{d:A.map((a,i)=>(i?'L':'M')+xs(i)+','+ys(a.cum)).join(''),class:'ln',stroke:'var(--text)'},svg);
  A.forEach((a,i)=>sv('circle',{cx:xs(i),cy:ys(a.cum),r:3,fill:'var(--text)',class:'dot'},svg));
  txt(svg,xs(A.length-1)+14,ys(last.cum),sign(last.cum)+' cum.','lab');
})();

// flags: grouped by the read, cost first
(function(){
  const ul=document.getElementById('flags'), F=D.flags;
  document.getElementById('flags-h').textContent=F.length?'The '+F.length+' flags':'The flags';
  if(!F.length){document.getElementById('flags-lede').textContent='No flag outcomes in the decision log yet.';return;}
  const word={cost:'cost us',paid:'paid us',level:'level',open:'still open'};
  const order=['cost','paid','level','open',null];
  const counts=order.filter(Boolean).map(k=>[k,F.filter(f=>f.read===k).length]).filter(([,n])=>n);
  document.getElementById('flags-lede').textContent=counts.length?counts.map(([k,n])=>n+' '+word[k]).join(' · ')+'. Each one is a call we made before the deadline, scored against what happened.':'Every watch flag from the decision log, resolved.';
  order.forEach(k=>F.filter(f=>f.read===k).forEach(f=>{
    const li=h('li','row'); li.appendChild(chip(f.read,(f.num?f.num+' ':'')+(word[f.read]||'unmarked')));
    const m=h('div','row-main'); m.appendChild(h('span','row-t',f.flag)); if(f.verdict) m.appendChild(h('span',null,f.verdict+'.'));
    if(f.note) m.appendChild(h('span','row-m',f.note)); li.appendChild(m); ul.appendChild(li);}));
})();

// table view + footer
(function(){
  const t=document.getElementById('tbl');
  const row=(cells,th)=>{const tr=h('tr');cells.forEach((c,i)=>{const d=h(th?'th':'td',(i>0)?'n':null,String(c));tr.appendChild(d);});t.appendChild(tr);};
  row(['Player','Min','Pts','Counted'],true); D.players.forEach(p=>row([p.n+(p.tag?' ('+p.tag+')':''),p.min,p.pts,p.counted?'yes':'no']));
  row(['Against the top '+D.field.n,'Pts','Us ×','Their EO','Gap'],true); [...D.field.losses,...D.field.gains].forEach(g=>row([g.n+' ('+g.team+')',g.pts,g.us,Math.round(g.eo*100)+'%',sign(g.gap)]));
  row(['GW','Points','Average','Overall rank'],true); D.season.forEach(s=>row(['GW'+s.gw,s.pts,s.avg,fmt(s.rank)]));
  row(['GW','Our captain ×n','Field ×2','Swing','Cumulative'],true); D.ledger.forEach(a=>row(['GW'+a.gw,a.ours+' '+(a.o*a.mult),a.field+' '+(a.f*2),a.swing,a.cum]));
  D.leagues.forEach(lg=>{row([lg.name,'Total','GW'+D.gw],true);lg.rows.forEach(r=>row([r.rank+'. '+r.name,r.total,r.gw]));});
  document.getElementById('foot').textContent='Decision log: docs/gw-decisions/'+D.seasonName+'/gw'+D.gw+'.md · built by scripts/gw-loop/outcome-page.mjs · brand '+D.brand.replace('vongohren/brand@','').slice(0,7);
})();
</script>
</body>
</html>
`;

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

const out = opt("out", path.join(os.tmpdir(), `fpl-gw${GW}-outcome.html`));
fs.writeFileSync(out, html);
if (!PUBLISH) {
  console.log(out);
  process.exit(0);
}
const r = spawnSync("artifact", ["publish", out, "--name", `fpl-gw${GW}-outcome`, "--title", `FPL GW${GW} outcome`], { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const url = ((r.stdout || "").match(/https?:\/\/\S+/) || [])[0];
console.log(url || (r.stdout || "").trim());
