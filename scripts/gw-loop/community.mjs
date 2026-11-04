#!/usr/bin/env node
// =============================================================================
// community — the community research for one gameweek, as data.
//
// Deterministic (no LLM). Three layers per player, one doc per gameweek:
//   crowd      from the public FPL API: ownership, net transfers this round and
//              their share of current owners, this round's price change, and how
//              many of the overall top 50 fielded / captained him (their picks for
//              the PREVIOUS gameweek: this one's are private until the deadline)
//   consensus  other models' expected points for this gameweek, read from the
//              projections file the research session writes; mean over sources
//   stances    the sourced expert positions from the stances file, as records
//
//   community.mjs --gw <N> [--projections f] [--stances f] [--put] [--id gw<N>]
//                 [--out file] [--also 1,2,3] [--test]
//
//   projections.json  [{element, source, url, value}]
//   stances.json      [{element, source, url, date, stance, quote}]
//                     stance: buy | sell | hold | captain | avoid
//
// Writes $FPL_LOOP_STATE/community/gw<N>.json (--out overrides) and, with --put,
// the huddle doc (collection community, id gw<N>; --id overrides; with --test
// the id is test-gw<N> and gw<N> is refused).
// A re-run keeps the decision and actual blocks already in the file. Prints a
// short per-player summary for the decision log. Schema: community.schema.json.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { readJson, writeJson, putDoc, gwPath, r2, stanceCounts, PROJECT, COLLECTION } from "./community-lib.mjs";

const SECRETS = path.join(process.env.HOME || "/home/node", ".fpl", "secrets.env");
const API = "https://fantasy.premierleague.com/api";
const TOP_LEAGUE = 314; // the overall league
const TOP_N = 50;

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dflt;
};
const GW = Number(opt("gw"));
if (!GW) {
  console.error("usage: community.mjs --gw <N> [--projections f] [--stances f] [--put] [--id gw<N>] [--out file] [--also ids] [--test]");
  process.exit(2);
}
const PUT = args.includes("--put");
const TEST = args.includes("--test");
const OUT = opt("out", gwPath(GW));

function readSecrets() {
  const out = {};
  try {
    for (const raw of fs.readFileSync(SECRETS, "utf8").split("\n")) {
      const m = raw.replace(/^export\s+/, "").trim().match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) out[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch {
    /* public endpoints still work */
  }
  return out;
}
const ENTRY = process.env.FPL_MANAGER_ID || readSecrets().FPL_MANAGER_ID;

async function fetchJson(endpoint) {
  const sep = endpoint.includes("?") ? "&" : "?";
  const url = `${API}/${endpoint}${sep}_cb=${Date.now()}${process.pid}`;
  const headers = {
    "Cache-Control": "no-cache",
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
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        try {
          out[k] = await fn(items[k]);
        } catch {
          out[k] = null;
        }
      }
    }),
  );
  return out;
}

// ----------------------------------------------------------------------------- inputs
function readList(flag) {
  const f = opt(flag);
  if (!f) return [];
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!Array.isArray(j)) throw new Error(`--${flag} ${f}: expected an array`);
  return j;
}
const projections = readList("projections");
const stances = readList("stances");
const STANCES = new Set(["buy", "sell", "hold", "captain", "avoid"]);
for (const p of projections) if (!Number.isInteger(Number(p.element)) || typeof p.value !== "number" || !p.source) throw new Error(`bad projection record: ${JSON.stringify(p)}`);
for (const s of stances) if (!Number.isInteger(Number(s.element)) || !STANCES.has(s.stance) || !s.source) throw new Error(`bad stance record: ${JSON.stringify(s)}`);

// ----------------------------------------------------------------------------- crowd
const boot = await fetchJson("bootstrap-static/");
const el = Object.fromEntries(boot.elements.map((e) => [e.id, e]));
const teamShort = Object.fromEntries(boot.teams.map((t) => [t.id, t.short_name]));
const POS = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };
for (const r of [...projections, ...stances]) if (!el[r.element]) throw new Error(`element ${r.element} (${r.source}) not in bootstrap`);
const seasonStart = new Date(boot.events[0].deadline_time).getUTCFullYear();
const SEASON = opt("season", `${seasonStart}-${String(seasonStart + 1).slice(2)}`);

