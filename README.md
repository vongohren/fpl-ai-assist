# FPL AI Assistant

An MCP server that gives Claude access to your Fantasy Premier League data.

## Setup

1. Run the setup script to authenticate with FPL:
   ```bash
   source setup.sh
   ```
   On first run the box prints a login URL and a QR code. Open it on your phone, log in to your Premier League account, and you'll land on a blank "404 Not Found" page — that means it worked. Copy that page's full URL from the address bar and paste it back into the terminal.

   The box exchanges it for an access token **and a refresh token**, both saved to `~/.fpl/secrets.env`. From then on `source setup.sh` refreshes silently: no browser, no phone, and no password ever stored on the box.

2. Source your secrets (add to your `.zshrc` for persistence):
   ```bash
   source ~/.fpl/secrets.env
   ```

3. Start Claude Code in this directory:
   ```bash
   claude
   ```

## Available Tools

Once authenticated, Claude can:
- **Get your squad** - View your 15 players, captain, budget, chips
- **Search players** - Find transfer targets by name, position, price, form
- **Get fixtures** - See upcoming matches and difficulty ratings
- **Fixture difficulty** - Analyze a team's fixture run over multiple gameweeks
- **Community trends** - Get FPL community sentiment from Reddit/Twitter (requires `BRAVE_SEARCH_API_KEY`)

## Community trends key

```bash
./scripts/set-brave-key.sh            # prompt (hidden), verify, save
./scripts/set-brave-key.sh --show     # is a key set? (masked)
./scripts/set-brave-key.sh --remove   # delete it
```

The key is checked against the Brave API before saving, so a bad paste fails
immediately instead of silently at the next gameweek evaluation. Then
`source ~/.fpl/secrets.env` and restart Claude Code.

⚠️ On a spawn box, `~/.fpl` is on the container's overlay filesystem and does
**not** survive a rebuild — that takes the FPL refresh token with it too. For a
key that outlives rebuilds, put it in the box's fnox profile and the world's
`SECRETS` list, then rebuild (`fnox.toml` is baked at build time, so a restart
is not enough). Everything here reads the env var first, so no code changes are
needed once it arrives that way.

## Keeping the login alive

```bash
scripts/auth-keepalive.sh            # refresh if due; alert if the grant is dead
scripts/auth-keepalive.sh --status   # report token state, change nothing
```

Scheduled on the life box every 6 hours (`jobctl list | grep fpl-auth`). It
refreshes when under 2h remain, so the access token is never stale when a tool
needs it.

It does **not** promise the login never dies. The refresh token has twice been
revoked server-side (2026-08-23, 2026-08-28) while its own `exp` was still
months away — not expiry, but the session being invalidated upstream, most
likely by a fresh login elsewhere such as the FPL app. Nothing on this box can
prevent that. What the job does guarantee is that we find out within 6 hours
instead of twelve hours before a gameweek deadline, which is what actually cost
us a transfer in GW2.

## Re-authenticating

Access tokens expire often. Run `source setup.sh` — it refreshes silently using the stored refresh token.

If the refresh token itself has expired or been revoked, redo the one-off phone login:

```bash
source setup.sh --login
```

Legacy flows (store your FPL password on the box, require Chromium):

```bash
source setup.sh --password      # headless browser login
source setup.sh --interactive   # headful browser, needs a display
```
