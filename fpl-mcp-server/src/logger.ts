import { appendFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";

const LOG_FILE = "./data/mcp-debug.log";

// Ensure log directory exists
const dir = dirname(LOG_FILE);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

export function log(level: "INFO" | "DEBUG" | "ERROR", message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const line = data
    ? `[${timestamp}] [${level}] ${message} ${JSON.stringify(data, null, 2)}\n`
    : `[${timestamp}] [${level}] ${message}\n`;

  // Write to file (Claude Code's instance)
  appendFileSync(LOG_FILE, line);

  // Also write to stderr (visible if running manually)
  // stdout is reserved for MCP protocol!
  process.stderr.write(line);
}

export function logToolCall(tool: string, args: unknown): void {
  log("INFO", `Tool called: ${tool}`, args);
}

export function logToolResult(tool: string, resultSummary: string): void {
  log("INFO", `Tool result: ${tool} → ${resultSummary}`);
}

export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  log("ERROR", `${context}: ${message}`);
}
