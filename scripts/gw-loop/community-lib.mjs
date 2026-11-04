// =============================================================================
// community-lib — what community.mjs, calibrate.mjs and the two pages share:
// where the community docs live (a local mirror + the huddle collection), how
// they are read and written, the weight, and the blend.
//
//   local:  $FPL_LOOP_STATE/community/gw<N>.json, .../weight.json
//   huddle: collection `community` in project $FPL_HUDDLE_PROJECT (season-26-27),
//           doc ids gw<N> and weight, schema community.schema.json
//
// blended = (1 - w) x calc + w x consensus; calc alone where there is no consensus.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const STATE_DIR = process.env.FPL_LOOP_STATE || "/workspace/.spawn/fpl-gw-loop";
export const COMMUNITY_DIR = path.join(STATE_DIR, "community");
export const PROJECT = process.env.FPL_HUDDLE_PROJECT || "season-26-27";
export const COLLECTION = "community";
export const WEIGHT_PATH = path.join(COMMUNITY_DIR, "weight.json");
export const DEFAULT_W = 0.3; // the starting weight until six gameweeks of actuals (decision dc-100)
export const MIN_GWS = 6;

export const gwPath = (gw) => path.join(COMMUNITY_DIR, `gw${gw}.json`);

export function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function writeJson(file, doc) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(doc, null, 1) + "\n");
  fs.renameSync(tmp, file);
}

// Put a doc on huddle. Returns the URL arcforge prints, throws on failure.
export function putDoc(id, file) {
  const r = spawnSync("arcforge", ["project", "collection", "put", COLLECTION, id, file, "--project", PROJECT], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`arcforge collection put ${COLLECTION} ${id}: ${(r.stderr || r.stdout || r.error?.message || "").trim()}`);
  const lines = (r.stdout || "").trim().split("\n");
  return lines[lines.length - 1];
}

// Get a doc from huddle, or null (no doc, no arcforge, no network).
export function getDoc(id) {
  const r = spawnSync("arcforge", ["project", "collection", "get", COLLECTION, id, "--project", PROJECT], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const out = (r.stdout || "").trim();
  try {
    const j = JSON.parse(out);
    return j && typeof j === "object" && j.doc && !j.gw && !("w" in j) ? j.doc : j;
  } catch {
    // arcforge may print the URL as the last line after the JSON
    try {
      return JSON.parse(out.slice(0, out.lastIndexOf("}") + 1));
    } catch {
      return null;
    }
  }
}

// The weight the pages use: weight.json, else the huddle weight doc, else 0.
// A doc marked test is never the weight.
export function readWeight() {
  const local = readJson(WEIGHT_PATH);
  if (local && typeof local.w === "number" && !local.test) return { ...local, from: WEIGHT_PATH };
  const remote = getDoc("weight");
  if (remote && typeof remote.w === "number" && !remote.test) return { ...remote, from: `huddle ${PROJECT}/${COLLECTION}/weight` };
  return { w: 0, method: "none", from: null };
}

export const blend = (calc, consensus, w) => (consensus == null ? calc : (1 - w) * calc + w * consensus);
export const r2 = (n) => (n == null ? null : Math.round(n * 100) / 100);

// Stance counts per player, against the number of distinct stance sources this week.
export function stanceCounts(stances) {
  const c = { buy: 0, sell: 0, hold: 0, captain: 0, avoid: 0 };
  const seen = new Set();
  for (const s of stances || []) {
    const k = `${s.source}|${s.stance}`;
    if (seen.has(k)) continue; // one vote per source per stance
    seen.add(k);
    if (s.stance in c) c[s.stance]++;
  }
  return c;
}
export const stanceSources = (doc) => new Set(Object.values(doc?.players || {}).flatMap((p) => (p.stances || []).map((s) => s.source))).size;
