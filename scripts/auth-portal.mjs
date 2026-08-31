#!/usr/bin/env node
/**
 * FPL auth portal — the paste-back step, on the tailnet instead of in a chat.
 *
 * The phone login is a four-step dance: the box prints an authorize URL, Snorre
 * logs in on his phone, lands on a blank 404 whose address bar holds ?code=...,
 * and pastes that back. Step four used to happen in a Beeper chat, which the box
 * can only read through an MCP tool — so an agent session had to stay alive for
 * the whole 30-minute PKCE window to catch the paste. On 2026-08-29 one did not,
 * the login was never completed, and the box ran on a dead grant for a day.
 *
 * This serves the same four steps as a page on the tailnet, so the recovery needs
 * no live agent and no chat: Snorre opens http://fpl-auth.beast.go on the phone he
 * is already logging in with, taps Start, pastes, done.
 *
 * Deliberately thin. It shells out to mobile-auth.ts and owns no auth logic of its
 * own — the PKCE state, the 30-minute TTL and the token exchange all stay in the
 * one implementation, because two holders of one rotating refresh-token chain is a
 * failure mode we have already paid for. It is transport, nothing else.
 *
 * Auth: Caddy injects a Tailscale-verified identity when the service is announced
 * with `--identity whois`. Identity is derived from tailscaled, tagged nodes are
 * refused, and it fails closed. This process additionally refuses any request with
 * no identity header at all, so running it unannounced on a raw port is not a way
 * around the gate.
 */

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUTH = join(REPO, "fpl-mcp-server", "scripts", "mobile-auth.ts");
const FPL_DIR = join(homedir(), ".fpl");
const SECRETS = join(FPL_DIR, "secrets.env");
const LOCK = join(FPL_DIR, "keepalive.lock");

const PORT = Number(process.env.FPL_AUTH_PORT ?? 8770);
// Comma-separated Tailscale logins. Unset means "any identified human", which is
// the resting state on a family tailnet; the page shows the caller their own login
// so it can be pinned here without guesswork.
const ALLOW = (process.env.FPL_AUTH_ALLOW ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// ------------------------------------------------------------------ identity

function identify(req) {
  const login = req.headers["tailscale-user-login"];
  const name = req.headers["tailscale-user-name"];
  if (!login) return { ok: false, reason: "no verified tailnet identity on this request" };
  if (ALLOW.length && !ALLOW.includes(String(login).toLowerCase())) {
    return { ok: false, reason: `${login} is not on this service's allowlist` };
  }
  return { ok: true, login: String(login), name: name ? String(name) : String(login) };
}

// -------------------------------------------------------------------- grant

/** Non-secret facts about the stored grant. No network, no rotation spent. */
function grantState() {
  if (!existsSync(SECRETS)) return { state: "none" };
  let blob = "";
  try {
    blob = readFileSync(SECRETS, "utf-8");
  } catch {
    return { state: "unreadable" };
  }
  const grab = (k) => blob.match(new RegExp(`export ${k}="([^"]+)"`))?.[1] ?? null;
  const claims = (tok) => {
    if (!tok) return {};
    const raw = tok.startsWith("Bearer ") ? tok.slice(7) : tok;
    const parts = raw.split(".");
    if (parts.length < 2) return {};
    try {
      return JSON.parse(Buffer.from(parts[1], "base64").toString());
    } catch {
      return {};
    }
  };
  const access = claims(grab("FPL_X_API_AUTH"));
  const refresh = claims(grab("FPL_REFRESH_TOKEN"));
  if (!refresh.jti && !access.exp) return { state: "none" };
  const now = Math.floor(Date.now() / 1000);
  const authTime = refresh.auth_time ?? access.auth_time ?? null;
  return {
    state: access.exp && access.exp > now ? "live" : "expired",
    sid: refresh.sid ?? access.sid ?? null,
    born: authTime ? new Date(authTime * 1000).toISOString() : null,
    ageSeconds: authTime ? now - authTime : null,
    accessExpires: access.exp ? new Date(access.exp * 1000).toISOString() : null,
    managerId: grab("FPL_MANAGER_ID"),
    hasRefreshToken: Boolean(grab("FPL_REFRESH_TOKEN")),
  };
}

function pendingState() {
  const file = join(FPL_DIR, "pending-auth.json");
  if (!existsSync(file)) return null;
  try {
    const p = JSON.parse(readFileSync(file, "utf-8"));
    const ageMs = Date.now() - p.createdAt;
    return { ageMs, expired: ageMs > 30 * 60 * 1000 };
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ running

/**
 * Run mobile-auth.ts under the same lock the keepalive job takes, so a login can
 * never interleave with a scheduled refresh writing the same secrets file.
 */
function runAuth(args, timeoutMs = 60_000) {
  return new Promise((resolve) => {
    const child = spawn("flock", ["-n", LOCK, "npx", "tsx", AUTH, ...args], {
      cwd: REPO,
      env: { ...process.env, NO_COLOR: "1" },
    });
    let out = "";
    const cap = (chunk) => {
      out += chunk;
      if (out.length > 20_000) out = out.slice(-20_000);
    };
    child.stdout.on("data", cap);
    child.stderr.on("data", cap);
    const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, out });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, out: `could not run the auth script: ${err.message}` });
    });
  });
}

