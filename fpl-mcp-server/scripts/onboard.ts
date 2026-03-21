#!/usr/bin/env npx tsx
/**
 * FPL Onboarding - Smart setup that checks what you have and only does what's needed.
 *
 * Checks:
 * 1. Node.js version
 * 2. npm dependencies installed
 * 3. Playwright + Chromium browser
 * 4. FPL credentials (email/password for headless refresh)
 * 5. FPL auth token (valid/expired/missing)
 * 6. Manager ID
 * 7. Brave Search API key (optional)
 * 8. TypeScript build
 *
 * Usage:
 *   npm run onboard           # interactive smart setup
 *   npm run onboard -- --check  # just check status, don't fix anything
 */

import { execSync, spawnSync } from "child_process";
import { existsSync, readFileSync, statSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { createInterface } from "readline";

const FPL_DIR = join(homedir(), ".fpl");
const CREDENTIALS_FILE = join(FPL_DIR, "credentials.env");
const SECRETS_FILE = join(FPL_DIR, "secrets.env");
const PROJECT_ROOT = join(import.meta.dirname, "..");

const checkOnly = process.argv.includes("--check");

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface CheckResult {
  name: string;
  status: "ok" | "warn" | "missing" | "action";
  message: string;
  fix?: () => Promise<void> | void;
}

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function run(cmd: string, opts?: { cwd?: string; silent?: boolean }): string | null {
  try {
    return execSync(cmd, {
      cwd: opts?.cwd ?? PROJECT_ROOT,
      encoding: "utf-8",
      stdio: opts?.silent ? "pipe" : ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

function getTokenExpiry(token: string): Date | null {
  try {
    const part = token.startsWith("Bearer ") ? token.slice(7) : token;
    const payload = JSON.parse(Buffer.from(part.split(".")[1], "base64").toString());
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch {
    return null;
  }
}

function formatDuration(ms: number): string {
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function loadSecret(pattern: RegExp): string | null {
  if (!existsSync(SECRETS_FILE)) return null;
  try {
    const content = readFileSync(SECRETS_FILE, "utf-8");
    const match = content.match(pattern);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

// ─── Checks ───────────────────────────────────────────────────────────────────

function checkNode(): CheckResult {
  const version = process.version;
  const major = parseInt(version.slice(1));
  if (major >= 18) {
    return { name: "Node.js", status: "ok", message: `${version}` };
  }
  return {
    name: "Node.js",
    status: "missing",
    message: `${version} (need >= 18)`,
    fix: () => {
      console.log("   Install Node.js 18+ from https://nodejs.org/");
      process.exit(1);
    },
  };
}

function checkDependencies(): CheckResult {
  const nodeModules = join(PROJECT_ROOT, "node_modules");
  if (existsSync(nodeModules)) {
    return { name: "Dependencies", status: "ok", message: "node_modules present" };
  }
  return {
    name: "Dependencies",
    status: "action",
    message: "node_modules missing",
    fix: () => {
      console.log("   Installing npm dependencies...");
      run("npm install", { cwd: PROJECT_ROOT });
    },
  };
}

function checkPlaywright(): CheckResult {
  // Check if playwright is importable
  const pwCheck = run("npx playwright --version", { silent: true });
  if (!pwCheck) {
    return {
      name: "Playwright",
      status: "action",
      message: "not installed",
      fix: () => {
        console.log("   Playwright will be installed with npm dependencies.");
      },
    };
  }

  // Check if chromium browser is installed
  const browserCheck = run("npx playwright install --dry-run chromium 2>&1", { silent: true });
  // If chromium is already installed, the browsers directory will exist
  const homeDir = homedir();
  const browserPaths = [
    join(homeDir, "Library", "Caches", "ms-playwright"), // macOS
    join(homeDir, ".cache", "ms-playwright"), // Linux
    join(homeDir, "AppData", "Local", "ms-playwright"), // Windows
  ];
  const hasBrowser = browserPaths.some((p) => {
    if (!existsSync(p)) return false;
    try {
      const entries = execSync(`ls "${p}"`, { encoding: "utf-8" }).trim();
      return entries.includes("chromium");
    } catch {
      return false;
    }
  });

  if (hasBrowser) {
    return { name: "Playwright Chromium", status: "ok", message: "browser installed" };
  }

  return {
    name: "Playwright Chromium",
    status: "action",
    message: "browser not installed",
    fix: () => {
      console.log("   Installing Chromium for Playwright...");
      run("npx playwright install chromium");
    },
  };
}

function checkCredentials(): CheckResult {
  if (!existsSync(CREDENTIALS_FILE)) {
    return {
      name: "FPL Credentials",
      status: "missing",
      message: "~/.fpl/credentials.env not found",
      fix: async () => {
        console.log("   These are needed for headless token refresh on servers.");
        const email = await prompt("   FPL email: ");
        const password = await prompt("   FPL password: ");
        if (!email || !password) {
          console.log("   ⏭ Skipped. You can set them later with: npm run save-credentials");
          return;
        }
        const { writeFileSync, mkdirSync, chmodSync } = await import("fs");
        if (!existsSync(FPL_DIR)) mkdirSync(FPL_DIR, { recursive: true });
        writeFileSync(CREDENTIALS_FILE, `FPL_EMAIL=${email}\nFPL_PASSWORD=${password}\n`, { mode: 0o600 });
        chmodSync(CREDENTIALS_FILE, 0o600);
        console.log("   ✅ Saved to ~/.fpl/credentials.env");
      },
    };
  }

  // Check file has content
  const content = readFileSync(CREDENTIALS_FILE, "utf-8");
  const hasEmail = /^FPL_EMAIL=.+$/m.test(content);
  const hasPassword = /^FPL_PASSWORD=.+$/m.test(content);

  if (hasEmail && hasPassword) {
    // Check permissions
    const stats = statSync(CREDENTIALS_FILE);
    const mode = (stats.mode & 0o777).toString(8);
    if (mode !== "600") {
      return {
        name: "FPL Credentials",
        status: "warn",
        message: `present but permissions are ${mode} (should be 600)`,
        fix: () => {
          const { chmodSync } = require("fs");
          chmodSync(CREDENTIALS_FILE, 0o600);
          console.log("   Fixed permissions to 600");
        },
      };
    }
    return { name: "FPL Credentials", status: "ok", message: "email + password stored (chmod 600)" };
  }

  return {
    name: "FPL Credentials",
    status: "warn",
    message: "file exists but incomplete",
    fix: async () => {
      console.log("   Re-run: npm run save-credentials");
    },
  };
}

function checkToken(): CheckResult {
  const token = loadSecret(/export FPL_X_API_AUTH="([^"]+)"/);

  if (!token) {
    return {
      name: "FPL Auth Token",
      status: "missing",
      message: "no token in ~/.fpl/secrets.env",
      fix: async () => {
        const hasCreds = existsSync(CREDENTIALS_FILE);
        if (hasCreds) {
          console.log("   Refreshing token headlessly...");
          const result = spawnSync("npx", ["tsx", "scripts/refresh-token.ts"], {
            cwd: PROJECT_ROOT,
            stdio: "inherit",
            timeout: 120000,
          });
          if (result.status !== 0) {
            console.log("   ⚠️ Headless refresh failed. Try: npm run setup (opens browser)");
          }
        } else {
          console.log("   Run: source setup.sh (opens browser for login)");
          console.log("   Or save credentials first, then: npm run refresh-token");
        }
      },
    };
  }

  const expiry = getTokenExpiry(token);
  if (!expiry) {
    return { name: "FPL Auth Token", status: "warn", message: "present but can't parse expiry" };
  }

  const remaining = expiry.getTime() - Date.now();
  if (remaining > 5 * 60 * 1000) {
    return { name: "FPL Auth Token", status: "ok", message: `valid (expires in ${formatDuration(remaining)})` };
  }

  return {
    name: "FPL Auth Token",
    status: "warn",
    message: `expired ${formatDuration(-remaining)} ago`,
    fix: async () => {
      if (existsSync(CREDENTIALS_FILE)) {
        console.log("   Refreshing token headlessly...");
        const result = spawnSync("npx", ["tsx", "scripts/refresh-token.ts"], {
          cwd: PROJECT_ROOT,
          stdio: "inherit",
          timeout: 120000,
        });
        if (result.status !== 0) {
          console.log("   ⚠️ Headless refresh failed. Try: source setup.sh");
        }
      } else {
        console.log("   Run: source setup.sh (opens browser) or save credentials first");
      }
    },
  };
}

function checkManagerId(): CheckResult {
  const managerId = loadSecret(/export FPL_MANAGER_ID="([^"]+)"/);
  if (managerId) {
    return { name: "Manager ID", status: "ok", message: managerId };
  }
  return {
    name: "Manager ID",
    status: "warn",
    message: "not set (will be auto-detected on next token refresh)",
  };
}

function checkBraveKey(): CheckResult {
  const key = loadSecret(/export BRAVE_SEARCH_API_KEY="([^"]+)"/);
  if (key) {
    return { name: "Brave Search API", status: "ok", message: `${key.substring(0, 8)}...` };
  }
  return {
    name: "Brave Search API",
    status: "warn",
    message: "not set (optional, needed for community trends)",
    fix: async () => {
      const key = await prompt("   Brave Search API key (Enter to skip): ");
      if (!key) {
        console.log("   ⏭ Skipped. Get one at https://brave.com/search/api/");
        return;
      }
      // Append to secrets file
      const { writeFileSync, readFileSync, mkdirSync } = await import("fs");
      if (!existsSync(FPL_DIR)) mkdirSync(FPL_DIR, { recursive: true });
      let content = "";
      if (existsSync(SECRETS_FILE)) {
        content = readFileSync(SECRETS_FILE, "utf-8");
        // Remove existing brave key line
        content = content.replace(/export BRAVE_SEARCH_API_KEY="[^"]*"\n?/, "");
      }
      content += `export BRAVE_SEARCH_API_KEY="${key}"\n`;
      writeFileSync(SECRETS_FILE, content, { mode: 0o600 });
      console.log("   ✅ Saved");
    },
  };
}

function checkBuild(): CheckResult {
  const distIndex = join(PROJECT_ROOT, "dist", "index.js");
  if (!existsSync(distIndex)) {
    return {
      name: "TypeScript Build",
      status: "action",
      message: "dist/ not found",
      fix: () => {
        console.log("   Building TypeScript...");
        run("npm run build", { cwd: PROJECT_ROOT });
      },
    };
  }

  // Check if source is newer than dist
  const srcDir = join(PROJECT_ROOT, "src");
  try {
    const distTime = statSync(distIndex).mtimeMs;
    const srcFiles = execSync(`find "${srcDir}" -name "*.ts" -newer "${distIndex}" 2>/dev/null`, { encoding: "utf-8" }).trim();
    if (srcFiles) {
      return {
        name: "TypeScript Build",
        status: "action",
        message: "source newer than dist",
        fix: () => {
          console.log("   Rebuilding TypeScript...");
          run("npm run build", { cwd: PROJECT_ROOT });
        },
      };
    }
  } catch {
    // find command failed, not critical
  }

  return { name: "TypeScript Build", status: "ok", message: "up to date" };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STATUS_ICONS: Record<CheckResult["status"], string> = {
  ok: "✅",
  warn: "⚠️",
  missing: "❌",
  action: "🔧",
};

async function main() {
  console.log("🏟️  FPL AI Assist - Onboarding");
  console.log("================================\n");

  const checks: CheckResult[] = [
    checkNode(),
    checkDependencies(),
    checkPlaywright(),
    checkCredentials(),
    checkToken(),
    checkManagerId(),
    checkBraveKey(),
    checkBuild(),
  ];

  // Display status
  const nameWidth = Math.max(...checks.map((c) => c.name.length)) + 2;
  for (const check of checks) {
    const icon = STATUS_ICONS[check.status];
    const padding = " ".repeat(nameWidth - check.name.length);
    console.log(`  ${icon} ${check.name}${padding}${check.message}`);
  }

  const needsAction = checks.filter((c) => c.status === "action" || c.status === "missing");
  const warnings = checks.filter((c) => c.status === "warn");
  const allGood = needsAction.length === 0 && warnings.length === 0;

  if (allGood) {
    console.log("\n🎉 Everything is set up! You're ready to go.");
    console.log("   Start Claude Code and the FPL MCP server will be available.");
    return;
  }

  if (checkOnly) {
    console.log(`\n${needsAction.length} items need action, ${warnings.length} warnings.`);
    console.log("Run without --check to fix: npm run onboard");
    return;
  }

  // Fix actionable items
  if (needsAction.length > 0) {
    console.log(`\n🔧 Fixing ${needsAction.length} item(s)...\n`);
    for (const check of needsAction) {
      console.log(`── ${check.name} ──`);
      if (check.fix) await check.fix();
      console.log();
    }
  }

  // Offer to fix warnings
  if (warnings.length > 0) {
    const fixable = warnings.filter((w) => w.fix);
    if (fixable.length > 0) {
      console.log(`\n⚠️  ${fixable.length} optional item(s) can be configured:\n`);
      for (const check of fixable) {
        const answer = await prompt(`   Set up ${check.name}? (y/N): `);
        if (answer.toLowerCase() === "y" && check.fix) {
          await check.fix();
        }
        console.log();
      }
    }
  }

  console.log("✨ Onboarding complete!");
}

main().catch(console.error);
