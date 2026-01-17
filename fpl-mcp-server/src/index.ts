#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { FPLApiClient } from "./api/client.js";
import { FPLCache } from "./cache/sqlite.js";
import { log, logToolCall, logToolResult, logError } from "./logger.js";
import {
  getMySquadTool,
  handleGetMySquad,
  getMySquadSchema,
  getFixturesTool,
  handleGetFixtures,
  getFixturesSchema,
  searchPlayersTool,
  handleSearchPlayers,
  searchPlayersSchema,
  getFixtureDifficultyTool,
  handleGetFixtureDifficulty,
  getFixtureDifficultySchema,
} from "./tools/index.js";

// Initialize cache and API client
const cache = new FPLCache();
const client = new FPLApiClient({
  cookie: process.env.FPL_COOKIE,
  xApiAuth: process.env.FPL_X_API_AUTH,
});

// Create MCP server
const server = new Server(
  {
    name: "fpl-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [getMySquadTool, getFixturesTool, searchPlayersTool, getFixtureDifficultyTool],
}));

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  logToolCall(name, args);

  try {
    switch (name) {
      case "get_my_squad": {
        const input = getMySquadSchema.parse(args);
        const result = await handleGetMySquad(input, client, cache);
        if ("error" in result) {
          logToolResult(name, `Error: ${result.error}`);
        } else {
          logToolResult(name, `Returned ${result.squad.length} players`);
        }
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_fixtures": {
        const input = getFixturesSchema.parse(args);
        const result = await handleGetFixtures(input, client, cache);
        logToolResult(name, `Returned ${result.fixtures.length} fixtures for GW${result.gameweek}`);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "search_players": {
        const input = searchPlayersSchema.parse(args);
        const result = await handleSearchPlayers(input, client, cache);
        logToolResult(name, `Found ${result.total_matches} matches, returned ${result.showing}`);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_fixture_difficulty": {
        const input = getFixtureDifficultySchema.parse(args);
        const result = await handleGetFixtureDifficulty(input, client, cache);
        logToolResult(name, `Analyzed ${result.team} fixtures GW${result.analysis_range.from}-${result.analysis_range.to}`);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logError(name, error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  log("INFO", "FPL MCP Server starting...", {
    hasAuth: client.hasAuth(),
    cacheStats: cache.stats(),
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log("INFO", "FPL MCP Server connected and ready");
}

main().catch((error) => {
  logError("Fatal", error);
  process.exit(1);
});
