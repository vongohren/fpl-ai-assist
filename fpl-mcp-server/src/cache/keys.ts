// Cache TTL values in milliseconds
export const TTL = {
  BOOTSTRAP: 24 * 60 * 60 * 1000, // 24 hours - player catalog rarely changes mid-week
  FIXTURES: 60 * 60 * 1000, // 1 hour - fixture times occasionally update
  MY_TEAM: 5 * 60 * 1000, // 5 minutes - transfers/chips might change
  LIVE: 30 * 1000, // 30 seconds - real-time during matches
  MANAGER_INFO: 60 * 60 * 1000, // 1 hour - rarely changes
  PICKS: 5 * 60 * 1000, // 5 minutes - same as my_team
  COMMUNITY_TRENDS: 6 * 60 * 60 * 1000, // 6 hours - community sentiment doesn't change often
} as const;

// Cache key generators
export const CACHE_KEYS = {
  bootstrap: () => "cache:bootstrap",
  fixtures: () => "cache:fixtures",
  fixturesGw: (gw: number) => `cache:fixtures:gw:${gw}`,
  myTeam: (managerId: number) => `cache:myteam:${managerId}`,
  picks: (managerId: number, gw: number) => `cache:picks:${managerId}:${gw}`,
  managerInfo: (managerId: number) => `cache:manager:${managerId}`,
  live: (gw: number) => `cache:live:${gw}`,
  communityTrends: (topic: string, gw: number) => `cache:trends:${topic}:${gw}`,
} as const;
