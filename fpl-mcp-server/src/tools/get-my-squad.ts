import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { buildPlayerLookup, buildTeamLookup, getCurrentGameweek } from "../api/client.js";
import { FPLCache, cachedFetch } from "../cache/sqlite.js";
import { TTL, CACHE_KEYS } from "../cache/keys.js";
import type {
  EnrichedPlayer,
  SquadResponse,
  FPLPick,
  FPLPlayer,
  FPLTeam,
  FPLFixture,
  BootstrapStatic,
  MyTeamResponse,
  PicksResponse,
} from "../types/index.js";
import { POSITION_MAP, toMillions } from "../types/index.js";

function getDefaultManagerId(): number | undefined {
  const envValue = process.env.FPL_MANAGER_ID;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

export const getMySquadSchema = z.object({
  manager_id: z.number().optional().describe("Your FPL manager ID. Optional if FPL_MANAGER_ID env var is set."),
});

export type GetMySquadInput = z.infer<typeof getMySquadSchema>;

export const getMySquadTool = {
  name: "get_my_squad",
  description: `Get your current FPL squad with all 15 players, costs, captain info, and budget. ALWAYS call this first to see your owned players before making any recommendations.

🚨🚨🚨 CRITICAL - READ THIS 🚨🚨🚨

You MUST check data_source.is_stale in the response:

If data_source.is_stale is TRUE:
1. Display the squad data normally
2. AT THE VERY END of your response, display data_source.warning
3. Show the warning EXACTLY as provided - with ALL emojis and formatting
4. DO NOT summarize or soften the warning - show it in FULL
5. The warning goes LAST so it stays visible (top of terminal scrolls away)

This is NON-NEGOTIABLE. Users have been burned by outdated data before.`,
  inputSchema: {
    type: "object" as const,
    properties: {
      manager_id: {
        type: "number",
        description: "Your FPL manager ID. Optional if FPL_MANAGER_ID env var is set.",
      },
    },
    required: [],
  },
};

export async function handleGetMySquad(
  input: GetMySquadInput,
  client: FPLApiClient,
  cache: FPLCache
): Promise<SquadResponse | { error: string; message: string; help: string }> {
  const manager_id = input.manager_id ?? getDefaultManagerId();

  if (!manager_id) {
    return {
      error: "manager_id_required",
      message: "No manager ID provided and FPL_MANAGER_ID environment variable not set.",
      help: "Run 'npm run setup' in fpl-mcp-server to set up your credentials and manager ID.",
    };
  }

  // Fetch bootstrap data (cached 24h)
  const bootstrap = await cachedFetch<BootstrapStatic>(cache, CACHE_KEYS.bootstrap(), TTL.BOOTSTRAP, () =>
    client.getBootstrapStatic()
  );

  const playerLookup = buildPlayerLookup(bootstrap.elements);
  const teamLookup = buildTeamLookup(bootstrap.teams);
  const currentGw = getCurrentGameweek(bootstrap.events);

  // Fetch fixtures for next fixture info
  const fixtures = await cachedFetch<FPLFixture[]>(cache, CACHE_KEYS.fixtures(), TTL.FIXTURES, () =>
    client.getFixtures()
  );

  // Try authenticated my-team first, fall back to public picks
  let picks: FPLPick[];
  let bank = 0;
  let freeTransfers = 1;
  let availableChips: string[] = [];
  let activeChip: string | null = null;
  let dataSourceType: "authenticated" | "public_fallback" = "authenticated";
  let isStale = false;
  let staleWarning: string | undefined;
  let gameweekFetched: number | undefined;

  try {
    const myTeam = await cachedFetch<MyTeamResponse>(
      cache,
      CACHE_KEYS.myTeam(manager_id),
      TTL.MY_TEAM,
      () => client.getMyTeam(manager_id)
    );

    picks = myTeam.picks;
    bank = toMillions(myTeam.transfers.bank);
    freeTransfers = (myTeam.transfers.limit ?? 1) - myTeam.transfers.made;
    availableChips = myTeam.chips
      .filter((c) => c.status_for_entry === "available")
      .map((c) => c.name);
    dataSourceType = "authenticated";
    isStale = false;
  } catch {
    // Fall back to public picks endpoint
    const publicPicks = await cachedFetch<PicksResponse>(
      cache,
      CACHE_KEYS.picks(manager_id, currentGw),
      TTL.PICKS,
      () => client.getManagerPicks(manager_id, currentGw)
    );

    picks = publicPicks.picks;
    bank = toMillions(publicPicks.entry_history.bank);
    activeChip = publicPicks.active_chip;
    // Default assumptions when using public endpoint
    freeTransfers = 1;
    availableChips = ["bboost", "3xc", "wildcard", "freehit"];
    dataSourceType = "public_fallback";
    isStale = true;
    gameweekFetched = currentGw;
    staleWarning = `⚠️⚠️⚠️ STALE DATA WARNING ⚠️⚠️⚠️

🚨 THIS SQUAD DATA IS OUTDATED! 🚨

This data is from GAMEWEEK ${currentGw} confirmed picks only.
It does NOT show:
  ❌ Any transfers made since then
  ❌ Captain/vice-captain changes
  ❌ Bench order changes
  ❌ Current bank balance after transfers

🔧 FIX: Set FPL_COOKIE or FPL_X_API_AUTH environment variable for real-time data.

⚠️⚠️⚠️ DO NOT TRUST THIS DATA FOR TRANSFER DECISIONS ⚠️⚠️⚠️`;
  }

  // Enrich picks with player data
  const enrichedPlayers: EnrichedPlayer[] = picks.map((pick) => {
    const player = playerLookup.get(pick.element);
    const team = player ? teamLookup.get(player.team) : undefined;
    const nextFixture = getNextFixture(player?.team, currentGw, fixtures, teamLookup);

    const inStartingXi = pick.multiplier > 0;
    const benchOrder = !inStartingXi ? pick.position - 11 : null;

    return {
      id: pick.element,
      name: player?.web_name ?? "Unknown",
      full_name: player ? `${player.first_name} ${player.second_name}` : "Unknown",
      team: team?.short_name ?? "???",
      team_name: team?.name ?? "Unknown",
      position: POSITION_MAP[player?.element_type ?? 1] ?? "GK",
      cost: toMillions(player?.now_cost ?? 0),
      selling_price: pick.selling_price ? toMillions(pick.selling_price) : undefined,
      purchase_price: pick.purchase_price ? toMillions(pick.purchase_price) : undefined,
      is_captain: pick.is_captain,
      is_vice_captain: pick.is_vice_captain,
      in_starting_xi: inStartingXi,
      bench_order: benchOrder,
      ep_next: parseFloat(player?.ep_next ?? "0"),
      form: parseFloat(player?.form ?? "0"),
      status: player?.status ?? "a",
      chance_of_playing: player?.chance_of_playing_next_round ?? 100,
      minutes: player?.minutes ?? 0,
      total_points: player?.total_points ?? 0,
      next_fixture: nextFixture,
    };
  });

  const startingXi = enrichedPlayers.filter((p) => p.in_starting_xi);
  const bench = enrichedPlayers.filter((p) => !p.in_starting_xi).sort((a, b) => (a.bench_order ?? 0) - (b.bench_order ?? 0));

  const captain = enrichedPlayers.find((p) => p.is_captain);
  const viceCaptain = enrichedPlayers.find((p) => p.is_vice_captain);

  // Calculate club counts for 3-per-club rule
  const clubCounts: Record<string, number> = {};
  for (const player of enrichedPlayers) {
    clubCounts[player.team] = (clubCounts[player.team] ?? 0) + 1;
  }

  const totalSquadValue = enrichedPlayers.reduce((sum, p) => sum + p.cost, 0);

  return {
    squad: enrichedPlayers,
    starting_xi: startingXi,
    bench,
    budget: {
      bank,
      free_transfers: Math.max(0, freeTransfers),
      total_squad_value: Math.round(totalSquadValue * 10) / 10,
      max_cost_increase: bank,
    },
    captain: captain ? { id: captain.id, name: captain.name } : { id: 0, name: "Unknown" },
    vice_captain: viceCaptain ? { id: viceCaptain.id, name: viceCaptain.name } : { id: 0, name: "Unknown" },
    chips: {
      available: availableChips,
      active: activeChip,
    },
    club_counts: clubCounts,
    data_source: {
      type: dataSourceType,
      is_stale: isStale,
      warning: staleWarning,
      gameweek_fetched: gameweekFetched,
    },
  };
}

function getNextFixture(
  teamId: number | undefined,
  currentGw: number,
  fixtures: FPLFixture[],
  teamLookup: Map<number, FPLTeam>
): EnrichedPlayer["next_fixture"] | undefined {
  if (!teamId) return undefined;

  const nextFixture = fixtures.find(
    (f) => f.event === currentGw && (f.team_h === teamId || f.team_a === teamId)
  );

  if (!nextFixture) return undefined;

  const isHome = nextFixture.team_h === teamId;
  const opponentId = isHome ? nextFixture.team_a : nextFixture.team_h;
  const opponent = teamLookup.get(opponentId);

  return {
    opponent: opponent?.short_name ?? "???",
    opponent_name: opponent?.name ?? "Unknown",
    is_home: isHome,
    difficulty: isHome ? nextFixture.team_h_difficulty : nextFixture.team_a_difficulty,
    kickoff: nextFixture.kickoff_time,
  };
}
