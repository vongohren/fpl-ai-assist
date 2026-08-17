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
