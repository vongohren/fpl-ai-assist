#!/usr/bin/env npx tsx
/**
 * FPL Setup
 *
 * Opens a browser window for you to log in to FPL, then captures:
 * - X-Api-Authorization token
 * - Your manager ID
 * - Brave Search API key (optional, prompted in CLI)
 *
 * Saves all to ~/.fpl/secrets.env
 *
 * Usage:
 *   npx tsx scripts/setup.ts
 *   # or
 *   npm run setup
 */

import { chromium } from "playwright";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { createInterface } from "readline";

function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const FPL_URL = "https://fantasy.premierleague.com/my-team";
const FPL_SECRETS_DIR = join(homedir(), ".fpl");
const FPL_SECRETS_FILE = join(FPL_SECRETS_DIR, "secrets.env");

interface ExistingSecrets {
  token: string | null;
  managerId: string | null;
  braveApiKey: string | null;
}

function loadExistingSecrets(): ExistingSecrets {
  const result: ExistingSecrets = { token: null, managerId: null, braveApiKey: null };

  if (!existsSync(FPL_SECRETS_FILE)) {
    return result;
  }

  try {
    const content = readFileSync(FPL_SECRETS_FILE, "utf-8");
    const tokenMatch = content.match(/export FPL_X_API_AUTH="([^"]+)"/);
    const managerIdMatch = content.match(/export FPL_MANAGER_ID="([^"]+)"/);
    const braveKeyMatch = content.match(/export BRAVE_SEARCH_API_KEY="([^"]+)"/);

    result.token = tokenMatch?.[1] ?? null;
    result.managerId = managerIdMatch?.[1] ?? null;
    result.braveApiKey = braveKeyMatch?.[1] ?? null;
  } catch {
    // Ignore read errors
  }

  return result;
}

