import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export class FPLCache {
  private db: Database.Database;

  constructor(dbPath: string = "./data/cache.db") {
    // Ensure data directory exists
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_expires ON cache(expires_at);
    `);

    // Clean up expired entries on startup
    this.cleanup();
  }

  get<T>(key: string): T | null {
    const now = Date.now();
    const row = this.db
      .prepare("SELECT value FROM cache WHERE key = ? AND expires_at > ?")
      .get(key, now) as { value: string } | undefined;

    if (!row) return null;

    try {
      return JSON.parse(row.value) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    const now = Date.now();
    const expiresAt = now + ttlMs;

    this.db
      .prepare(
        `INSERT OR REPLACE INTO cache (key, value, expires_at, created_at)
         VALUES (?, ?, ?, ?)`
      )
      .run(key, JSON.stringify(value), expiresAt, now);
  }

  invalidate(key: string): void {
    this.db.prepare("DELETE FROM cache WHERE key = ?").run(key);
  }

  invalidatePattern(pattern: string): void {
    // Use LIKE for pattern matching
    this.db.prepare("DELETE FROM cache WHERE key LIKE ?").run(pattern);
  }

  cleanup(): void {
    const now = Date.now();
    this.db.prepare("DELETE FROM cache WHERE expires_at <= ?").run(now);
  }

  clear(): void {
    this.db.prepare("DELETE FROM cache").run();
  }

  stats(): { entries: number; size: number } {
    const count = this.db.prepare("SELECT COUNT(*) as count FROM cache").get() as { count: number };
    const size = this.db.prepare("SELECT SUM(LENGTH(value)) as size FROM cache").get() as { size: number | null };

    return {
      entries: count.count,
      size: size.size ?? 0,
    };
  }

  close(): void {
    this.db.close();
  }
}

// Cache-through pattern helper
export async function cachedFetch<T>(
  cache: FPLCache,
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const fresh = await fetcher();
  cache.set(key, fresh, ttl);
  return fresh;
}
