import { z } from "zod";
import type { FPLApiClient } from "../api/client.js";
import { getCurrentGameweek } from "../api/client.js";
import { FPLCache, cachedFetch } from "../cache/sqlite.js";
import { TTL, CACHE_KEYS } from "../cache/keys.js";
import type {
  BootstrapStatic,
  FPLPlayer,
  CommunityTrendsResponse,
  TrendingPlayer,
  TrendingPlayerSource,
} from "../types/index.js";

// Brave Search API response types
interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[];
  };
}

export const getCommunityTrendsSchema = z.object({
  topic: z
    .enum(["transfers", "captaincy", "differentials", "general"])
    .optional()
    .default("general")
    .describe("Focus area: transfers, captaincy, differentials, or general"),
  position: z
    .enum(["GK", "DEF", "MID", "FWD"])
    .optional()
    .describe("Filter by position"),
  player_name: z.string().optional().describe("Focus on specific player"),
  gameweek: z.number().optional().describe("Gameweek (default: current)"),
});

export type GetCommunityTrendsInput = z.infer<typeof getCommunityTrendsSchema>;

export const getCommunityTrendsTool = {
  name: "get_community_trends",
  description: `Get FPL community trends and buzz from Reddit, Twitter, and FPL blogs.
Use this weekly to catch players the stats might miss - the "eye test" picks,
tactical changes, or emerging differentials being discussed by the community.

Returns:
- Trending players with buy/sell/hold sentiment
- Source links for verification
- Hot topics in the FPL community`,
  inputSchema: {
    type: "object" as const,
    properties: {
      topic: {
        type: "string",
        enum: ["transfers", "captaincy", "differentials", "general"],
        description: "Focus area: transfers, captaincy, differentials, or general",
      },
      position: {
        type: "string",
        enum: ["GK", "DEF", "MID", "FWD"],
        description: "Filter by position",
      },
      player_name: {
        type: "string",
        description: "Focus on specific player",
      },
      gameweek: {
        type: "number",
        description: "Gameweek (default: current)",
      },
    },
    required: [],
  },
};

// Helper to escape special regex characters in player names
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Sentiment indicators - based on r/FantasyPL community lingo
const SENTIMENT_PATTERNS = {
  buy: [
    "bringing in",
    "must have",
    "essential",
    "bandwagon",
    "getting in",
    "buy",
    "pick up",
    "transfer in",
    "signing",
    "worth it",
    "great value",
    "differential",
    "hidden gem",
    "underrated",
    "haul",
    "hauling",
    "nailed",
    "glued",
    "set and forget",
    "green arrow",
    "enabler",
    "returning",
    "talisman",
    "value pick",
    "oop",
    "out of position",
    "premium",
    "ceiling",
    "punt",
    "big at the back",
  ],
  sell: [
    "getting rid",
    "selling",
    "avoid",
    "trap",
    "transfer out",
    "drop",
    "bench",
    "not worth",
    "overpriced",
    "rotation risk",
    "injured",
    "out for",
    "blanked",
    "blanking",
    "red arrow",
    "mudded",
    "in the mud",
    "rotation roulette",
    "bald fraud",
    "chasing points",
    "points chasing",
    "sideways move",
    "sideways",
    "knee-jerk",
    "kneejerking",
    "kneejerk",
    "bench fodder",
    "dead weight",
  ],
  hold: [
    "keeping",
    "hold",
    "wait and see",
    "patience",
    "stick with",
    "trust",
    "long term",
    "hold those knees",
    "floor",
    "regression",
    "regression to the mean",
    "set and forget",
  ],
  watch: [
    "monitor",
    "could rise",
    "one to watch",
    "keep an eye",
    "wait for",
    "potential",
    "emerging",
    "breaking through",
    "eye test",
    "looks good",
    "cover",
    "handcuff",
    "effective ownership",
  ],
};

