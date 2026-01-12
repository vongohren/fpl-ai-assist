import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { buildTeamLookup, getCurrentGameweek } from "../api/client.js";
import { FPLCache, cachedFetch } from "../cache/sqlite.js";
import { TTL, CACHE_KEYS } from "../cache/keys.js";
import type {
  BootstrapStatic,
  FPLFixture,
  FPLTeam,
  FixtureDifficultyResponse,
  GWFixture,
  TeamFixtureDetail,
} from "../types/index.js";

export const getFixtureDifficultySchema = z.object({
  team: z.string().describe("Team short name (e.g., 'ARS', 'MCI')"),
  gameweeks: z.number().optional().default(6).describe("Number of gameweeks to analyze (default: 6)"),
  from_gw: z.number().optional().describe("Starting gameweek (default: current)"),
});

export type GetFixtureDifficultyInput = z.infer<typeof getFixtureDifficultySchema>;

export const getFixtureDifficultyTool = {
  name: "get_fixture_difficulty",
  description: `Get fixture difficulty rating (FDR) for a team over upcoming gameweeks. Use this to identify favorable fixture runs for transfers, captain picks, and chip timing.

Returns:
- Fixtures for each GW with opponent and FDR (1-5 scale)
- BGW (blank gameweeks) and DGW (double gameweeks) detection
- Average FDR and difficulty breakdown
- Comparison ranking vs all other teams
- Actionable verdict (EXCELLENT/FAVORABLE/MIXED/DIFFICULT)`,
  inputSchema: {
    type: "object" as const,
    properties: {
      team: {
        type: "string",
        description: "Team short name (e.g., 'ARS', 'MCI')",
      },
      gameweeks: {
        type: "number",
        description: "Number of gameweeks to analyze (default: 6)",
      },
      from_gw: {
        type: "number",
        description: "Starting gameweek (default: current)",
      },
    },
    required: ["team"],
  },
};

export async function handleGetFixtureDifficulty(
  input: GetFixtureDifficultyInput,
  client: FPLApiClient,
  cache: FPLCache
): Promise<FixtureDifficultyResponse> {
  const teamShort = input.team.toUpperCase();
  const numGameweeks = input.gameweeks ?? 6;

  // Fetch bootstrap data
  const bootstrap = await cachedFetch<BootstrapStatic>(cache, CACHE_KEYS.bootstrap(), TTL.BOOTSTRAP, () =>
    client.getBootstrapStatic()
  );

  const teamLookup = buildTeamLookup(bootstrap.teams);
  const fromGw = input.from_gw ?? getCurrentGameweek(bootstrap.events);
  const toGw = Math.min(fromGw + numGameweeks - 1, 38);

  // Find team by short name
  const team = bootstrap.teams.find((t) => t.short_name === teamShort);
  if (!team) {
    throw new Error(`Team not found: ${teamShort}. Valid teams: ${bootstrap.teams.map((t) => t.short_name).join(", ")}`);
  }

  // Fetch all fixtures
  const allFixtures = await cachedFetch<FPLFixture[]>(cache, CACHE_KEYS.fixtures(), TTL.FIXTURES, () =>
    client.getFixtures()
  );

  // Get fixtures for this team in the range
  const teamFixtures = getTeamFixturesInRange(team.id, fromGw, toGw, allFixtures, teamLookup);

  // Calculate summary
  const summary = calculateSummary(teamFixtures, fromGw, toGw);

  // Calculate comparison with all teams
  const comparison = calculateComparison(team.id, fromGw, toGw, allFixtures, bootstrap.teams, teamLookup);

  // Generate verdict
  const verdict = generateVerdict(summary, comparison);

  return {
    team: teamShort,
    team_name: team.name,
    analysis_range: { from: fromGw, to: toGw },
    fixtures: teamFixtures,
    summary,
    comparison,
    verdict,
  };
}

function getTeamFixturesInRange(
  teamId: number,
  fromGw: number,
  toGw: number,
  allFixtures: FPLFixture[],
  teamLookup: Map<number, FPLTeam>
): GWFixture[] {
  const result: GWFixture[] = [];

  for (let gw = fromGw; gw <= toGw; gw++) {
    const gwFixtures = allFixtures.filter(
      (f) => f.event === gw && (f.team_h === teamId || f.team_a === teamId)
    );

    if (gwFixtures.length === 0) {
      // Blank gameweek
      result.push({
        gw,
        opponent: null,
        opponent_name: null,
        is_home: null,
        fdr: null,
        kickoff: null,
        is_double: false,
      });
    } else if (gwFixtures.length === 1) {
      // Single fixture
      const f = gwFixtures[0];
      const isHome = f.team_h === teamId;
      const opponentId = isHome ? f.team_a : f.team_h;
      const opponent = teamLookup.get(opponentId);

      result.push({
        gw,
        opponent: opponent?.short_name ?? "???",
        opponent_name: opponent?.name ?? "Unknown",
        is_home: isHome,
        fdr: isHome ? f.team_h_difficulty : f.team_a_difficulty,
        kickoff: f.kickoff_time,
        is_double: false,
      });
    } else {
      // Double gameweek
      const details: TeamFixtureDetail[] = gwFixtures.map((f) => {
        const isHome = f.team_h === teamId;
        const opponentId = isHome ? f.team_a : f.team_h;
        const opponent = teamLookup.get(opponentId);
        return {
          opponent: opponent?.short_name ?? "???",
          opponent_name: opponent?.name ?? "Unknown",
          is_home: isHome,
          fdr: isHome ? f.team_h_difficulty : f.team_a_difficulty,
          kickoff: f.kickoff_time,
        };
      });

      // Use first fixture for main fields, but flag as double
      const first = details[0];
      result.push({
        gw,
        opponent: first.opponent,
        opponent_name: first.opponent_name,
        is_home: first.is_home,
        fdr: first.fdr,
        kickoff: first.kickoff,
        is_double: true,
        all_fixtures: details,
      });
    }
  }

  return result;
}

