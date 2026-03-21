# FPL AI Assist

## Authentication

The FPL API requires a valid `FPL_X_API_AUTH` token (JWT). Tokens expire regularly.

**When you get stale data (401 errors or `data_source.is_stale: true`), refresh the token:**

```bash
source setup.sh
```

This opens a browser for FPL login, captures the token automatically, saves it to `~/.fpl/secrets.env`, and loads env vars into the current shell. After refreshing, restart Claude Code so the MCP server picks up the new token.

## Project Structure

- `fpl-mcp-server/` - MCP server providing FPL tools (squad, fixtures, search, trends)
- `setup.sh` - Token refresh script (calls `npm run setup` which runs `fpl-mcp-server/scripts/setup.ts`)
- `.mcp.json` - MCP server config, reads `FPL_COOKIE`, `FPL_X_API_AUTH`, `FPL_MANAGER_ID` from env

## Environment Variables

Stored in `~/.fpl/secrets.env`:
- `FPL_X_API_AUTH` - JWT bearer token for authenticated FPL API endpoints
- `FPL_MANAGER_ID` - Manager ID (numeric)
- `BRAVE_SEARCH_API_KEY` - Optional, for community trends search
