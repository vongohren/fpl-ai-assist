# FPL AI Assist

## Authentication

The FPL API requires a valid `FPL_X_API_AUTH` token (JWT). Tokens expire regularly.

**When you get stale data (401 errors or `data_source.is_stale: true`), refresh the token:**

```bash
source setup.sh
```

On a spawn box this goes **through the oauth-broker on beast** (since 2026-09-17):
the broker holds the FPL refresh token, `oauth-token get fpl` returns a fresh
access token, and `scripts/auth-keepalive.sh` writes it into `~/.fpl/secrets.env`
(every 30 min as the `fpl-auth-keepalive` job — PingOne access tokens are 60 min
since 2026-09-17 — and on `source setup.sh`). Nothing
rotating lives on this box. Off the fleet (no `oauth-token`), the legacy path
still works: the refresh token in `~/.fpl/secrets.env` is used directly.

No restart needed: the MCP server reads `~/.fpl/secrets.env` itself and re-reads it whenever the file changes, so a rotated token is picked up on the next tool call. Environment variables, when set to a non-empty value, still override the file.

### When the grant is dead (401 that a refresh does not fix)

```bash
scripts/auth-keepalive.sh --login      # = oauth-token login fpl --force
```

It prints the broker's approve link **and buzzes it to the phone** (ntfy), then
waits up to 20 minutes. Snorre opens the link, presses Approve, logs in to the
Premier League in the new tab, lands on a blank 404 page, copies its address and
pastes it into the same broker page. The box collects the token on its next poll.
The keepalive job does this by itself when it finds the grant dead, and the
gameweek loop's "innloggingen er død" alarm starts it too — so by the time a human
reads the alarm the link is already on the phone. **Never start two logins at
once** (the keepalive lock guards the scheduled one).

Legacy phone login (no broker): `source setup.sh --login` — the box prints a link
+ QR, you paste the 404 page's address back into the terminal.

### Why the flow looks like this

- The FPL OAuth client has the **device-code grant disabled**, so RFC 8628 is not an option.
- The client only accepts redirect URIs under `https://fantasy.premierleague.com/*`, so nobody can host the callback — not this box, not the broker. That is why the code has to be pasted back by hand; the broker's `authcode-paste` mechanism is exactly that paste, on the one approve page the fleet already uses for LinkedIn and hygglo.
- The redirect target is `/static/oauth-callback`, which the FPL CDN serves as a plain nginx 404 with no JavaScript. The SPA never boots there, so nothing consumes or strips the `?code=` before it can be copied. Redirecting to `/` would hand the code to the FPL app itself.
- The token endpoint accepts the FPL client as a **public client with no secret**, so the broker (or the box, in legacy mode) can complete the exchange alone.
- Until 2026-09-17 this repo carried its own paste-back page (`scripts/auth-portal.mjs`
  at `fpl-auth.beast.go`, plus a keeper job and an announce). The broker's approve
  page replaced it — one page for every provider, and the rotating refresh token
  left the box. See it-management `journal/2026-09-17-fpl-through-the-broker.md`.

Legacy fallbacks still exist but store your password on the box and need Chromium: `source setup.sh --password` (headless) and `source setup.sh --interactive` (needs a display).

## The gameweek loop

`scripts/gw-loop/` is the hourly job (`fpl-gw-loop`) that runs the season: research and
a proposal PR at T-72h before each deadline, one phone buzz at T-10h,
a Decision record when the deadline passes, and the post-mortem when FPL finalises. It
never makes transfers. If you are woken by it, the prompt names a rendered brief under
`/workspace/.spawn/fpl-gw-loop/briefs/`; read that and nothing else first. Details and
operating commands: `scripts/gw-loop/README.md`.

## Project Structure

- `fpl-mcp-server/` - MCP server providing FPL tools (squad, fixtures, search, trends)
- `scripts/gw-loop/` - The hourly gameweek loop (tick + agent briefs), see above
- `setup.sh` - Token refresh script (calls `npm run setup` which runs `fpl-mcp-server/scripts/setup.ts`)
- `.mcp.json` - MCP server config, reads `FPL_COOKIE`, `FPL_X_API_AUTH`, `FPL_MANAGER_ID` from env

## Environment Variables

Stored in `~/.fpl/secrets.env`:
- `FPL_X_API_AUTH` - JWT bearer token for authenticated FPL API endpoints
- `FPL_MANAGER_ID` - Manager ID (numeric)
- `BRAVE_SEARCH_API_KEY` - Optional, for community trends search
