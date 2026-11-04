#!/usr/bin/env node
// =============================================================================
// calibrate — after a gameweek finalises: score the calc and the consensus
// against what happened, and set the weight the next proposal blends with.
//
// Deterministic (no LLM).
//   1. fills `actual` (FPL total points this gameweek, from event/<N>/live) for
//      every player in community/gw<N>.json
//   2. over the last six gameweeks that have player-weeks with a calc, a
//      consensus and an actual (the decision block proposal-page.mjs wrote),
//      err_calc and err_consensus = mean absolute error on those same player-weeks
//   3. writes the weight doc: w fixed (the starting value) until six gameweeks have
//      data, then inverse-variance, w = err_calc² / (err_calc² + err_consensus²)
//
//   calibrate.mjs --gw <N> [--put] [--force] [--w 0.3] [--community f] [--dir d]
//                 [--weight-out f] [--doc-id gw<N>] [--weight-id weight]
//   calibrate.mjs --init [--w 0.3] [--put] [--weight-out f] [--weight-id weight]
//
// --force skips the "finished and data_checked" check (testing only). --w sets the
// fixed weight; without it the existing weight doc's fixed w is kept, else 0.3.
// --init writes the starting weight doc (fixed, no data) and nothing else.
// --put puts gw<N> and weight on huddle (collection community, season-26-27).
// A test doc (`test: true`) never touches the real ones: its weight goes to
// <dir>/test-weight.json and huddle ids test-gw<N> / test-weight unless named,
// and naming the real weight.json, `weight` or `gw<N>` for it is refused.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { readJson, writeJson, putDoc, getDoc, gwPath, r2, COMMUNITY_DIR, WEIGHT_PATH, DEFAULT_W, MIN_GWS, PROJECT, COLLECTION } from "./community-lib.mjs";

const API = "https://fantasy.premierleague.com/api";
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dflt;
};
const INIT = args.includes("--init");
const GW = Number(opt("gw"));
if (!GW && !INIT) {
  console.error("usage: calibrate.mjs --gw <N> [--put] [--force] [--w 0.3] [--community f] [--dir d] [--weight-out f]  |  calibrate.mjs --init [--w 0.3] [--put]");
  process.exit(2);
}
const PUT = args.includes("--put");
const FORCE = args.includes("--force");
const DIR = opt("dir", COMMUNITY_DIR);
const DOC_PATH = opt("community", GW ? path.join(DIR, `gw${GW}.json`) : null);
let WEIGHT_OUT = opt("weight-out", DIR === COMMUNITY_DIR ? WEIGHT_PATH : path.join(DIR, "weight.json"));
let DOC_ID = opt("doc-id", `gw${GW}`);
let WEIGHT_ID = opt("weight-id", "weight");

// The fixed w: --w, else the target weight doc's own fixed w, else 0.3.
const wArg = opt("w");
function fixedW() {
  const prior = readJson(WEIGHT_OUT) || (WEIGHT_OUT === WEIGHT_PATH ? getDoc(WEIGHT_ID) : null);
  const w = wArg != null ? Number(wArg) : prior?.method === "fixed" && typeof prior.w === "number" ? prior.w : DEFAULT_W;
  if (!(w >= 0 && w <= 1)) throw new Error(`--w ${wArg} is not between 0 and 1`);
  return w;
}

function putWeight(doc) {
  writeJson(WEIGHT_OUT, doc);
  console.log(`wrote ${WEIGHT_OUT}`);
  if (PUT) console.log(`put ${putDoc(WEIGHT_ID, WEIGHT_OUT)}  (${PROJECT}/${COLLECTION}/${WEIGHT_ID})`);
}

if (INIT) {
  const W_FIXED = fixedW();
  putWeight({ w: W_FIXED, method: "fixed", n_player_weeks: 0, err_calc: null, err_consensus: null, gws: [], updated_at: new Date().toISOString(), min_gws: MIN_GWS });
  console.log(`weight: w ${W_FIXED}, fixed until ${MIN_GWS} gameweeks of actuals`);
  process.exit(0);
}

