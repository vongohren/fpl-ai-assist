// =============================================================================
// brand — the house brand (Rettelse) for the gw-loop pages, read from the brand
// skill's own starter.html at build time rather than copied in here, so a brand
// change lands on the next page without a PR to this repo.
//
//   brandHead()        <link>s + the page-shell <style> (tokens and components)
//   brandSprite(ids)   the <svg> sprite holding only the symbols a page uses
//
// Source: $BRAND_DIR or ~/.claude/skills/brand/assets (synced from vongohren/brand).
// Fails loudly when the skill is missing: an unbranded page is a bug, not a fallback.
// =============================================================================
import fs from "node:fs";
import path from "node:path";

const DIR =
  process.env.BRAND_DIR ||
  path.join(process.env.CLAUDE_CONFIG_DIR || path.join(process.env.HOME || "/home/node", ".claude"), "skills", "brand", "assets");

let starter;
function read() {
  if (starter) return starter;
  const file = path.join(DIR, "starter.html");
  try {
    starter = fs.readFileSync(file, "utf8");
  } catch {
    throw new Error(`brand: ${file} not found (set BRAND_DIR, or install the brand skill)`);
  }
  return starter;
}

// The page-shell block's head, minus <title> (the page sets its own) and minus
// rough.js (only needed for a pen mark; a page that draws one adds it back).
export function brandHead() {
  const s = read();
  const shell = s.slice(s.indexOf("<!-- block: page-shell -->"), s.indexOf("</head>"));
  const from = shell.indexOf('<link rel="icon"');
  if (from < 0 || !shell.includes("</style>")) throw new Error("brand: page-shell block not where expected in starter.html");
  return shell
    .slice(from)
    .replace(/<!-- the pen[^>]*-->\s*/, "")
    .replace(/<script src="[^"]*rough[^"]*"><\/script>\s*/, "")
    .trim();
}

export function brandSprite(ids) {
  const s = read();
  const lines = ids.map((id) => {
    const m = s.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?</symbol>`));
    if (!m) throw new Error(`brand: symbol ${id} not in the sprite`);
    return m[0];
  });
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>\n${lines.join("\n")}\n</defs></svg>`;
}

export const BRAND_VERSION = (() => {
  try {
    return fs.readFileSync(path.join(DIR, "VERSION"), "utf8").trim();
  } catch {
    return "unknown";
  }
})();
