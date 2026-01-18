# FPL AI Assistant

An MCP server that gives Claude access to your Fantasy Premier League data.

## Setup

1. Run the setup script to authenticate with FPL:
   ```bash
   ./setup.sh
   ```
   This opens a browser where you log in to FPL. After login, you'll be prompted for an optional Brave Search API key (for community trends). All secrets are saved to `~/.fpl/secrets.env`.

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

Tokens expire periodically. When tools stop working, run `./setup.sh` again.