function getTokenExpiry(token: string): Date | null {
  try {
    // JWT tokens have format: header.payload.signature
    // The token might have "Bearer " prefix
    const tokenPart = token.startsWith("Bearer ") ? token.slice(7) : token;
    const payload = JSON.parse(Buffer.from(tokenPart.split(".")[1], "base64").toString());
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

function isTokenValid(token: string): boolean {
  const expiry = getTokenExpiry(token);
  if (!expiry) return false;
  // Consider token valid if it expires more than 5 minutes from now
  return expiry.getTime() > Date.now() + 5 * 60 * 1000;
}

async function main() {
  console.log("🔐 FPL Setup");
  console.log("============\n");

  // Load existing secrets
  const existing = loadExistingSecrets();

  // Check if FPL token is still valid
  let capturedToken: string | null = null;
  let managerId: number | null = existing.managerId ? parseInt(existing.managerId, 10) : null;
  let needsNewToken = true;

  if (existing.token) {
    const expiry = getTokenExpiry(existing.token);
    if (expiry) {
      if (isTokenValid(existing.token)) {
        console.log("✅ Existing FPL token is still valid!");
        console.log(`   Expires: ${expiry.toLocaleString()}`);
        const timeRemaining = expiry.getTime() - Date.now();
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        console.log(`   Time remaining: ${hoursRemaining}h ${minutesRemaining}m\n`);
        capturedToken = existing.token;
        needsNewToken = false;
      } else {
        console.log("⚠️  Existing FPL token has expired.");
        console.log(`   Expired: ${expiry.toLocaleString()}\n`);
      }
    }
  }

  if (needsNewToken) {
    console.log("A browser window will open. Please log in to FPL.");
    console.log("Your token and manager ID will be captured automatically after login.\n");

    const browser = await chromium.launch({
      headless: false, // Show the browser so user can log in
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for network requests to capture the auth header
    page.on("request", (request) => {
      const headers = request.headers();
      const authHeader = headers["x-api-authorization"];

      if (authHeader && authHeader.startsWith("Bearer ") && !capturedToken) {
        capturedToken = authHeader;
        console.log("\n✅ Token captured!");
      }
    });

    // Also check response headers in case it's set there
    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("fantasy.premierleague.com") && !capturedToken) {
        const request = response.request();
        const authHeader = request.headers()["x-api-authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
          capturedToken = authHeader;
          console.log("\n✅ Token captured from response!");
        }
      }
    });

    try {
      await page.goto(FPL_URL);

      // Wait for either login to complete or timeout
      console.log("⏳ Waiting for you to log in...\n");

      // Poll until we have the token or user closes browser
      const maxWaitMs = 5 * 60 * 1000; // 5 minutes
      const startTime = Date.now();

      while (!capturedToken && Date.now() - startTime < maxWaitMs) {
        await page.waitForTimeout(1000);

        // Check if we're on the my-team page (logged in)
        const url = page.url();
        if (url.includes("/my-team") && !url.includes("login")) {
          // Trigger a request to capture the token
          try {
            await page.reload({ waitUntil: "networkidle" });
          } catch {
            // Page might have been closed
            break;
          }
        }
      }

      if (!capturedToken) {
        console.log("❌ No token captured. Make sure you logged in successfully.");
        await browser.close();
        process.exit(1);
      }

      await browser.close();

      // Fetch manager ID using the captured token
      console.log("\n📡 Fetching manager ID...");
      try {
        const meResponse = await fetch("https://fantasy.premierleague.com/api/me/", {
          headers: {
            "X-Api-Authorization": capturedToken,
          },
        });

        if (meResponse.ok) {
          const meData = await meResponse.json() as { player?: { entry?: number } };
          managerId = meData.player?.entry ?? null;
          if (managerId) {
            console.log(`✅ Manager ID: ${managerId}`);
          } else {
            console.log("⚠️  Could not find manager ID in response");
          }
        } else {
          console.log(`⚠️  Failed to fetch manager info: ${meResponse.status}`);
        }
      } catch (err) {
        console.log("⚠️  Error fetching manager ID:", err);
      }
    } catch (error) {
      console.error("Error:", error);
      await browser.close();
      process.exit(1);
    }
  } else if (managerId) {
    console.log(`📋 Manager ID: ${managerId}`);
  }

  // Check for existing Brave Search API key
  let braveApiKey: string | null = existing.braveApiKey;
  if (braveApiKey) {
    console.log("\n✅ Brave Search API key already configured.");
    console.log(`   Key preview: ${braveApiKey.substring(0, 8)}...`);
  } else {
    // Prompt for Brave Search API key (optional)
    console.log("\n🔍 Brave Search API Key (optional, for community trends)");
    console.log("Get one at: https://brave.com/search/api/");
    braveApiKey = await prompt("Enter Brave API key (or press Enter to skip): ") || null;
  }

  // Save to secrets file (always save to ensure consistency)
  if (capturedToken) {
    console.log("\n📝 Saving to ~/.fpl/secrets.env...");
    saveSecrets(capturedToken, managerId, braveApiKey);

    console.log("\n✨ Done! Run 'source ~/.fpl/secrets.env' or restart your terminal.");

    if (needsNewToken) {
      console.log("\nToken preview: " + capturedToken.substring(0, 50) + "...");
      const expiry = getTokenExpiry(capturedToken);
      if (expiry) {
        console.log(`Token expires: ${expiry.toLocaleString()}`);
      }
    }
  } else {
    console.log("\n✨ Done! No changes needed.");
  }
}

function saveSecrets(token: string, managerId: number | null, braveApiKey: string | null) {
  // Create ~/.fpl directory if it doesn't exist
  if (!existsSync(FPL_SECRETS_DIR)) {
    mkdirSync(FPL_SECRETS_DIR, { recursive: true });
    console.log(`Created ${FPL_SECRETS_DIR}/`);
  }

  // Build secrets content
  let content = `# FPL Secrets (auto-generated by npm run setup)
# Re-run 'npm run setup' when token expires
export FPL_X_API_AUTH="${token}"
`;

  if (managerId) {
    content += `export FPL_MANAGER_ID="${managerId}"
`;
  }

  if (braveApiKey) {
    content += `export BRAVE_SEARCH_API_KEY="${braveApiKey}"
`;
  }

  writeFileSync(FPL_SECRETS_FILE, content, { mode: 0o600 }); // Read/write only for owner
  console.log(`Saved secrets to ${FPL_SECRETS_FILE}`);
}

main();
