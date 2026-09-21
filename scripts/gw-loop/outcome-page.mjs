#!/usr/bin/env node
// =============================================================================
// outcome-page — the ONE visual a post-mortem produces.
//
// Deterministic (no LLM): reads the live FPL API plus the finished decision log
// and renders a self-contained, phone-first HTML page, the same view every
// gameweek. The post-mortem agent runs it once the doc is written; the page is
// what the human looks at, the doc is what the next research run reads.
//
// Sections, in this order, always:
//   hero (points vs average, rank, GW rank, season total, bench)
//   mini-leagues (every classic league of type "x", us highlighted)
//   who scored it (all 15 picks, captain doubled, bench not counted)
//   five weeks against the average + overall rank
//   the armband ledger (our captain x2 vs the field's captain x2, cumulative)
//   the flags (parsed from `### Flag outcomes` in gw<N>.md)
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

const [picks, live, fixtures, history, entry] = await Promise.all([
  fetchJson(`entry/${ENTRY}/event/${GW}/picks/`),
  fetchJson(`event/${GW}/live/`),
  fetchJson(`fixtures/?event=${GW}`),
  fetchJson(`entry/${ENTRY}/history/`),
  fetchJson(`entry/${ENTRY}/`),
]);
const stats = Object.fromEntries(live.elements.map((e) => [e.id, e]));
const fixtureOf = (teamId) => fixtures.find((f) => f.team_h === teamId || f.team_a === teamId);
const eh = picks.entry_history;
const net = (h) => h.points - (h.event_transfers_cost || 0);
const season = history.current.filter((h) => h.event <= GW);
const prev = season.find((h) => h.event === GW - 1);

// Armband ledger, from the API rather than the doc: the pick carrying the
// multiplier is the effective captain (vice, if the captain did not play);
// the field's captain is events[N].most_captained.
const ledger = [];
let cum = 0;
for (let g = 1; g <= GW; g++) {
  const p = g === GW ? picks : await fetchJson(`entry/${ENTRY}/event/${g}/picks/`);
  const l = g === GW ? live : await fetchJson(`event/${g}/live/`);
  const s = Object.fromEntries(l.elements.map((e) => [e.id, e.stats.total_points]));
  const cap = p.picks.find((x) => x.multiplier > 1) || p.picks.find((x) => x.is_captain);
  const e = boot.events.find((x) => x.id === g);
  const ours = s[cap.element] ?? 0;
  const mult = Math.max(cap.multiplier, 1);
  const field = s[e.most_captained] ?? 0;
  const swing = ours * mult - field * 2;
  cum += swing;
  ledger.push({ gw: g, ours: el[cap.element]?.web_name || cap.element, o: ours, mult, field: el[e.most_captained]?.web_name || e.most_captained, f: field, swing, cum });
}

