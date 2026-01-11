import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { buildTeamLookup, getCurrentGameweek } from "../api/client.js";
import { FPLCache, cachedFetch } from "../cache/sqlite.js";
import { TTL, CACHE_KEYS } from "../cache/keys.js";
import type { EnrichedFixture, FixturesResponse, BootstrapStatic, FPLFixture, FPLEvent } from "../types/index.js";

export const getFixturesSchema = z.object({
  gameweek: z.number().optional().describe("Gameweek number (1-38). Omit for current gameweek."),
  team: z.string().optional().describe("Filter by team short name (e.g., 'ARS', 'MCI')"),
});

export type GetFixturesInput = z.infer<typeof getFixturesSchema>;

export const getFixturesTool = {
  name: "get_fixtures",
  description:
    "Get Premier League fixtures for a gameweek, including difficulty ratings. Use this to check who your players are playing against.",
  inputSchema: {
    type: "object" as const,
    properties: {
      gameweek: {
        type: "number",
        description: "Gameweek number (1-38). Omit for current gameweek.",
      },
      team: {
        type: "string",
        description: "Filter by team short name (e.g., 'ARS', 'MCI')",
      },
    },
  },
};

export async function handleGetFixtures(
  input: GetFixturesInput,
  client: FPLApiClient,
  cache: FPLCache
): Promise<FixturesResponse> {
  // Fetch bootstrap for team names and current gameweek
  const bootstrap = await cachedFetch<BootstrapStatic>(cache, CACHE_KEYS.bootstrap(), TTL.BOOTSTRAP, () =>
    client.getBootstrapStatic()
  );

  const teamLookup = buildTeamLookup(bootstrap.teams);
  const targetGw = input.gameweek ?? getCurrentGameweek(bootstrap.events);

  // Fetch all fixtures (cached)
  const allFixtures = await cachedFetch<FPLFixture[]>(cache, CACHE_KEYS.fixtures(), TTL.FIXTURES, () =>
    client.getFixtures()
  );

  // Filter by gameweek
  let fixtures = allFixtures.filter((f) => f.event === targetGw);

  // Filter by team if specified
  if (input.team) {
    const teamShort = input.team.toUpperCase();
    const teamId = [...teamLookup.entries()].find(([, t]) => t.short_name === teamShort)?.[0];

    if (teamId) {
      fixtures = fixtures.filter((f) => f.team_h === teamId || f.team_a === teamId);
    }
  }

  // Enrich fixtures with team names
  const enrichedFixtures: EnrichedFixture[] = fixtures.map((f) => {
    const homeTeam = teamLookup.get(f.team_h);
    const awayTeam = teamLookup.get(f.team_a);

    return {
      id: f.id,
      home_team: homeTeam?.short_name ?? "???",
      home_team_name: homeTeam?.name ?? "Unknown",
      away_team: awayTeam?.short_name ?? "???",
      away_team_name: awayTeam?.name ?? "Unknown",
      home_difficulty: f.team_h_difficulty,
      away_difficulty: f.team_a_difficulty,
      kickoff: f.kickoff_time,
      started: f.started,
      finished: f.finished,
      home_score: f.team_h_score,
      away_score: f.team_a_score,
    };
  });

  // Get event info for deadline
  const event = bootstrap.events.find((e) => e.id === targetGw);
  const allTeamIds = new Set(bootstrap.teams.map((t) => t.id));
  const teamsPlaying = new Set<number>();

  for (const f of fixtures) {
    teamsPlaying.add(f.team_h);
    teamsPlaying.add(f.team_a);
  }

  const teamsBlank = [...allTeamIds]
    .filter((id) => !teamsPlaying.has(id))
    .map((id) => teamLookup.get(id)?.short_name ?? "???");

  return {
    gameweek: targetGw,
    deadline: event?.deadline_time ?? "",
    is_current: event?.is_current ?? false,
    is_finished: event?.finished ?? false,
    fixtures: enrichedFixtures,
    teams_playing: enrichedFixtures.flatMap((f) => [f.home_team, f.away_team]).filter((v, i, a) => a.indexOf(v) === i),
    teams_blank: teamsBlank,
  };
}