const PREV = GW - 1;
let top50 = null;
const fielded = {};
const captained = {};
if (PREV >= 1) {
  const standings = (await fetchJson(`leagues-classic/${TOP_LEAGUE}/standings/`)).standings.results.slice(0, TOP_N);
  const picks = (await pool(standings, 8, (r) => fetchJson(`entry/${r.entry}/event/${PREV}/picks/`))).filter(Boolean);
  for (const pk of picks)
    for (const x of pk.picks) {
      if (x.multiplier > 0) fielded[x.element] = (fielded[x.element] || 0) + 1;
      if (x.multiplier > 1) captained[x.element] = (captained[x.element] || 0) + 1;
    }
  top50 = { league: TOP_LEAGUE, event: PREV, n: picks.length };
}

let ours = [];
if (ENTRY && PREV >= 1) {
  try {
    ours = (await fetchJson(`entry/${ENTRY}/event/${PREV}/picks/`)).picks.map((x) => x.element);
  } catch {
    /* our squad is only a reason to include a player */
  }
}

function crowdOf(e) {
  const owners = (Number(e.selected_by_percent) / 100) * (boot.total_players || 0);
  const net = (e.transfers_in_event || 0) - (e.transfers_out_event || 0);
  return {
    own_pct: Number(e.selected_by_percent),
    net_transfers_event: net,
    net_share: owners > 0 ? r2((net / owners) * 100) / 100 : null,
    price_change_event: e.cost_change_event / 10,
    top50_fielded: top50 ? fielded[e.id] || 0 : null,
    top50_captained: top50 ? captained[e.id] || 0 : null,
  };
}

// Who goes in the doc: everyone a source talks about, our fifteen, what the top 50
// field or captain, anyone 15%+ owned, and the ten biggest movers each way.
const byNet = boot.elements.map((e) => [e.id, (e.transfers_in_event || 0) - (e.transfers_out_event || 0)]).sort((a, b) => b[1] - a[1]);
const include = new Set([
  ...projections.map((p) => Number(p.element)),
  ...stances.map((s) => Number(s.element)),
  ...ours,
  ...Object.keys(fielded).filter((id) => fielded[id] >= 5).map(Number),
  ...Object.keys(captained).map(Number),
  ...boot.elements.filter((e) => Number(e.selected_by_percent) >= 15).map((e) => e.id),
  ...byNet.slice(0, 10).map((x) => x[0]),
  ...byNet.slice(-10).map((x) => x[0]),
  ...String(opt("also", "")).split(",").filter(Boolean).map(Number),
]);

// ----------------------------------------------------------------------------- merge
const prior = readJson(OUT);
const keep = prior && prior.gw === GW ? prior.players || {} : {};
const players = {};
for (const id of [...include].sort((a, b) => a - b)) {
  const e = el[id];
  if (!e) continue;
  // one projection per source (the last one in the file wins)
  const proj = Object.values(Object.fromEntries(projections.filter((p) => Number(p.element) === id).map((p) => [p.source, { source: p.source, url: p.url || "", value: p.value }])));
  const st = stances.filter((s) => Number(s.element) === id).map((s) => ({ source: s.source, url: s.url || "", date: s.date || "", stance: s.stance, quote: s.quote || "" }));
  players[id] = {
    name: e.web_name,
    team: teamShort[e.team],
    pos: POS[e.element_type],
    crowd: crowdOf(e),
    consensus: proj.length ? { projections: proj, mean: r2(proj.reduce((s, p) => s + p.value, 0) / proj.length) } : null,
    stances: st,
    decision: keep[id]?.decision ?? null,
    actual: keep[id]?.actual ?? null,
  };
}