function calculateSummary(fixtures: GWFixture[], fromGw: number, toGw: number) {
  const blankGws: number[] = [];
  const doubleGws: number[] = [];
  const fdrValues: number[] = [];

  for (const f of fixtures) {
    if (f.fdr === null) {
      blankGws.push(f.gw);
    } else if (f.is_double && f.all_fixtures) {
      doubleGws.push(f.gw);
      // Add all FDR values from double GW
      for (const detail of f.all_fixtures) {
        fdrValues.push(detail.fdr);
      }
    } else {
      fdrValues.push(f.fdr);
    }
  }

  const avgFdr = fdrValues.length > 0
    ? Math.round((fdrValues.reduce((a, b) => a + b, 0) / fdrValues.length) * 10) / 10
    : 0;

  return {
    average_fdr: avgFdr,
    easy_fixtures: fdrValues.filter((f) => f <= 2).length,
    medium_fixtures: fdrValues.filter((f) => f === 3).length,
    hard_fixtures: fdrValues.filter((f) => f >= 4).length,
    blank_gameweeks: blankGws,
    double_gameweeks: doubleGws,
  };
}

function calculateComparison(
  teamId: number,
  fromGw: number,
  toGw: number,
  allFixtures: FPLFixture[],
  teams: FPLTeam[],
  teamLookup: Map<number, FPLTeam>
) {
  // Calculate average FDR for each team
  const teamFdrs: { teamId: number; shortName: string; avgFdr: number }[] = [];

  for (const t of teams) {
    const fdrValues: number[] = [];

    for (let gw = fromGw; gw <= toGw; gw++) {
      const gwFixtures = allFixtures.filter(
        (f) => f.event === gw && (f.team_h === t.id || f.team_a === t.id)
      );

      for (const f of gwFixtures) {
        const isHome = f.team_h === t.id;
        fdrValues.push(isHome ? f.team_h_difficulty : f.team_a_difficulty);
      }
    }

    const avgFdr = fdrValues.length > 0
      ? fdrValues.reduce((a, b) => a + b, 0) / fdrValues.length
      : 5; // Penalize teams with no fixtures

    teamFdrs.push({ teamId: t.id, shortName: t.short_name, avgFdr });
  }

  // Sort by FDR (lower = easier = better)
  teamFdrs.sort((a, b) => a.avgFdr - b.avgFdr);

  const thisTeamIndex = teamFdrs.findIndex((t) => t.teamId === teamId);
  const thisTeamFdr = teamFdrs[thisTeamIndex]?.avgFdr ?? 3;

  // Teams with worse (higher) FDR
  const betterThan = teamFdrs
    .slice(thisTeamIndex + 1)
    .map((t) => t.shortName);

  const leagueAvg = teamFdrs.reduce((sum, t) => sum + t.avgFdr, 0) / teamFdrs.length;

  return {
    league_avg_fdr: Math.round(leagueAvg * 10) / 10,
    rank_among_teams: thisTeamIndex + 1,
    better_than: betterThan,
  };
}

function generateVerdict(
  summary: ReturnType<typeof calculateSummary>,
  comparison: ReturnType<typeof calculateComparison>
): string {
  const { average_fdr, easy_fixtures, hard_fixtures, blank_gameweeks, double_gameweeks } = summary;
  const { rank_among_teams } = comparison;

  // Determine rating
  let rating: string;
  if (average_fdr <= 2.5) rating = "EXCELLENT";
  else if (average_fdr <= 3.0) rating = "FAVORABLE";
  else if (average_fdr <= 3.5) rating = "MIXED";
  else rating = "DIFFICULT";

  // Build description
  const parts: string[] = [];

  if (easy_fixtures >= 4) {
    parts.push(`${easy_fixtures} easy fixtures`);
  } else if (hard_fixtures >= 3) {
    parts.push(`${hard_fixtures} tough fixtures`);
  } else {
    parts.push("balanced schedule");
  }

  if (blank_gameweeks.length > 0) {
    parts.push(`BGW${blank_gameweeks.join(",")}`);
  }

  if (double_gameweeks.length > 0) {
    parts.push(`DGW${double_gameweeks.join(",")}`);
  }

  // Ordinal suffix
  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${rating} - ${parts.join(", ")} (${ordinal(rank_among_teams)} easiest fixtures)`;
}