// Mini-leagues: the classic leagues the human created or joined (type "x").
const leagues = [];
for (const lg of (entry.leagues?.classic || []).filter((l) => l.league_type === "x")) {
  const st = await fetchJson(`leagues-classic/${lg.id}/standings/`);
  const rows = st.standings.results.map((r) => ({ name: r.entry_name, player: r.player_name, total: r.total, gw: r.event_total, rank: r.rank, last: r.last_rank, us: r.entry === Number(ENTRY) }));
  const us = rows.find((r) => r.us);
  const gwRank = us ? rows.filter((r) => r.gw > us.gw).length + 1 : null;
  const ord = (n) => n + (["th", "st", "nd", "rd"][((n % 100) - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th");
  let move = "";
  if (us) {
    const dir = us.last === 0 ? "" : us.last === us.rank ? "unchanged" : us.last > us.rank ? `up from ${ord(us.last)}` : `down from ${ord(us.last)}`;
    const score = gwRank === 1 ? "Best score in the league this week" : `${ord(gwRank)}-best score in the league this week`;
    move = `${ord(us.rank)} of ${rows.length}${dir ? ", " + dir : ""}. ${score}`;
  }
  leagues.push({ name: lg.name, move, rows });
}

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
//   - [x] **<flag>: <VERDICT>.** <first sentence of the rest>
const docPath = opt("doc", path.join(REPO, "docs", "gw-decisions", SEASON, `gw${GW}.md`));
const flags = [];
try {
  const text = fs.readFileSync(docPath, "utf8");
  const block = (text.split(/^### Flag outcomes/m)[1] || "").split(/^(?:---|## )/m)[0];
  const items = block.split(/^- \[[ x]\] /m).slice(1);
  for (const raw of items) {
    const item = raw.replace(/\s+/g, " ").trim();
    const m = item.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (!m) {
      flags.push({ flag: item.slice(0, 80), verdict: "", note: "" });
      continue;
    }
    const bold = m[1].replace(/\.$/, "");
    const i = bold.lastIndexOf(": ");
    const flag = i > 0 ? bold.slice(0, i) : bold;
    const verdict = i > 0 ? bold.slice(i + 2) : "";
    const rest = m[2].replace(/\*\*|`/g, "");
    const note = (rest.match(/^.*?[.!?](?=\s|$)/) || [rest])[0].trim();
    flags.push({ flag, verdict, note: note.length > 160 ? note.slice(0, 157) + "…" : note });
  }
} catch {
  /* no doc: the page still renders, the flags card says so */
}

const data = {
  gw: GW,
  seasonName: SEASON,
  entryName: entry.name,
  finalised: new Date().toISOString().slice(0, 10),
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
    mostCaptained: el[ev.most_captained]?.web_name,
    mostCaptainedPts: stats[ev.most_captained]?.stats.total_points,
  },
  players,
  season: season.map((h) => ({ gw: h.event, pts: net(h), avg: boot.events.find((e) => e.id === h.event)?.average_entry_score ?? 0, rank: h.overall_rank })),
  ledger,
  leagues,
  flags,
};

// ----------------------------------------------------------------------------- html
const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FPL GW${GW} outcome · ${esc(entry.name)}</title>
<style>
  :root {
    color-scheme: light;
    --surface: #fcfcfb; --plane: #f9f9f7;
    --ink: #0b0b0b; --ink2: #52514e; --muted: #898781;
    --grid: #e1e0d9; --axis: #c3c2b7; --border: rgba(11,11,11,0.10);
    --s1: #2a78d6; --s2: #eb6834; --neg: #e34948; --pos: #2a78d6;
    --other: #c3c2b7; --good: #006300; --bad: #d03b3b;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
      --surface: #1a1a19; --plane: #0d0d0d;
      --ink: #ffffff; --ink2: #c3c2b7; --muted: #898781;
      --grid: #2c2c2a; --axis: #383835; --border: rgba(255,255,255,0.10);
      --s1: #3987e5; --s2: #d95926; --neg: #e66767; --pos: #3987e5;
      --other: #52514e; --good: #0ca30c; --bad: #e66767;
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--plane); color: var(--ink);
    font: 15px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 680px; margin: 0 auto; padding: 16px 12px 48px; }
  h1 { font-size: 20px; margin: 4px 0 2px; font-weight: 600; }
  .sub { color: var(--ink2); font-size: 13px; margin: 0 0 14px; }
  h2 { font-size: 15px; font-weight: 600; margin: 0 0 2px; }
  .lede { color: var(--ink2); font-size: 13px; margin: 0 0 10px; }
  section.card { background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 14px 10px; margin: 0 0 14px; }
  .hero { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
  .hero .n { font-size: 56px; font-weight: 600; line-height: 1; }
  .hero .l { color: var(--ink2); font-size: 14px; }
  .delta { font-weight: 600; color: var(--good); }
  .delta.down { color: var(--bad); }
  .tiles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 14px; }
  .tile { border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
  .tile .label { font-size: 12px; color: var(--ink2); }
  .tile .value { font-size: 22px; font-weight: 600; line-height: 1.2; }
  .tile .d { font-size: 12px; color: var(--ink2); }
  svg { display: block; width: 100%; height: auto; overflow: visible; }
  svg text { font-family: inherit; fill: var(--ink2); font-size: 11px; }
  svg .tick { font-variant-numeric: tabular-nums; fill: var(--muted); }
  svg .val { fill: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
  svg .name { fill: var(--ink); }
  svg .grid { stroke: var(--grid); stroke-width: 1; }
  svg .base { stroke: var(--axis); stroke-width: 1; }
  .legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--ink2); margin: 2px 0 8px; }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
  .ln { width: 16px; height: 2px; display: inline-block; border-radius: 1px; }
  .mark:hover, .mark:focus { filter: brightness(1.15); outline: none; }
  #tip { position: fixed; pointer-events: none; background: var(--ink); color: var(--surface);
    padding: 6px 9px; border-radius: 6px; font-size: 12px; line-height: 1.35; display: none;
    max-width: 240px; z-index: 9; }
  #tip b { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px 4px; border-top: 1px solid var(--grid); vertical-align: top; }
  th { color: var(--ink2); font-weight: 500; border-top: 0; font-size: 12px; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  .v { font-weight: 600; }
  .note { color: var(--ink2); }
  details summary { cursor: pointer; color: var(--ink2); font-size: 13px; margin: 6px 0; }
  .mini { display: grid; gap: 12px; }
  .mini h3 { font-size: 13px; font-weight: 600; margin: 0 0 2px; }
  .mini .m { font-size: 12px; color: var(--ink2); margin: 0 0 4px; }
  footer { color: var(--muted); font-size: 12px; margin-top: 8px; }
</style>
</head>
<body>
<main>
  <h1></h1>
  <p class="sub"></p>
  <section class="card" id="hero"></section>
  <section class="card">
    <h2>Mini-leagues</h2>
    <p class="lede" id="leagues-lede"></p>
    <div class="legend"><span><i class="sw" style="background:var(--s1)"></i><span id="us-name"></span></span><span><i class="sw" style="background:var(--other)"></i>Everyone else</span></div>
    <div class="mini" id="leagues"></div>
  </section>
  <section class="card">
    <h2>Who scored it</h2>
    <p class="lede" id="players-lede"></p>
    <div class="legend"><span><i class="sw" style="background:var(--s1)"></i>Counted (on the pitch)</span><span><i class="sw" style="background:var(--s2)"></i>Bench, not counted</span></div>
    <div id="players"></div>
  </section>
  <section class="card">
    <h2>Against the average</h2>
    <p class="lede" id="points-lede"></p>
    <div class="legend"><span><i class="ln" style="background:var(--s1)"></i><span id="us-name-2"></span></span><span><i class="ln" style="background:var(--s2)"></i>GW average</span></div>
    <div id="points"></div>
    <h2 style="margin-top:14px">Overall rank</h2>
    <p class="lede" id="rank-lede"></p>
    <div id="rank"></div>
  </section>
  <section class="card">
    <h2>The armband ledger</h2>
    <p class="lede" id="armband-lede"></p>
    <div class="legend"><span><i class="sw" style="background:var(--pos)"></i>Swing for us</span><span><i class="sw" style="background:var(--neg)"></i>Swing against</span><span><i class="ln" style="background:var(--ink2)"></i>Cumulative</span></div>
    <div id="armband"></div>
  </section>
  <section class="card">
    <h2 id="flags-h">The flags</h2>
    <p class="lede">Every watch flag from the decision log, resolved.</p>
    <table id="flags"></table>
  </section>
  <details><summary>Table view of the charts</summary><table id="tbl"></table></details>
  <footer id="foot"></footer>
</main>
<div id="tip" role="status"></div>
<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>
const D = JSON.parse(document.getElementById('data').textContent);
const NS='http://www.w3.org/2000/svg';
const el=(t,a={},parent)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(parent)parent.appendChild(e);return e;};
const txt=(parent,x,y,s,cls,anchor)=>{const t=el('text',{x,y,class:cls||'','text-anchor':anchor||'start','dominant-baseline':'middle'},parent);t.textContent=s;return t;};
const h=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
const fmt=n=>n.toLocaleString('en');
const M=n=>n>=1e6?(n/1e6).toFixed(2).replace(/0$/,'')+'M':n>=1e3?Math.round(n/1e3)+'K':String(n);
const sign=n=>(n>0?'+':'')+n;
const tip=document.getElementById('tip');
function bindTip(node,lines){
  const show=e=>{tip.replaceChildren();lines.forEach((l,i)=>{const d=h('div');if(i===0){d.appendChild(h('b',null,l));}else d.textContent=l;tip.appendChild(d);});tip.style.display='block';move(e);};
  const move=e=>{tip.style.left=Math.min((e.clientX??0)+12,window.innerWidth-250)+'px';tip.style.top=((e.clientY??0)+14)+'px';};
  const hide=()=>tip.style.display='none';
  node.classList.add('mark');node.setAttribute('tabindex','0');
  node.addEventListener('pointerenter',show);node.addEventListener('pointermove',move);node.addEventListener('pointerleave',hide);
  node.addEventListener('focus',()=>{const r=node.getBoundingClientRect();show({clientX:r.left+r.width/2,clientY:r.top});});node.addEventListener('blur',hide);
}
function hbar(x0,y,w,ht,r){ if(w<=0) return ''; r=Math.min(r,w,ht/2);
  return 'M'+x0+','+y+'h'+(w-r)+'a'+r+','+r+',0,0,1,'+r+','+r+'v'+(ht-2*r)+'a'+r+','+r+',0,0,1,-'+r+','+r+'h-'+(w-r)+'z'; }
function vbar(x,y0,w,hgt,r,up){ r=Math.min(r,hgt,w/2); if(hgt<=0) return '';
  if(up) return 'M'+x+','+y0+'v-'+(hgt-r)+'a'+r+','+r+',0,0,1,'+r+',-'+r+'h'+(w-2*r)+'a'+r+','+r+',0,0,1,'+r+','+r+'v'+(hgt-r)+'z';
  return 'M'+x+','+y0+'v'+(hgt-r)+'a'+r+','+r+',0,0,0,'+r+','+r+'h'+(w-2*r)+'a'+r+','+r+',0,0,0,'+r+',-'+r+'v-'+(hgt-r)+'z'; }
const H=D.hero;

// header + hero
document.querySelector('h1').textContent='GW'+D.gw+' outcome · '+D.entryName;
document.querySelector('.sub').textContent='FPL '+D.seasonName+' · finalised '+D.finalised+' · numbers from the live FPL API';
document.querySelectorAll('#us-name,#us-name-2').forEach(e=>e.textContent=D.entryName);
(function(){
  const s=document.getElementById('hero');
  const hero=h('div','hero'); hero.appendChild(h('div','n',String(H.points)));
  const l=h('div','l'); l.append('GW'+D.gw+' points'); l.appendChild(h('br'));
  const d=H.points-H.avg; const sp=h('span','delta'+(d<0?' down':''),sign(d)); l.appendChild(sp);
  const lowest=Math.min(...D.season.map(s=>s.avg))===H.avg&&D.season.length>1?', the lowest of the season':Math.max(...D.season.map(s=>s.avg))===H.avg&&D.season.length>1?', the highest of the season':'';
  l.append(' vs the average of '+H.avg+lowest+' · highest '+H.highest); hero.appendChild(l); s.appendChild(hero);
  const tiles=h('div','tiles');
  const tile=(label,value,dnode)=>{const t=h('div','tile');t.appendChild(h('div','label',label));t.appendChild(h('div','value',value));const dd=h('div','d');if(typeof dnode==='string')dd.textContent=dnode;else dd.append(...dnode);t.appendChild(dd);tiles.appendChild(t);};
  if(H.prevRank!=null){const mv=H.prevRank-H.rank;tile('Overall rank',M(H.rank),[Object.assign(h('span','delta'+(mv<0?' down':''),(mv>=0?'▲ ':'▼ ')+fmt(Math.abs(mv))),{}),' from '+M(H.prevRank)]);}
  else tile('Overall rank',M(H.rank),'of '+M(H.totalPlayers));
  tile('GW rank',M(H.gwRank),'of '+M(H.totalPlayers)+' · most captained '+H.mostCaptained+' '+H.mostCaptainedPts);
  tile('Season total',String(H.total),H.seasonPts.join(' · '));
  tile('On the bench',String(H.bench),[H.benchWho?H.benchWho:'nobody scored',' · ',H.hit?'-'+H.hit+' hit':'no hit',' · ',H.chip?'chip: '+H.chip:'no chip'].join(''));
  s.appendChild(tiles);
})();

// mini-leagues
(function(){
  const wrap=document.getElementById('leagues');
  document.getElementById('leagues-lede').textContent=D.leagues.length?'Total points after GW'+D.gw+'. Hover a bar for this week\'s score.':'No mini-leagues on this entry.';
  D.leagues.forEach(lg=>{
    const box=h('div'); box.appendChild(h('h3',null,lg.name)); box.appendChild(h('p','m',lg.move));
    const W=400,rowH=22,L=138,R=40,Hh=lg.rows.length*rowH+4;
    const svg=el('svg',{viewBox:'0 0 '+W+' '+Hh});
    const lo=Math.min(...lg.rows.map(r=>r.total)), hi=Math.max(...lg.rows.map(r=>r.total));
    const min=Math.max(0,Math.floor((lo-(hi-lo)*0.6)/20)*20), max=Math.ceil(hi/20)*20;
    const sx=v=>(W-L-R)*(v-min)/Math.max(1,max-min);
    el('line',{x1:L,x2:L,y1:0,y2:Hh-4,class:'base'},svg);
    lg.rows.forEach((r,i)=>{const y=i*rowH+3;
      txt(svg,L-8,y+8,r.rank+'. '+r.name,r.us?'val':'name','end');
      const g=el('g',{},svg);
      el('path',{d:hbar(L,y,sx(r.total),16,4),fill:r.us?'var(--s1)':'var(--other)'},g);
      el('rect',{x:L-2,y:y-3,width:W-L-R+10,height:rowH,fill:'transparent'},g);
      txt(svg,L+sx(r.total)+6,y+8,r.total,r.us?'val':'tick');
      bindTip(g,[r.total+' total',r.name+' · '+r.player+' · GW'+D.gw+': '+r.gw+' pts · rank '+r.rank+(r.last&&r.last!==r.rank?' (was '+r.last+')':'')]);});
    if(min>0) txt(svg,L,Hh+4,'axis starts at '+min,'tick').setAttribute('font-size','10');
    box.appendChild(svg); wrap.appendChild(box);
  });
})();

// players
(function(){
  const P=D.players;
  const counted=P.filter(p=>p.counted).map(p=>p.pts).sort((a,b)=>b-a);
  const top4=counted.slice(0,4).reduce((a,b)=>a+b,0);
  document.getElementById('players-lede').textContent=top4+' of '+H.points+' from the four best slots. Captain doubled; the bench is shown but not counted.';
  const W=400,rowH=24,L=88,R=64,Hh=P.length*rowH+8;
  const svg=el('svg',{viewBox:'0 0 '+W+' '+Hh});
  const max=Math.max(10,Math.ceil(Math.max(...P.map(p=>p.pts))/5)*5), sx=v=>(W-L-R)*v/max;
  for(let v=0;v<=max;v+=5){el('line',{x1:L+sx(v),x2:L+sx(v),y1:0,y2:Hh-8,class:'grid'},svg);txt(svg,L+sx(v),Hh-2,v,'tick','middle');}
  el('line',{x1:L,x2:L,y1:0,y2:Hh-8,class:'base'},svg);
  P.forEach((p,i)=>{const y=i*rowH+4;
    txt(svg,L-8,y+8,p.n,'name','end');
    const g=el('g',{},svg);
    el('path',{d:hbar(L,y,sx(p.pts),16,4),fill:p.counted?'var(--s1)':'var(--s2)'},g);
    el('rect',{x:L-2,y:y-4,width:W-L-R+10,height:rowH,fill:'transparent'},g);
    txt(svg,L+sx(p.pts)+6,y+8,p.pts+(p.tag?'  '+p.tag:''),'val');
    bindTip(g,[p.pts+' pts',p.n+' · '+p.pos+' · '+p.min+' min'+(p.counted?'':' · bench'),p.note]);
  });
  document.getElementById('players').appendChild(svg);
})();

// points vs average
(function(){
  const S=D.season; if(S.length<2){document.getElementById('points-lede').textContent='One gameweek so far.';return;}
  const above=S.filter(s=>s.pts>s.avg).length;
  document.getElementById('points-lede').textContent=above+' of '+S.length+' weeks above the average.';
  const W=400,Hh=200,L=30,R=52,T=14,B=26;
  const svg=el('svg',{viewBox:'0 0 '+W+' '+Hh});
  const ymax=Math.ceil(Math.max(...S.flatMap(s=>[s.pts,s.avg]))/25)*25;
  const xs=i=>L+(W-L-R)*i/(S.length-1), ys=v=>T+(Hh-T-B)*(1-v/ymax);
  for(let v=0;v<=ymax;v+=25){el('line',{x1:L,x2:W-R,y1:ys(v),y2:ys(v),class:'grid'},svg);txt(svg,L-6,ys(v),v,'tick','end');}
  const every=Math.ceil(S.length/8);
  S.forEach((s,i)=>{if(i%every===0||i===S.length-1)txt(svg,xs(i),Hh-8,'GW'+s.gw,'tick','middle');});
  const line=(key,color)=>{el('path',{d:S.map((s,i)=>(i?'L':'M')+xs(i)+','+ys(s[key])).join(''),fill:'none',stroke:color,'stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'},svg);
    S.forEach((s,i)=>el('circle',{cx:xs(i),cy:ys(s[key]),r:S.length>15?3:5,fill:color,stroke:'var(--surface)','stroke-width':2},svg));};
  line('avg','var(--s2)'); line('pts','var(--s1)');
  const last=S[S.length-1]; const n=S.length-1;
  const sep=Math.abs(ys(last.pts)-ys(last.avg))<12;
  txt(svg,xs(n)+10,ys(last.pts)-(sep?6:0),last.pts+' us','val'); txt(svg,xs(n)+10,ys(last.avg)+(sep?6:0),last.avg+' avg','tick');
  const best=S.reduce((a,b)=>b.pts>a.pts?b:a); const bi=S.indexOf(best); if(bi!==n) txt(svg,xs(bi),ys(best.pts)-12,best.pts,'val','middle');
  const cross=el('line',{y1:T,y2:Hh-B,class:'base',style:'display:none'},svg);
  S.forEach((s,i)=>{const hit=el('rect',{x:xs(i)-(W-L-R)/(2*n),y:T,width:(W-L-R)/n,height:Hh-T-B,fill:'transparent'},svg);
    hit.addEventListener('pointerenter',()=>{cross.setAttribute('x1',xs(i));cross.setAttribute('x2',xs(i));cross.style.display='';});
    hit.addEventListener('pointerleave',()=>cross.style.display='none');
    bindTip(hit,[s.pts+' pts','GW'+s.gw+' · average '+s.avg+' · '+sign(s.pts-s.avg)]);});
  document.getElementById('points').appendChild(svg);
})();

// rank
(function(){
  const S=D.season; if(S.length<2){document.getElementById('rank-lede').textContent=M(S[0].rank);return;}
  document.getElementById('rank-lede').textContent=M(S[0].rank)+' → '+M(S[S.length-1].rank)+'.';
  const W=400,Hh=150,L=34,R=52,T=12,B=26;
  const svg=el('svg',{viewBox:'0 0 '+W+' '+Hh});
  const lo=Math.floor(Math.min(...S.map(s=>s.rank))/1e6)*1e6, hi=Math.ceil(Math.max(...S.map(s=>s.rank))/1e6)*1e6;
  const xs=i=>L+(W-L-R)*i/(S.length-1), ys=v=>T+(Hh-T-B)*(v-lo)/Math.max(1,hi-lo);
  const step=(hi-lo)/1e6>6?2e6:1e6;
  for(let v=lo;v<=hi;v+=step){el('line',{x1:L,x2:W-R,y1:ys(v),y2:ys(v),class:'grid'},svg);txt(svg,L-6,ys(v),(v/1e6)+'M','tick','end');}
  const every=Math.ceil(S.length/8);
  S.forEach((s,i)=>{if(i%every===0||i===S.length-1)txt(svg,xs(i),Hh-8,'GW'+s.gw,'tick','middle');});
  el('path',{d:S.map((s,i)=>(i?'L':'M')+xs(i)+','+ys(s.rank)).join(''),fill:'none',stroke:'var(--s1)','stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'},svg);
  S.forEach((s,i)=>{el('circle',{cx:xs(i),cy:ys(s.rank),r:S.length>15?3:5,fill:'var(--s1)',stroke:'var(--surface)','stroke-width':2},svg);
    bindTip(el('circle',{cx:xs(i),cy:ys(s.rank),r:14,fill:'transparent'},svg),[fmt(s.rank),'GW'+s.gw+' overall rank']);});
  const n=S.length-1; txt(svg,xs(n)+10,ys(S[n].rank),M(S[n].rank),'val');
  txt(svg,xs(0)+10,ys(S[0].rank)+12,M(S[0].rank),'tick');
  document.getElementById('rank').appendChild(svg);
})();

// armband
(function(){
  const A=D.ledger; const last=A[A.length-1];
  document.getElementById('armband-lede').textContent='Our captain ×2 minus the field\'s captain ×2, every week. Cumulative '+sign(last.cum)+'.';
  const W=400,Hh=190,L=30,R=44,T=14,B=26;
  const bw=Math.min(22,Math.floor((W-L-R)/A.length*0.6));
  const svg=el('svg',{viewBox:'0 0 '+W+' '+Hh});
  const vals=A.flatMap(a=>[a.swing,a.cum]); const lim=Math.max(10,Math.ceil(Math.max(...vals.map(Math.abs))/10)*10);
  const xs=i=>L+(W-L-R)*(i+0.5)/A.length, ys=v=>T+(Hh-T-B)*(1-(v+lim)/(2*lim));
  for(let v=-lim;v<=lim;v+=10){el('line',{x1:L,x2:W-R,y1:ys(v),y2:ys(v),class:v===0?'base':'grid'},svg);txt(svg,L-6,ys(v),sign(v),'tick','end');}
  const every=Math.ceil(A.length/8);
  A.forEach((a,i)=>{const x=xs(i); if(i%every===0||i===A.length-1) txt(svg,x,Hh-8,'GW'+a.gw,'tick','middle');
    const g=el('g',{},svg); const hgt=Math.abs(ys(a.swing)-ys(0));
    if(hgt>0) el('path',{d:vbar(x-bw/2,ys(0),bw,hgt,4,a.swing>0),fill:a.swing>0?'var(--pos)':'var(--neg)'},g);
    el('rect',{x:x-(W-L-R)/(2*A.length),y:T,width:(W-L-R)/A.length,height:Hh-T-B,fill:'transparent'},g);
    if(A.length<=10) txt(svg,x,a.swing>=0?ys(a.swing)-9:ys(a.swing)+9,sign(a.swing),'val','middle');
    bindTip(g,[sign(a.swing)+' swing','GW'+a.gw+' · '+a.ours+' '+a.o+' (×'+a.mult+' = '+(a.o*a.mult)+') vs '+a.field+' '+a.f+' (×2 = '+(a.f*2)+')','Cumulative '+sign(a.cum)]);});
  el('path',{d:A.map((a,i)=>(i?'L':'M')+xs(i)+','+ys(a.cum)).join(''),fill:'none',stroke:'var(--ink2)','stroke-width':2,'stroke-linejoin':'round'},svg);
  A.forEach((a,i)=>el('circle',{cx:xs(i),cy:ys(a.cum),r:4,fill:'var(--ink2)',stroke:'var(--surface)','stroke-width':2},svg));
  txt(svg,xs(A.length-1)+14,ys(last.cum),sign(last.cum)+' cum.','tick');
  document.getElementById('armband').appendChild(svg);
})();

// flags
(function(){
  const t=document.getElementById('flags');
  document.getElementById('flags-h').textContent=D.flags.length?'The '+D.flags.length+' flags':'The flags';
  const tr=h('tr'); tr.appendChild(h('th',null,'Flag')); tr.appendChild(h('th',null,'Verdict')); t.appendChild(tr);
  if(!D.flags.length){const r=h('tr');const d=h('td',null,'No flag outcomes in the decision log yet.');d.colSpan=2;r.appendChild(d);t.appendChild(r);return;}
  D.flags.forEach(f=>{const r=h('tr'); r.appendChild(h('td',null,f.flag)); const d=h('td'); d.appendChild(h('span','v',f.verdict)); if(f.note){d.append(' '); d.appendChild(h('span','note',f.note));} r.appendChild(d); t.appendChild(r);});
})();

// table view + footer
(function(){
  const t=document.getElementById('tbl');
  const row=(cells,th)=>{const tr=h('tr');cells.forEach((c,i)=>{const d=h(th?'th':'td',(!th&&i>0)?'n':null,String(c));tr.appendChild(d);});t.appendChild(tr);};
  row(['Player','Min','Pts','Counted'],true); D.players.forEach(p=>row([p.n+(p.tag?' ('+p.tag+')':''),p.min,p.pts,p.counted?'yes':'no']));
  row(['GW','Points','Average','Overall rank'],true); D.season.forEach(s=>row(['GW'+s.gw,s.pts,s.avg,fmt(s.rank)]));
  row(['GW','Our captain ×n','Field ×2','Swing','Cumulative'],true); D.ledger.forEach(a=>row(['GW'+a.gw,a.ours+' '+(a.o*a.mult),a.field+' '+(a.f*2),a.swing,a.cum]));
  D.leagues.forEach(lg=>{row([lg.name,'Total','GW'+D.gw],true);lg.rows.forEach(r=>row([r.rank+'. '+r.name,r.total,r.gw]));});
  document.getElementById('foot').textContent='Decision log: docs/gw-decisions/'+D.seasonName+'/gw'+D.gw+'.md';
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
