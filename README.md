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