const sources = [{ source: "FPL API", kind: "api", url: `${API}/bootstrap-static/`, n: Object.keys(players).length }];
if (top50) sources.push({ source: `FPL API top ${top50.n} of league ${TOP_LEAGUE}, GW${PREV} picks`, kind: "api", url: `${API}/leagues-classic/${TOP_LEAGUE}/standings/`, n: top50.n });
const tally = (list, kind) => {
  const m = {};
  for (const r of list) (m[r.source] ||= { source: r.source, kind, url: r.url || "", n: 0 }).n++;
  return Object.values(m);
};
sources.push(...tally(projections, "projection"), ...tally(stances, "stance"));

const IS_TEST = TEST || !!prior?.test;
const DOC_ID = opt("id", IS_TEST ? `test-gw${GW}` : `gw${GW}`);
if (IS_TEST && DOC_ID === `gw${GW}`) {
  console.error(`a test doc may not be put as gw${GW}`);
  process.exit(2);
}
const doc = { gw: GW, season: SEASON, generated_at: new Date().toISOString(), ...(IS_TEST ? { test: true } : {}), top50, players, sources };
writeJson(OUT, doc);

// ----------------------------------------------------------------------------- summary
const nStanceSrc = new Set(stances.map((s) => s.source)).size;
const k = (n) => (Math.abs(n) >= 1000 ? `${n > 0 ? "+" : ""}${Math.round(n / 1000)}k` : `${n > 0 ? "+" : ""}${n}`);
const line = (id) => {
  const p = players[id];
  const c = p.crowd;
  const sc = stanceCounts(p.stances);
  const st = Object.entries(sc).filter(([, v]) => v).map(([s, v]) => `${s} ${v}`).join(", ");
  return [
    `${p.name} (${p.team} ${p.pos})`.padEnd(26),
    `own ${c.own_pct.toFixed(1)}%`.padEnd(11),
    `net ${k(c.net_transfers_event)}${c.net_share != null ? ` (${(c.net_share * 100).toFixed(1)}%)` : ""}`.padEnd(20),
    `£${c.price_change_event >= 0 ? "+" : ""}${c.price_change_event.toFixed(1)}`.padEnd(7),
    top50 ? `top50 ${c.top50_fielded}F ${c.top50_captained}C`.padEnd(15) : "",
    p.consensus ? `cons ${p.consensus.mean.toFixed(2)} (${p.consensus.projections.length})`.padEnd(14) : "cons -".padEnd(14),
    st ? `stances ${st} of ${nStanceSrc}` : "",
  ].join(" ");
};
const ids = Object.keys(players);
const talked = ids.filter((id) => players[id].consensus || players[id].stances.length).sort((a, b) => (players[b].consensus?.mean ?? -1) - (players[a].consensus?.mean ?? -1));
const squad = ours.map(String).filter((id) => players[id] && !talked.includes(id));
const rest = ids.filter((id) => !talked.includes(id) && !squad.includes(id)).sort((a, b) => (players[b].crowd.top50_fielded ?? 0) - (players[a].crowd.top50_fielded ?? 0) || players[b].crowd.own_pct - players[a].crowd.own_pct);
console.log(`GW${GW} community: ${ids.length} players, ${projections.length} projections from ${new Set(projections.map((p) => p.source)).size} sources, ${stances.length} stances from ${nStanceSrc} sources${top50 ? `, top ${top50.n} picks of GW${PREV}` : ""}`);
if (talked.length) console.log(`\nWith a projection or a stance:\n${talked.map(line).join("\n")}`);
if (squad.length) console.log(`\nOur fifteen, no projection:\n${squad.map(line).join("\n")}`);
if (rest.length) console.log(`\nThe crowd (top 50 fielded, owned, movers), first 12 of ${rest.length}:\n${rest.slice(0, 12).map(line).join("\n")}`);
console.log(`\nwrote ${OUT}`);
if (PUT) console.log(`put ${putDoc(DOC_ID, OUT)}  (${PROJECT}/${COLLECTION}/${DOC_ID})`);
