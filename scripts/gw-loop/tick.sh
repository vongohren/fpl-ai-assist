#!/usr/bin/env bash
# =============================================================================
# fpl-gw-loop tick — hourly wrapper around tick.mjs. See tick.mjs for the
# state machine and README.md for the phases.
#
#   scripts/gw-loop/tick.sh              one tick
#   scripts/gw-loop/tick.sh --dry-run    decide, print, change nothing
#   scripts/gw-loop/tick.sh --status     print season/gw/phase state and exit
#
# Registered as:
#   jobctl add "7 * * * *" fpl-gw-loop -- /workspace/fpl-ai-assist/scripts/gw-loop/tick.sh
# =============================================================================
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE="${FPL_LOOP_STATE:-/workspace/.spawn/fpl-gw-loop}"
mkdir -p "$STATE"

# One tick at a time. A slow FPL API plus an hourly cron must never overlap and
# double-spawn an agent; the latch in state.json is the second line of defence.
exec 9>"$STATE/tick.lock"
if ! flock -n 9; then
  printf '{"ts":"%s","gw":null,"event":"tick-skipped","detail":"previous tick still running"}\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$STATE/events.jsonl"
  exit 0
fi

exec node "$HERE/tick.mjs" "$@"
