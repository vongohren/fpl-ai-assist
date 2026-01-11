import type {
  BootstrapStatic,
  FPLFixture,
  PicksResponse,
  MyTeamResponse,
  FPLPlayer,
  FPLTeam,
  FPLEvent,
} from "../types/index.js";

export interface FPLAuthConfig {
  cookie?: string;
  xApiAuth?: string;
}

export class FPLApiClient {
  private baseUrl = "https://fantasy.premierleague.com/api";
  private cookie?: string;
  private xApiAuth?: string;

  constructor(auth?: FPLAuthConfig) {
    this.cookie = auth?.cookie;
    this.xApiAuth = auth?.xApiAuth;
  }

  hasAuth(): boolean {
    return Boolean(this.cookie || this.xApiAuth);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "User-Agent": "FPL-MCP-Server/1.0 (+https://fantasy.premierleague.com)",
      Origin: "https://fantasy.premierleague.com",
      Referer: "https://fantasy.premierleague.com/",
      "x-requested-with": "XMLHttpRequest",
    };

    if (this.cookie) {
      headers["Cookie"] = this.cookie;
    }

    if (this.xApiAuth) {
      headers["X-Api-Authorization"] = this.xApiAuth;
    }

    return headers;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new FPLApiError(`FPL API error: ${response.status} ${response.statusText}`, response.status);
    }

    return response.json() as Promise<T>;
  }

  async getBootstrapStatic(): Promise<BootstrapStatic> {
    return this.fetch<BootstrapStatic>("bootstrap-static/");
  }

  async getFixtures(): Promise<FPLFixture[]> {
    return this.fetch<FPLFixture[]>("fixtures/");
  }

  async getFixturesForGameweek(gw: number): Promise<FPLFixture[]> {
    return this.fetch<FPLFixture[]>(`fixtures/?event=${gw}`);
  }

  async getManagerPicks(managerId: number, gw: number): Promise<PicksResponse> {
    return this.fetch<PicksResponse>(`entry/${managerId}/event/${gw}/picks/`);
  }

  async getMyTeam(managerId: number): Promise<MyTeamResponse> {
    if (!this.hasAuth()) {
      throw new FPLApiError("Authentication required for my-team endpoint. Set FPL_COOKIE or FPL_X_API_AUTH", 401);
    }
    return this.fetch<MyTeamResponse>(`my-team/${managerId}/`);
  }

  async getManagerInfo(managerId: number): Promise<{ id: number; name: string; player_first_name: string; player_last_name: string }> {
    return this.fetch(`entry/${managerId}/`);
  }
}

export class FPLApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "FPLApiError";
  }
}

// Helper functions

export function buildPlayerLookup(players: FPLPlayer[]): Map<number, FPLPlayer> {
  return new Map(players.map((p) => [p.id, p]));
}

export function buildTeamLookup(teams: FPLTeam[]): Map<number, FPLTeam> {
  return new Map(teams.map((t) => [t.id, t]));
}

export function getCurrentGameweek(events: FPLEvent[]): number {
  const current = events.find((e) => e.is_current);
  if (current) return current.id;

  const next = events.find((e) => e.is_next);
  if (next) return next.id;

  // Fallback to last event
  return events[events.length - 1]?.id ?? 1;
}

export function getNextGameweek(events: FPLEvent[]): number {
  const next = events.find((e) => e.is_next);
  if (next) return next.id;

  const current = events.find((e) => e.is_current);
  if (current) return Math.min(current.id + 1, 38);

  return 1;
}
