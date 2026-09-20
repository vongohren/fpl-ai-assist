# FPL AI Assistant

An MCP server that gives Claude access to your Fantasy Premier League data.

## Setup

1. Authenticate with FPL:
   ```bash
   source setup.sh
   ```
   **On a fleet box** (one with `oauth-token`): the token comes through the
   oauth-broker on beast, which holds the FPL refresh token. First time, run
   `source setup.sh --login`: the broker's approve link is printed and buzzed to
   your phone; approve, log in to your Premier League account in the new tab,
   land on a blank "404 Not Found" page (that means it worked), copy that page's
   address and paste it into the same broker page. From then on `source setup.sh`
   refreshes silently — nothing rotating is stored on the box.

   **Anywhere else**: on first run the box prints a login URL and a QR code. Open it
   on your phone, log in, land on the blank 404 page, copy its address and paste it
   back into the terminal. The box exchanges it for an access token **and a
   refresh token**, both saved to `~/.fpl/secrets.env`; from then on `source setup.sh`
   refreshes silently. No password is ever stored on the box.

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
immediately instead of silently at the next gameweek evaluation. The MCP server
reads the file directly, so the key is live on the next tool call with no restart.

⚠️ On a spawn box, `~/.fpl` is on the container's overlay filesystem and does
**not** survive a rebuild — that takes the FPL refresh token with it too. For a
key that outlives rebuilds, put it in the box's fnox profile and the world's
`SECRETS` list, then rebuild (`fnox.toml` is baked at build time, so a restart
is not enough). Everything here reads the env var first, so no code changes are
needed once it arrives that way.

## Keeping the login alive

```bash
scripts/auth-keepalive.sh            # refresh (through the broker if there is one); wake an ACP agent if the grant is dead
scripts/auth-keepalive.sh --status   # report token state, change nothing
scripts/auth-keepalive.sh --login    # start a fresh login (broker: the link goes to the phone)
```

Scheduled on the life box **every 30 minutes** (`jobctl list | grep fpl-auth`;
`jobctl add "*/30 * * * *" fpl-auth-keepalive -- /workspace/fpl-ai-assist/scripts/auth-keepalive.sh`).
It was 6-hourly while PingOne issued ~6–8 h access tokens; since 2026-09-17 it
issues **60-minute** ones (measured on the 18:21 refresh that day, before the
broker was involved), so a 6 h cadence left the file stale five hours in six.
Every fire refreshes, because an access token is a signed JWT that keeps
verifying no matter what happened to the session behind it — a refresh is the
only way to learn the grant is alive.

It does **not** promise the login never dies. The refresh token has twice been
revoked server-side (2026-08-23, 2026-08-28) while its own `exp` was still
months away — not expiry, but the session being invalidated upstream, most
likely by a fresh login elsewhere such as the FPL app. Nothing here can prevent
that. What the job does guarantee is that we find out within 6 hours instead of
twelve hours before a gameweek deadline (which is what cost us a transfer in
GW2) — and, in broker mode, that it has already started the re-login and put
the approve link on the phone when it does.

## Re-authenticating

Access tokens expire often. Run `source setup.sh` — it refreshes silently.

If the refresh token itself has expired or been revoked, redo the login:

```bash
source setup.sh --login       # broker: approve link to the phone; legacy: link + QR, paste back
```