export async function handleGetCommunityTrends(
  input: GetCommunityTrendsInput,
  client: FPLApiClient,
  cache: FPLCache
): Promise<CommunityTrendsResponse | { error: string; setup_instructions: string }> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    return {
      error: "BRAVE_SEARCH_API_KEY not configured",
      setup_instructions:
        "Get a free API key at https://brave.com/search/api/ and set BRAVE_SEARCH_API_KEY environment variable",
    };
  }

  const topic = input.topic ?? "general";
  const position = input.position;
  const playerName = input.player_name;

  // Get current gameweek from bootstrap data
  const bootstrap = await cachedFetch<BootstrapStatic>(
    cache,
    CACHE_KEYS.bootstrap(),
    TTL.BOOTSTRAP,
    () => client.getBootstrapStatic()
  );
  const gameweek = input.gameweek ?? getCurrentGameweek(bootstrap.events);

  // Check cache first
  const cacheKey = CACHE_KEYS.communityTrends(
    `${topic}-${position ?? "all"}-${playerName ?? "all"}`,
    gameweek
  );

  const cached = cache.get<CommunityTrendsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  // Build search queries based on topic
  const queries = buildSearchQueries(topic, position, playerName, gameweek);

  // Execute searches
  const allResults: BraveSearchResult[] = [];
  let queriesMade = 0;
  let warning: string | undefined;

  for (const query of queries) {
    try {
      const results = await executeBraveSearch(query, apiKey);
      allResults.push(...results);
      queriesMade++;
    } catch (error) {
      warning = `Some searches failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  // Parse results for player mentions and sentiment
  const trendingPlayers = extractTrendingPlayers(allResults, bootstrap.elements, position);

  // Extract hot topics
  const hotTopics = extractHotTopics(allResults);

  const response: CommunityTrendsResponse = {
    query: {
      topic,
      position,
      gameweek,
    },
    fetched_at: new Date().toISOString(),
    trending_players: trendingPlayers,
    hot_topics: hotTopics,
    data_source: {
      search_provider: "Brave Search",
      queries_made: queriesMade,
      warning,
    },
  };

  // Cache the response
  cache.set(cacheKey, response, TTL.COMMUNITY_TRENDS);

  return response;
}

function buildSearchQueries(
  topic: string,
  position: string | undefined,
  playerName: string | undefined,
  gameweek: number
): string[] {
  const queries: string[] = [];
  const year = new Date().getFullYear();
  const positionStr = position ? ` ${position.toLowerCase()}` : "";

  if (playerName) {
    // Player-specific searches - Reddit + general
    queries.push(`site:reddit.com/r/FantasyPL "${playerName}" gameweek ${gameweek}`);
    queries.push(`site:reddit.com/r/FantasyPL "${playerName}" transfer`);
    queries.push(`FPL "${playerName}" transfer advice ${year}`);
    queries.push(`"${playerName}" fantasy premier league reddit`);
    return queries;
  }

  // Reddit-specific queries first (r/FantasyPL focused)
  switch (topic) {
    case "transfers":
      queries.push(`site:reddit.com/r/FantasyPL gameweek ${gameweek} transfer`);
      queries.push(`site:reddit.com/r/FantasyPL GW${gameweek} RMT`);
      // General searches
      queries.push(`FPL gameweek ${gameweek} transfers Reddit ${year}`);
      queries.push(`FPL${positionStr} transfer targets gameweek ${gameweek}`);
      queries.push(`fantasy premier league who to buy${positionStr} ${year}`);
      break;
    case "captaincy":
      queries.push(`site:reddit.com/r/FantasyPL gameweek ${gameweek} captain poll`);
      queries.push(`site:reddit.com/r/FantasyPL GW${gameweek} TC captain`);
      // General searches
      queries.push(`FPL gameweek ${gameweek} captain Reddit`);
      queries.push(`FPL who to captain GW${gameweek}`);
      queries.push(`fantasy premier league captain picks ${year}`);
      break;
    case "differentials":
      queries.push(`site:reddit.com/r/FantasyPL differentials gameweek ${gameweek}`);
      queries.push(`site:reddit.com/r/FantasyPL hidden gem punt${positionStr} ${year}`);
      // General searches
      queries.push(`FPL differentials${positionStr} gameweek ${gameweek}`);
      queries.push(`FPL hidden gems${positionStr} ${year}`);
      queries.push(`fantasy premier league low ownership picks`);
      break;
    default:
      queries.push(`site:reddit.com/r/FantasyPL gameweek ${gameweek} rant discussion`);
      queries.push(`site:reddit.com/r/FantasyPL GW${gameweek} ${year}`);
      // General searches
      queries.push(`FPL gameweek ${gameweek} Reddit discussion`);
      queries.push(`fantasy premier league tips${positionStr} ${year}`);
      break;
  }

  return queries;
}

async function executeBraveSearch(
  query: string,
  apiKey: string,
  freshness: string = "pm"
): Promise<BraveSearchResult[]> {
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("count", "20");
  // freshness: pd=past day, pw=past week, pm=past month, py=past year
  url.searchParams.set("freshness", freshness);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as BraveSearchResponse;
  return data.web?.results ?? [];
}

function extractTrendingPlayers(
  results: BraveSearchResult[],
  players: FPLPlayer[],
  positionFilter: string | undefined
): TrendingPlayer[] {
  // Build player name lookup map
  const playerMap = new Map<string, FPLPlayer>();
  for (const player of players) {
    // Match by web_name (common usage), full name, and surname
    playerMap.set(player.web_name.toLowerCase(), player);
    playerMap.set(`${player.first_name} ${player.second_name}`.toLowerCase(), player);
    playerMap.set(player.second_name.toLowerCase(), player);
  }

  // Position mapping
  const positionTypeMap: Record<string, number> = {
    GK: 1,
    DEF: 2,
    MID: 3,
    FWD: 4,
  };

  // Track player mentions
  const mentions = new Map<
    string,
    {
      player: FPLPlayer;
      count: number;
      sentimentScores: Record<string, number>;
      reasons: Set<string>;
      sources: TrendingPlayerSource[];
    }
  >();

  for (const result of results) {
    const text = `${result.title} ${result.description}`.toLowerCase();

    // Check each player
    for (const [name, player] of playerMap) {
      // Skip if position filter doesn't match
      if (positionFilter && player.element_type !== positionTypeMap[positionFilter]) {
        continue;
      }

      // Check if player is mentioned using word boundary matching
      // This prevents matching "adli" inside "deadline" or "headline"
      if (name.length >= 3) {
        const nameRegex = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i");
        if (!nameRegex.test(text)) continue;
      } else {
        continue; // Skip names shorter than 3 characters
      }

      const key = player.web_name;

      if (!mentions.has(key)) {
        mentions.set(key, {
          player,
          count: 0,
          sentimentScores: { buy: 0, sell: 0, hold: 0, watch: 0 },
          reasons: new Set(),
          sources: [],
        });
      }

      const data = mentions.get(key)!;
      data.count++;

      // Analyze sentiment
      for (const [sentiment, patterns] of Object.entries(SENTIMENT_PATTERNS)) {
        for (const pattern of patterns) {
          if (text.includes(pattern)) {
            data.sentimentScores[sentiment]++;
            data.reasons.add(pattern);
          }
        }
      }

      // Determine source type
      let sourceType: TrendingPlayerSource["source_type"] = "other";
      if (result.url.includes("reddit.com")) sourceType = "reddit";
      else if (result.url.includes("twitter.com") || result.url.includes("x.com")) sourceType = "twitter";
      else if (
        result.url.includes("fantasyfootballscout") ||
        result.url.includes("fplstatistics") ||
        result.url.includes("thefplwire") ||
        result.url.includes("blog")
      )
        sourceType = "blog";

      // Avoid duplicate sources
      if (!data.sources.some((s) => s.url === result.url)) {
        data.sources.push({
          title: result.title,
          url: result.url,
          source_type: sourceType,
        });
      }
    }
  }

  // Convert to trending players array
  const trendingPlayers: TrendingPlayer[] = [];

  for (const [, data] of mentions) {
    // Determine dominant sentiment
    const scores = data.sentimentScores;
    const maxScore = Math.max(scores.buy, scores.sell, scores.hold, scores.watch);
    let sentiment: TrendingPlayer["sentiment"] = "watch";

    if (maxScore > 0) {
      if (scores.buy === maxScore) sentiment = "buy";
      else if (scores.sell === maxScore) sentiment = "sell";
      else if (scores.hold === maxScore) sentiment = "hold";
      else sentiment = "watch";
    }

    trendingPlayers.push({
      player_name: data.player.web_name,
      player_id: data.player.id,
      sentiment,
      mentions: data.count,
      reasons: Array.from(data.reasons).slice(0, 5),
      sources: data.sources.slice(0, 3),
    });
  }

  // Sort by mention count
  trendingPlayers.sort((a, b) => b.mentions - a.mentions);

  // Return top 10
  return trendingPlayers.slice(0, 10);
}

function extractHotTopics(results: BraveSearchResult[]): string[] {
  const topicPatterns = [
    { pattern: /salah\s+vs?\s+haaland/i, topic: "Salah vs Haaland captaincy" },
    { pattern: /\bdgw\b|double\s+gameweek/i, topic: "Double Gameweek planning" },
    { pattern: /\bbgw\b|blank\s+gameweek/i, topic: "Blank Gameweek navigation" },
    { pattern: /\bwc\b|wildcard/i, topic: "Wildcard timing" },
    { pattern: /\bfh\b|free\s+hit/i, topic: "Free Hit usage" },
    { pattern: /\bbb\b|bench\s+boost/i, topic: "Bench Boost strategy" },
    { pattern: /\btc\b|triple\s+captain/i, topic: "Triple Captain picks" },
    { pattern: /price\s+rise|price\s+change|price\s+drop/i, topic: "Price rises/falls" },
    { pattern: /template/i, topic: "Template team discussion" },
    { pattern: /rotation|roulette|bald\s+fraud/i, topic: "Rotation concerns" },
    { pattern: /injury|injured|out\s+for/i, topic: "Injury updates" },
    { pattern: /presser|press\s+conference/i, topic: "Press conference insights" },
    { pattern: /\brmt\b|rate\s+my\s+team/i, topic: "Rate My Team trends" },
    { pattern: /kneejerk|knee.?jerk/i, topic: "Kneejerk transfers warning" },
    { pattern: /\beo\b|effective\s+ownership/i, topic: "Effective ownership analysis" },
    { pattern: /chip\s+strateg/i, topic: "Chip strategy planning" },
    { pattern: /captaincy\s+poll|captain\s+poll/i, topic: "Captaincy poll results" },
  ];

  const foundTopics = new Set<string>();

  for (const result of results) {
    const text = `${result.title} ${result.description}`;

    for (const { pattern, topic } of topicPatterns) {
      if (pattern.test(text)) {
        foundTopics.add(topic);
      }
    }
  }

  return Array.from(foundTopics).slice(0, 5);
}