async function fetchJson(endpoint) {
  const url = `${API}/${endpoint}${endpoint.includes("?") ? "&" : "?"}_cb=${Date.now()}${process.pid}`;
  const headers = { "Cache-Control": "no-cache", "User-Agent": "FPL-MCP-Server/1.0 (+https://fantasy.premierleague.com)", Origin: "https://fantasy.premierleague.com", Referer: "https://fantasy.premierleague.com/" };
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

// ----------------------------------------------------------------------------- 1. actuals
let doc = readJson(DOC_PATH);
if (!doc && DOC_PATH === gwPath(GW)) doc = getDoc(DOC_ID); // the local mirror is gone: take huddle's
if (!doc || doc.gw !== GW) {
  console.error(`no community doc for GW${GW} at ${DOC_PATH}${DOC_PATH === gwPath(GW) ? ` or on huddle (${DOC_ID})` : ""}; nothing to calibrate`);
  process.exit(1);
}
if (doc.test) {
  WEIGHT_OUT = opt("weight-out", path.join(DIR, "test-weight.json"));
  WEIGHT_ID = opt("weight-id", "test-weight");
  DOC_ID = opt("doc-id", `test-gw${GW}`);
  if (WEIGHT_OUT === WEIGHT_PATH || WEIGHT_ID === "weight" || DOC_ID === `gw${GW}`) {
    console.error(`${DOC_PATH} is a test doc: it may not write ${WEIGHT_PATH}, huddle weight or gw${GW}`);
    process.exit(2);
  }
}
const W_FIXED = fixedW();
const boot = await fetchJson("bootstrap-static/");
const ev = boot.events.find((e) => e.id === GW);
if (!ev) throw new Error(`no event ${GW} in bootstrap`);
if (!(ev.finished && ev.data_checked) && !FORCE) {
  console.error(`GW${GW} is not final yet (finished ${ev.finished}, data_checked ${ev.data_checked}); run after it is, or --force to test`);
  process.exit(1);
}
const live = await fetchJson(`event/${GW}/live/`);
const pts = Object.fromEntries(live.elements.map((e) => [e.id, e.stats.total_points]));
let filled = 0;
for (const [id, p] of Object.entries(doc.players)) {
  p.actual = pts[id] ?? 0;
  filled++;
}
writeJson(DOC_PATH, doc);
console.log(`GW${GW}: actual points for ${filled} players, wrote ${DOC_PATH}`);
if (PUT) console.log(`put ${putDoc(DOC_ID, DOC_PATH)}  (${PROJECT}/${COLLECTION}/${DOC_ID})`);

// ----------------------------------------------------------------------------- 2. errors
// Every gameweek doc up to this one, the test flag matching this one's (a test
// never feeds the real weight, and the other way round).
const docs = { [GW]: doc };
for (const f of fs.existsSync(DIR) ? fs.readdirSync(DIR) : []) {
  const m = f.match(/^gw(\d+)\.json$/);
  if (!m || Number(m[1]) >= GW) continue;
  const d = readJson(path.join(DIR, f));
  if (d && d.gw === Number(m[1]) && !!d.test === !!doc.test) docs[d.gw] = d;
}
const pairs = (d) =>
  Object.values(d.players || {})
    .filter((p) => p.decision && typeof p.decision.calc === "number" && typeof p.decision.consensus === "number" && typeof p.actual === "number")
    .map((p) => ({ calc: p.decision.calc, cons: p.decision.consensus, actual: p.actual }));
const window = Object.keys(docs)
  .map(Number)
  .sort((a, b) => b - a)
  .filter((g) => pairs(docs[g]).length)
  .slice(0, MIN_GWS)
  .sort((a, b) => a - b);
const all = window.flatMap((g) => pairs(docs[g]));
const mae = (k) => (all.length ? all.reduce((s, x) => s + Math.abs(x[k] - x.actual), 0) / all.length : null);
const errCalc = mae("calc");
const errCons = mae("cons");
for (const g of window) {
  const ps = pairs(docs[g]);
  const e = (k) => ps.reduce((s, x) => s + Math.abs(x[k] - x.actual), 0) / ps.length;
  console.log(`  GW${g}: ${ps.length} player-weeks, calc missed by ${e("calc").toFixed(2)}, consensus by ${e("cons").toFixed(2)}`);
}

// ----------------------------------------------------------------------------- 3. weight
const measured = window.length >= MIN_GWS && errCalc != null && errCalc + errCons > 0;
const w = measured ? errCalc ** 2 / (errCalc ** 2 + errCons ** 2) : W_FIXED;
const weight = {
  w: r2(w),
  method: measured ? "inverse-variance" : "fixed",
  n_player_weeks: all.length,
  err_calc: r2(errCalc),
  err_consensus: r2(errCons),
  gws: window,
  updated_at: new Date().toISOString(),
  min_gws: MIN_GWS,
  ...(doc.test ? { test: true } : {}),
};
putWeight(weight);
console.log(
  `weight: w ${weight.w} (${weight.method}${measured ? "" : `, ${window.length} of ${MIN_GWS} gameweeks with data`}), ` +
    (all.length ? `${all.length} player-weeks over GW${window.join(", ")}: calc missed by ${weight.err_calc}, consensus by ${weight.err_consensus}` : "no player-weeks with calc, consensus and actual yet"),
);
