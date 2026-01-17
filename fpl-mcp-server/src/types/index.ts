// FPL API Response Types

export interface FPLPlayer {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  element_type: number; // 1=GK, 2=DEF, 3=MID, 4=FWD
  now_cost: number; // Tenths of millions (48 = £4.8m)
  status: "a" | "d" | "i" | "u" | "s";
  chance_of_playing_next_round: number | null;
  ep_next: string;
  ep_this: string;
  form: string;
  total_points: number;
  minutes: number;
  selected_by_percent: string;
  news: string;
  news_added: string | null;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  bonus: number;
  bps: number;
  ict_index: string;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_per_90: number;
  expected_assists_per_90: number;
}

export interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
  strength: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

export interface FPLEvent {
  id: number;
  name: string;
  deadline_time: string;
  is_current: boolean;
  is_next: boolean;
  is_previous: boolean;
  finished: boolean;
  data_checked: boolean;
  average_entry_score: number;
  highest_scoring_entry: number | null;
  highest_score: number | null;
}

export interface FPLElementType {
  id: number;
  plural_name: string;
  plural_name_short: string;
  singular_name: string;
  singular_name_short: string;
  squad_select: number;
  squad_min_play: number;
  squad_max_play: number;
}

export interface BootstrapStatic {
  elements: FPLPlayer[];
  teams: FPLTeam[];
  events: FPLEvent[];
  element_types: FPLElementType[];
  total_players: number;
}

export interface FPLFixture {
  id: number;
  event: number | null;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  team_h_difficulty: number;
  team_a_difficulty: number;
  finished: boolean;
  started: boolean;
  kickoff_time: string | null;
  minutes: number;
  provisional_start_time: boolean;
}

export interface FPLPick {
  element: number;
  position: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  multiplier: number;
  selling_price?: number;
  purchase_price?: number;
}

export interface FPLChip {
  name: string;
  status_for_entry: "available" | "played";
  played_by_entry?: number[];
}

export interface FPLTransfers {
  cost: number;
  status: string;
  limit: number | null;
  made: number;
  bank: number;
  value: number;
}

export interface PicksResponse {
  active_chip: string | null;
  automatic_subs: unknown[];
  entry_history: {
    event: number;
    points: number;
    total_points: number;
    rank: number;
    overall_rank: number;
    bank: number;
    value: number;
    event_transfers: number;
    event_transfers_cost: number;
  };
  picks: FPLPick[];
}

export interface MyTeamResponse {
  picks: FPLPick[];
  chips: FPLChip[];
  transfers: FPLTransfers;
}

// Enriched types for tool responses

export interface EnrichedPlayer {
  id: number;
  name: string;
  full_name: string;
  team: string;
  team_name: string;
  position: "GK" | "DEF" | "MID" | "FWD";
  cost: number;
  selling_price?: number;
  purchase_price?: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  in_starting_xi: boolean;
  bench_order: number | null;
  ep_next: number;
  form: number;
  status: string;
  chance_of_playing: number | null;
  minutes: number;
  total_points: number;
  next_fixture?: {
    opponent: string;
    opponent_name: string;
    is_home: boolean;
    difficulty: number;
    kickoff: string | null;
  };
}

export interface EnrichedFixture {
  id: number;
  home_team: string;
  home_team_name: string;
  away_team: string;
  away_team_name: string;
  home_difficulty: number;
  away_difficulty: number;
  kickoff: string | null;
  started: boolean;
  finished: boolean;
  home_score: number | null;
  away_score: number | null;
}

export interface SquadResponse {
  squad: EnrichedPlayer[];
  starting_xi: EnrichedPlayer[];
  bench: EnrichedPlayer[];
  budget: {
    bank: number;
    free_transfers: number;
    total_squad_value: number;
    max_cost_increase: number;
  };
  captain: { id: number; name: string };
  vice_captain: { id: number; name: string };
  chips: {
    available: string[];
    active: string | null;
  };
  club_counts: Record<string, number>;
  data_source: {
    type: "authenticated" | "public_fallback";
    is_stale: boolean;
    warning?: string;
    gameweek_fetched?: number;
  };
}

export interface FixturesResponse {
  gameweek: number;
  deadline: string;
  is_current: boolean;
  is_finished: boolean;
  fixtures: EnrichedFixture[];
  teams_playing: string[];
  teams_blank: string[];
  filter?: { team: string };
}

export interface TeamFixtureDetail {
  opponent: string;
  opponent_name: string;
  is_home: boolean;
  fdr: number;
  kickoff: string | null;
}

export interface GWFixture {
  gw: number;
  opponent: string | null;
  opponent_name: string | null;
  is_home: boolean | null;
  fdr: number | null;
  kickoff: string | null;
  is_double: boolean;
  all_fixtures?: TeamFixtureDetail[];
}

export interface FixtureDifficultySummary {
  average_fdr: number;
  easy_fixtures: number;
  medium_fixtures: number;
  hard_fixtures: number;
  blank_gameweeks: number[];
  double_gameweeks: number[];
}

export interface FixtureDifficultyComparison {
  league_avg_fdr: number;
  rank_among_teams: number;
  better_than: string[];
}

export interface FixtureDifficultyResponse {
  team: string;
  team_name: string;
  analysis_range: { from: number; to: number };
  fixtures: GWFixture[];
  summary: FixtureDifficultySummary;
  comparison: FixtureDifficultyComparison;
  verdict: string;
}

export interface SearchPlayersResponse {
  query: Record<string, unknown>;
  total_matches: number;
  showing: number;
  players: Array<
    Omit<EnrichedPlayer, "is_captain" | "is_vice_captain" | "in_starting_xi" | "bench_order"> & {
      selected_by: string;
      next_fixtures: Array<{
        opponent: string;
        is_home: boolean;
        difficulty: number;
      }>;
    }
  >;
}

// Position mapping
export const POSITION_MAP: Record<number, "GK" | "DEF" | "MID" | "FWD"> = {
  1: "GK",
  2: "DEF",
  3: "MID",
  4: "FWD",
};

// Community Trends types

export interface TrendingPlayerSource {
  title: string;
  url: string;
  source_type: "reddit" | "twitter" | "blog" | "other";
}

export interface TrendingPlayer {
  player_name: string;
  player_id?: number;
  sentiment: "buy" | "sell" | "hold" | "watch";
  mentions: number;
  reasons: string[];
  sources: TrendingPlayerSource[];
}

export interface CommunityTrendsResponse {
  query: {
    topic?: string;
    position?: string;
    gameweek: number;
  };
  fetched_at: string;
  trending_players: TrendingPlayer[];
  hot_topics: string[];
  data_source: {
    search_provider: string;
    queries_made: number;
    warning?: string;
  };
}

// Helper function
export function toMillions(tenths: number): number {
  return Math.round((tenths / 10) * 10) / 10;
}
