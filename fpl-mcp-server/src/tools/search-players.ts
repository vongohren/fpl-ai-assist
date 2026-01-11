import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { buildTeamLookup, getCurrentGameweek } from "../api/client.js";
import { FPLCache, cachedFetch } from "../cache/sqlite.js";
import { TTL, CACHE_KEYS } from "../cache/keys.js";
import type { SearchPlayersResponse, BootstrapStatic, FPLFixture, FPLPlayer, FPLTeam } from "../types/index.js";
import { POSITION_MAP, toMillions } from "../types/index.js";

export const searchPlayersSchema = z.object({
  query: z.string().optional().describe("Search by player name (partial match)"),
  position: z.enum(["GK", "DEF", "MID", "FWD"]).optional().describe("Filter by position"),
  team: z.string().optional().describe("Filter by team short name (e.g., 'ARS')"),
  max_price: z.number().optional().describe("Maximum price in millions (e.g., 8.5)"),
  min_price: z.number().optional().describe("Minimum price in millions"),
  min_form: z.number().optional().describe("Minimum form rating"),
  min_minutes: z.number().optional().describe("Minimum minutes played this season"),
  sort_by: z
    .enum(["form", "total_points", "ep_next", "price", "selected_by"])
    .optional()
    .describe("Sort results by field"),
  limit: z.number().optional().describe("Max results to return (default 10, max 20)"),
});

export type SearchPlayersInput = z.infer<typeof searchPlayersSchema>;

export const searchPlayersTool = {
  name: "search_players",
  description:
    "Search for FPL players by name, team, position, or stats to find transfer targets. Use this when looking for alternatives or potential transfers.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Search by player name (partial match)",
      },
      position: {
        type: "string",
        enum: ["GK", "DEF", "MID", "FWD"],
        description: "Filter by position",
      },
      team: {
        type: "string",
        description: "Filter by team short name (e.g., 'ARS')",
      },
      max_price: {
        type: "number",
        description: "Maximum price in millions (e.g., 8.5)",
      },
      min_price: {
        type: "number",
        description: "Minimum price in millions",
      },
      min_form: {
        type: "number",
        description: "Minimum form rating",
      },
      min_minutes: {
        type: "number",
        description: "Minimum minutes played this season",
      },
      sort_by: {
        type: "string",
        enum: ["form", "total_points", "ep_next", "price", "selected_by"],
        description: "Sort results by field",
      },
      limit: {
        type: "number",
        description: "Max results to return (default 10, max 20)",
      },
    },
  },
};

const POSITION_MAP_REVERSE: Record<string, number> = {
  GK: 1,
  DEF: 2,
  MID: 3,
  FWD: 4,
};

export async function handleSearchPlayers(
  input: SearchPlayersInput,
  client: FPLApiClient,
  cache: FPLCache
): Promise<SearchPlayersResponse> {
  // Fetch bootstrap data (cached)
  const bootstrap = await cachedFetch<BootstrapStatic>(cache, CACHE_KEYS.bootstrap(), TTL.BOOTSTRAP, () =>
    client.getBootstrapStatic()
  );

  const teamLookup = buildTeamLookup(bootstrap.teams);
  const currentGw = getCurrentGameweek(bootstrap.events);

  // Fetch fixtures for next fixtures
  const allFixtures = await cachedFetch<FPLFixture[]>(cache, CACHE_KEYS.fixtures(), TTL.FIXTURES, () =>
    client.getFixtures()
  );

  let players = [...bootstrap.elements];

  // Apply filters
  if (input.query) {
    const q = input.query.toLowerCase();
    players = players.filter(
      (p) =>
        p.web_name.toLowerCase().includes(q) ||
        p.first_name.toLowerCase().includes(q) ||
        p.second_name.toLowerCase().includes(q)
    );
  }

  if (input.position) {
    const positionId = POSITION_MAP_REVERSE[input.position];
    players = players.filter((p) => p.element_type === positionId);
  }

  if (input.team) {
    const teamShort = input.team.toUpperCase();
    const teamId = [...teamLookup.entries()].find(([, t]) => t.short_name === teamShort)?.[0];
    if (teamId) {
      players = players.filter((p) => p.team === teamId);
    }
  }

  if (input.max_price !== undefined) {
    const maxCost = input.max_price * 10;
    players = players.filter((p) => p.now_cost <= maxCost);
  }

  if (input.min_price !== undefined) {
    const minCost = input.min_price * 10;
    players = players.filter((p) => p.now_cost >= minCost);
  }

  if (input.min_form !== undefined) {
    players = players.filter((p) => parseFloat(p.form) >= input.min_form!);
  }

  if (input.min_minutes !== undefined) {
    players = players.filter((p) => p.minutes >= input.min_minutes!);
  }

  const totalMatches = players.length;

  // Sort
  const sortBy = input.sort_by ?? "form";
  players.sort((a, b) => {
    switch (sortBy) {
      case "form":
        return parseFloat(b.form) - parseFloat(a.form);
      case "total_points":
        return b.total_points - a.total_points;
      case "ep_next":
        return parseFloat(b.ep_next) - parseFloat(a.ep_next);
      case "price":
        return b.now_cost - a.now_cost;
      case "selected_by":
        return parseFloat(b.selected_by_percent) - parseFloat(a.selected_by_percent);
      default:
        return parseFloat(b.form) - parseFloat(a.form);
    }
  });

  // Limit results
  const limit = Math.min(input.limit ?? 10, 20);
  players = players.slice(0, limit);

  // Enrich with next fixtures
  const enrichedPlayers = players.map((p) => {
    const team = teamLookup.get(p.team);
    const nextFixtures = getNextFixtures(p.team, currentGw, allFixtures, teamLookup, 3);

    return {
      id: p.id,
      name: p.web_name,
      full_name: `${p.first_name} ${p.second_name}`,
      team: team?.short_name ?? "???",
      team_name: team?.name ?? "Unknown",
      position: POSITION_MAP[p.element_type] ?? "GK",
      cost: toMillions(p.now_cost),
      ep_next: parseFloat(p.ep_next),
      form: parseFloat(p.form),
      status: p.status,
      chance_of_playing: p.chance_of_playing_next_round,
      minutes: p.minutes,
      total_points: p.total_points,
      selected_by: `${p.selected_by_percent}%`,
      next_fixtures: nextFixtures,
    };
  });

  return {
    query: input as Record<string, unknown>,
    total_matches: totalMatches,
    showing: enrichedPlayers.length,
    players: enrichedPlayers,
  };
}

function getNextFixtures(
  teamId: number,
  currentGw: number,
  fixtures: FPLFixture[],
  teamLookup: Map<number, FPLTeam>,
  count: number
): Array<{ opponent: string; is_home: boolean; difficulty: number }> {
  const result: Array<{ opponent: string; is_home: boolean; difficulty: number }> = [];

  for (let gw = currentGw; gw <= Math.min(currentGw + count, 38) && result.length < count; gw++) {
    const fixture = fixtures.find((f) => f.event === gw && (f.team_h === teamId || f.team_a === teamId));

    if (fixture) {
      const isHome = fixture.team_h === teamId;
      const opponentId = isHome ? fixture.team_a : fixture.team_h;
      const opponent = teamLookup.get(opponentId);

      result.push({
        opponent: opponent?.short_name ?? "???",
        is_home: isHome,
        difficulty: isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty,
      });
    }
  }

  return result;
}
