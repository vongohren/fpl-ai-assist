# FPL MCP Server

A Model Context Protocol (MCP) server that provides Fantasy Premier League data tools for Claude.

## Features

- **get_my_squad**: Get your current 15-player squad with captain, budget, and chip info
- **get_fixtures**: Get Premier League fixtures with difficulty ratings
- **search_players**: Search for transfer targets by name, position, price, form, etc.

## Setup

### 1. Install dependencies

```bash
cd fpl-mcp-server
npm install
```

### 2. Configure environment variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FPL_MANAGER_ID` | Your FPL manager ID (from URL) | For get_my_squad |
| `FPL_COOKIE` | Browser cookie for authenticated endpoints | For full features |

**Finding your Manager ID:**
1. Go to https://fantasy.premierleague.com/my-team
2. Look at the URL or click "Points" - the number in the URL is your ID

**Getting your cookie:**
1. Log into FPL in your browser
2. Open DevTools (F12) → Network tab
3. Make any request to FPL
4. Copy the `Cookie` header value

### 3. Run the server

```bash
# Development mode (with hot reload)
npm run dev

# Production
npm run build
npm start
```

## Claude Desktop Integration

Add to your `.mcp.json` (project root or global config):

```json
{
  "mcpServers": {
    "fpl": {
      "command": "npx",
      "args": ["tsx", "fpl-mcp-server/src/index.ts"],
      "cwd": "/path/to/fpl-ai-assist",
      "env": {
        "FPL_COOKIE": "your-cookie-here"
      }
    }
  }
}
```

## Tools

### get_my_squad

Get your current squad with all player details.

**Parameters:**
- `manager_id` (required): Your FPL manager ID

**Returns:**
- 15 players with stats, fixtures, positions
- Captain and vice captain
- Budget info (bank, free transfers)
- Available chips
- Club distribution (for 3-per-club rule)

### get_fixtures

Get fixtures for a gameweek.

**Parameters:**
- `gameweek` (optional): GW number 1-38, defaults to current
- `team` (optional): Filter by team short name (e.g., 'ARS')

**Returns:**
- All fixtures with kickoff times
- Difficulty ratings (FDR)
- Teams with blank gameweeks

### search_players

Search the player database for transfer targets.

**Parameters:**
- `query`: Search by name
- `position`: GK, DEF, MID, FWD
- `team`: Team short name
- `max_price`/`min_price`: Price range
- `min_form`: Minimum form rating
- `min_minutes`: Minimum minutes played
- `sort_by`: form, total_points, ep_next, price, selected_by
- `limit`: Max results (default 10, max 20)

**Returns:**
- Matching players with stats
- Next 3 fixtures for each player
- Ownership percentages

## Caching

The server uses SQLite caching with these TTLs:

| Data | TTL |
|------|-----|
| Player catalog | 24 hours |
| Fixtures | 1 hour |
| Your squad | 5 minutes |
| Live scores | 30 seconds |

Cache is stored in `./data/cache.db` and persists across restarts.