/** The authorize URL is the one thing --start produces that we need back. */
function extractAuthorizeUrl(text) {
  return text.match(/https:\/\/account\.premierleague\.com\/as\/authorize\?\S+/)?.[0] ?? null;
}

/**
 * Only ever hand the auth script something that looks like the callback. Args go
 * through spawn as an array so there is no shell to inject into; this is about
 * failing early with a clear message rather than about escaping.
 */
function acceptablePaste(value) {
  const v = String(value ?? "").trim();
  if (!v) return { ok: false, why: "Nothing pasted." };
  if (v.length > 4096) return { ok: false, why: "That is far too long to be the callback URL." };
  if (/^https:\/\/fantasy\.premierleague\.com\/static\/oauth-callback\?/.test(v)) return { ok: true, value: v };
  if (/^[?]?(code|state|error)=/.test(v)) return { ok: true, value: v };
  if (/^[A-Za-z0-9._~-]{8,128}$/.test(v)) return { ok: true, value: v };
  return {
    ok: false,
    why: "That does not look like the callback. Paste the whole address of the blank 404 page, the one starting https://fantasy.premierleague.com/static/oauth-callback?code=",
  };
}

// --------------------------------------------------------------------- page

function humanAge(seconds) {
  if (seconds == null) return "unknown";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

function page(identity) {
  const g = grantState();
  const pending = pendingState();
  const live = g.state === "live";
  const status = live
    ? `Grant alive. Access token good until ${g.accessExpires}.`
    : g.state === "expired"
      ? "Access token has expired. A refresh may still fix it without a phone login."
      : "No grant stored. A phone login is required.";

  return `<!-- served by scripts/auth-portal.mjs -->
<title>FPL auth</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    color-scheme: light dark;
    --bg: #fbfbfa; --fg: #16150f; --muted: #6b6a63; --line: #e3e2dc;
    --card: #ffffff; --accent: #2f6f4f; --warn: #8a4b2a; --field: #ffffff;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #14140f; --fg: #ecebe4; --muted: #9a998f; --line: #2c2c25;
      --card: #1c1c16; --accent: #7fbf9a; --warn: #d99a6c; --field: #14140f;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 1.5rem 1.1rem 4rem; background: var(--bg); color: var(--fg);
    font: 16px/1.55 ui-sans-serif, -apple-system, "Segoe UI", system-ui, sans-serif;
    max-width: 34rem; margin-inline: auto; -webkit-text-size-adjust: 100%;
  }
  h1 { font-size: 1.35rem; margin: 0 0 .2rem; letter-spacing: -.01em; }
  .who { color: var(--muted); font-size: .85rem; margin-bottom: 1.4rem; }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 1rem 1.05rem; margin-bottom: 1rem; }
  .status { font-weight: 600; margin: 0 0 .5rem; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: .3rem .9rem; margin: .6rem 0 0; font-size: .85rem; }
  dt { color: var(--muted); }
  dd { margin: 0; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  button {
    font: inherit; font-weight: 600; cursor: pointer; width: 100%;
    padding: .8rem 1rem; border-radius: 10px; border: 1px solid var(--accent);
    background: var(--accent); color: var(--bg);
  }
  button.secondary { background: transparent; color: var(--fg); border-color: var(--line); }
  button[disabled] { opacity: .5; cursor: progress; }
  textarea, input {
    font: inherit; width: 100%; padding: .7rem .8rem; border-radius: 10px;
    border: 1px solid var(--line); background: var(--field); color: var(--fg);
  }
  textarea { min-height: 5.5rem; resize: vertical; }
  ol { padding-left: 1.15rem; margin: .2rem 0 .9rem; }
  li { margin-bottom: .45rem; }
  a.link { display: block; word-break: break-all; font-size: .85rem; padding: .7rem .8rem; border: 1px dashed var(--line); border-radius: 10px; color: var(--accent); }
  .msg { margin-top: .8rem; padding: .7rem .8rem; border-radius: 10px; border: 1px solid var(--line); font-size: .88rem; white-space: pre-wrap; }
  .msg.bad { border-color: var(--warn); color: var(--warn); }
  .hidden { display: none; }
  .foot { color: var(--muted); font-size: .78rem; margin-top: 1.6rem; }
</style>

<h1>FPL auth</h1>
<div class="who">Signed in as ${escapeHtml(identity.name)} · ${escapeHtml(identity.login)}</div>

<div class="card">
  <p class="status">${escapeHtml(status)}</p>
  <dl>
    <dt>Manager</dt><dd>${g.managerId ?? "unknown"}</dd>
    <dt>Session</dt><dd>${g.sid ?? "none"}</dd>
    <dt>Logged in</dt><dd>${g.born ?? "never"}</dd>
    <dt>Grant age</dt><dd>${humanAge(g.ageSeconds)}</dd>
    <dt>Refresh token</dt><dd>${g.hasRefreshToken ? "stored" : "missing"}</dd>
  </dl>
</div>

<div class="card">
  <ol>
    <li>Tap <strong>Start login</strong>. A Premier League link appears.</li>
    <li>Open it and log in.</li>
    <li>You land on a blank <strong>404 Not Found</strong> page. That means it worked.</li>
    <li>Copy that page's whole address and paste it below.</li>
  </ol>

  <button id="start">Start login</button>
  <a class="link hidden" id="authlink" target="_blank" rel="noreferrer noopener"></a>

  <div id="pastebox" class="${pending && !pending.expired ? "" : "hidden"}" style="margin-top:.9rem">
    <textarea id="pasted" placeholder="https://fantasy.premierleague.com/static/oauth-callback?code=..." autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>
    <div style="height:.6rem"></div>
    <button id="finish" class="secondary">Finish login</button>
  </div>

  <div id="msg" class="msg hidden"></div>
</div>

<p class="foot">This page only carries the paste back to the box. The login itself happens on premierleague.com, and the tokens never leave this machine.${
  ALLOW.length ? "" : ' Anyone on the tailnet can use this page; set FPL_AUTH_ALLOW to pin it to one login.'
}</p>

<script>
  const $ = (id) => document.getElementById(id);
  const msg = (text, bad) => {
    const el = $("msg");
    el.textContent = text;
    el.className = "msg" + (bad ? " bad" : "");
  };

  async function post(path, body) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    return { ok: res.ok, data: await res.json().catch(() => ({})) };
  }

  $("start").onclick = async () => {
    $("start").disabled = true;
    msg("Asking the box for a fresh link...");
    const { ok, data } = await post("/start");
    $("start").disabled = false;
    if (!ok || !data.url) {
      msg(data.error || "Could not start a login.", true);
      return;
    }
    const link = $("authlink");
    link.href = data.url;
    link.textContent = "Open the Premier League login →";
    link.classList.remove("hidden");
    $("pastebox").classList.remove("hidden");
    msg("Link ready, and it lasts 30 minutes. Open it, log in, then paste the 404 page's address below.");
  };

  $("finish").onclick = async () => {
    const pasted = $("pasted").value.trim();
    if (!pasted) { msg("Paste the address of the 404 page first.", true); return; }
    $("finish").disabled = true;
    msg("Exchanging the code for tokens...");
    const { ok, data } = await post("/finish", { pasted });
    $("finish").disabled = false;
    if (!ok) { msg(data.error || "That did not work.", true); return; }
    msg("Done. " + (data.summary || "The box has a working grant again."));
    setTimeout(() => location.reload(), 2500);
  };
</script>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// ------------------------------------------------------------------- routes

function json(res, code, body) {
  const payload = JSON.stringify(body);
  res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(payload);
}

function readBody(req, limit = 8192) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > limit) {
        reject(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const who = identify(req);

  if (!who.ok) {
    // Fail closed. Announced with --identity whois, Caddy always injects a
    // verified identity, so a request without one did not come through the
    // front door.
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end(`403 — ${who.reason}\n\nReach this through http://fpl-auth.beast.go on the tailnet.\n`);
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(page(who));
    return;
  }

  if (req.method === "GET" && url.pathname === "/status") {
    json(res, 200, { grant: grantState(), pending: pendingState(), you: who.login });
    return;
  }

  if (req.method === "POST" && url.pathname === "/start") {
    const { code, out } = await runAuth(["--start"]);
    const authorizeUrl = extractAuthorizeUrl(out);
    if (code !== 0 || !authorizeUrl) {
      console.error(`[${who.login}] --start failed (exit ${code})`);
      json(res, 500, {
        error: code === 1 && !authorizeUrl
          ? "Could not start a login. A refresh may be running right now — try again in a moment."
          : "Could not start a login. Check the box logs.",
      });
      return;
    }
    console.log(`[${who.login}] started a login`);
    json(res, 200, { url: authorizeUrl });
    return;
  }

  if (req.method === "POST" && url.pathname === "/finish") {
    let parsed;
    try {
      parsed = JSON.parse(await readBody(req));
    } catch {
      json(res, 400, { error: "Could not read what you sent." });
      return;
    }
    const check = acceptablePaste(parsed.pasted);
    if (!check.ok) {
      json(res, 400, { error: check.why });
      return;
    }

    const { code, out } = await runAuth(["--finish", check.value]);
    if (code !== 0) {
      // Surface the auth script's own diagnosis: it distinguishes an expired
      // attempt, a state mismatch and a reused code, and those need different
      // things from the human.
      const reason = out.match(/^❌.*$/m)?.[0]?.replace(/^❌\s*/, "") ?? "The exchange failed.";
      console.error(`[${who.login}] --finish failed (exit ${code}): ${reason}`);
      json(res, 400, { error: reason });
      return;
    }

    const g = grantState();
    console.log(`[${who.login}] completed a login — sid ${g.sid}`);
    json(res, 200, {
      summary: g.accessExpires ? `Access token good until ${g.accessExpires}.` : "Tokens stored.",
    });
    return;
  }

  json(res, 404, { error: "no such path" });
});

// Rule one of announcing: bind 0.0.0.0. Beast proxies to this box's docker IP,
// so a loopback listener is unreachable and the name answers 503.
server.listen(PORT, "0.0.0.0", () => {
  console.log(`fpl auth portal on 0.0.0.0:${PORT}`);
  console.log(ALLOW.length ? `allowlist: ${ALLOW.join(", ")}` : "allowlist: unset (any identified tailnet user)");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
