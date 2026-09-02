import { readFileSync, statSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { log } from "../logger.js";

// The server reads ~/.fpl/secrets.env itself rather than trusting the environment
// it was spawned with. Two reasons:
//
//   1. .mcp.json passes credentials by interpolation ("${FPL_X_API_AUTH}"), which
//      expands from the environment of the Claude Code process. Launch it from a
//      shell that never sourced setup.sh and every value arrives as an empty
//      string, so the server starts unauthenticated and silently falls back to
//      public data.
//   2. The keepalive job rotates the access token on disk on its own schedule. A
//      value captured once at process start goes stale mid-session even when the
//      grant upstream is perfectly healthy.
//
// So: resolve per request, off the file, with the environment as an override.

const SECRETS_FILE = process.env.FPL_SECRETS_FILE || join(homedir(), ".fpl", "secrets.env");

// Keys this server cares about. Anything else in the file is ignored.
export type SecretName =
  | "FPL_X_API_AUTH"
  | "FPL_COOKIE"
  | "FPL_MANAGER_ID"
  | "BRAVE_SEARCH_API_KEY";

interface FileCache {
  /** mtimeMs + size of the file the values were parsed from. */
  stamp: string;
  values: Map<string, string>;
}

let cached: FileCache | null = null;

/**
 * An empty or whitespace-only value counts as unset.
 *
 * This matters for more than tidiness: unresolved "${FPL_X_API_AUTH}"
 * interpolation in .mcp.json lands in the environment as an empty string, and
 * treating that as "set" is what let a blank env var shadow a perfectly good
 * token on disk.
 */
function clean(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Parse `export KEY="value"` / `KEY=value` lines, matching what mobile-auth.ts
 * writes. Comments and blank lines are skipped; the last occurrence of a key wins.
 */
function parse(content: string): Map<string, string> {
  const values = new Map<string, string>();

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) continue;

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    let value = rawValue.trim();

    // Strip one layer of matching quotes.
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }

    values.set(key, value);
  }

  return values;
}

/**
 * Values from the secrets file, re-read whenever the file changes on disk.
 *
 * Stat-per-call is deliberate: it is what makes token rotation visible to a
 * long-running server without a restart. A stat is cheap next to the HTTP
 * request that follows it.
 */
function fileValues(): Map<string, string> {
  let stamp: string;
  try {
    const stats = statSync(SECRETS_FILE);
    stamp = `${stats.mtimeMs}:${stats.size}`;
  } catch {
    // Missing or unreadable: fall back to the environment alone.
    if (cached !== null) {
      log("INFO", `Secrets file no longer readable, using environment only: ${SECRETS_FILE}`);
      cached = null;
    }
    return new Map();
  }

  if (cached !== null && cached.stamp === stamp) {
    return cached.values;
  }

  try {
    const values = parse(readFileSync(SECRETS_FILE, "utf-8"));
    log("INFO", cached === null ? "Loaded secrets file" : "Secrets file changed, reloaded", {
      path: SECRETS_FILE,
      keys: [...values.keys()],
    });
    cached = { stamp, values };
    return values;
  } catch (error) {
    log("ERROR", `Could not read secrets file ${SECRETS_FILE}: ${error instanceof Error ? error.message : String(error)}`);
    cached = null;
    return new Map();
  }
}

/**
 * Resolve a secret: environment first (so an explicit export still overrides),
 * then the secrets file.
 */
export function readSecret(name: SecretName): string | undefined {
  return clean(process.env[name]) ?? clean(fileValues().get(name));
}

export function getAuthConfig(): { cookie?: string; xApiAuth?: string } {
  return {
    cookie: readSecret("FPL_COOKIE"),
    xApiAuth: readSecret("FPL_X_API_AUTH"),
  };
}

export function getManagerId(): number | undefined {
  const raw = readSecret("FPL_MANAGER_ID");
  if (!raw) return undefined;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? undefined : parsed;
}

/** Where secrets are being read from, for diagnostics. */
export function secretsPath(): string {
  return SECRETS_FILE;
}
