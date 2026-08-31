# FPL AI Assist

## Authentication

The FPL API requires a valid `FPL_X_API_AUTH` token (JWT). Tokens expire regularly.

**When you get stale data (401 errors or `data_source.is_stale: true`), refresh the token:**

```bash
source setup.sh
```

Normally this is silent: it uses the stored refresh token to mint a new access token over plain HTTP. No browser, no phone, no password. It then loads env vars into the current shell. Restart Claude Code afterwards so the MCP server picks up the new token.

If there is no refresh token yet (first run), or the refresh token has been revoked, `setup.sh` falls back to a one-off **phone login**: the box prints a login URL plus a QR code, you complete the login on your phone, and paste the resulting URL back. Force it with `source setup.sh --login`.

### Why the flow looks like this

- The FPL OAuth client has the **device-code grant disabled**, so RFC 8628 is not an option.
- The client only accepts redirect URIs under `https://fantasy.premierleague.com/*`, so the box cannot host its own callback. That is why the code has to be pasted back by hand.
- The redirect target is `/static/oauth-callback`, which the FPL CDN serves as a plain nginx 404 with no JavaScript. The SPA never boots there, so nothing consumes or strips the `?code=` before it can be copied. Redirecting to `/` would hand the code to the FPL app itself.
- The token endpoint accepts the FPL client as a **public client with no secret**, so the box can complete the exchange alone.

### Recovering a dead grant without a live agent

`scripts/auth-portal.mjs` serves the paste-back step as a page on the tailnet at
`http://fpl-auth.beast.go`. Start login, log in on the phone, paste the address of
the blank 404 page, done.

It exists because the previous route was a Beeper chat, which the box can only read
through an MCP tool — meaning an agent session had to stay alive for the whole
30-minute PKCE window to catch the paste. On 2026-08-29 one did not, and the box
ran on a dead grant for a day. The page needs no live agent and no chat.

The portal owns no auth logic: it shells out to `mobile-auth.ts` under the same
`flock` the keepalive job takes, so there is exactly one holder of the rotating
refresh-token chain and a login can never interleave with a scheduled refresh.
Announce it with `--identity whois` so Caddy injects a Tailscale-verified identity;
it refuses any request without one. Set `FPL_AUTH_ALLOW` to pin it to a single
login (the page shows you yours).

Legacy fallbacks still exist but store your password on the box and need Chromium: `source setup.sh --password` (headless) and `source setup.sh --interactive` (needs a display).

## Project Structure

- `fpl-mcp-server/` - MCP server providing FPL tools (squad, fixtures, search, trends)
- `setup.sh` - Token refresh script (calls `npm run setup` which runs `fpl-mcp-server/scripts/setup.ts`)
- `.mcp.json` - MCP server config, reads `FPL_COOKIE`, `FPL_X_API_AUTH`, `FPL_MANAGER_ID` from env

## Environment Variables

Stored in `~/.fpl/secrets.env`:
- `FPL_X_API_AUTH` - JWT bearer token for authenticated FPL API endpoints
- `FPL_MANAGER_ID` - Manager ID (numeric)
- `BRAVE_SEARCH_API_KEY` - Optional, for community trends search
