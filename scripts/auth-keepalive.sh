#!/usr/bin/env bash
# =============================================================================
# auth-keepalive — keep the FPL grant usable, and shout early when it isn't.
#
#   scripts/auth-keepalive.sh            refresh if needed, alert on failure
#   scripts/auth-keepalive.sh --status   report token state, change nothing
#
# Two failure modes have actually bitten us, and they need different answers:
#
#   1. The ACCESS token expires every ~8h. Harmless if something refreshes it,
#      but we kept discovering it mid-task. A scheduled run fixes that.
#   2. The REFRESH token gets revoked SERVER-SIDE. Observed twice (2026-08-23,
#      2026-08-28) with the stored token's own exp still months away, so this is
#      not expiry — the session was invalidated upstream, most likely by a fresh
#      login elsewhere (the FPL app). No amount of refreshing prevents that.
#
# So this does NOT promise the login never dies. It promises we find out within
# one interval instead of twelve hours before a deadline, which is the part that
# actually cost us a gameweek.
# =============================================================================
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AUTH="$HERE/fpl-mcp-server/scripts/mobile-auth.ts"
SECRETS="$HOME/.fpl/secrets.env"

alert() {
  local msg="$1"
  echo "$msg" >&2
  # brain-send delivers a prompt to a Claude session on this box; absent off-box.
  if command -v brain-send >/dev/null 2>&1; then
    brain-send "FPL auth needs you: $msg Run 'npx tsx fpl-mcp-server/scripts/mobile-auth.ts --start' in /workspace/fpl-ai-assist, send Snorre the URL, then finish with --finish '<pasted-url>'. Until then every authenticated FPL tool returns stale data." >/dev/null 2>&1 || true
  fi
}

token_state() {
  [ -f "$SECRETS" ] || { echo "no-secrets"; return; }
  python3 - "$SECRETS" <<'PY'
import re,sys,json,base64,time
s=open(sys.argv[1]).read()
def grab(k):
    m=re.search(r'export %s="([^"]+)"'%k,s); return m.group(1) if m else None
a=grab("FPL_X_API_AUTH"); r=grab("FPL_REFRESH_TOKEN")
if not r: print("no-refresh-token"); raise SystemExit
def exp(t):
    t=t[7:] if t.startswith("Bearer ") else t
    try: return json.loads(base64.urlsafe_b64decode(t.split('.')[1]+'==')).get('exp')
    except Exception: return None
ea=exp(a) if a else None
left=int(ea-time.time()) if ea else -1
print("ok %d"%left)
PY
}

STATE="$(token_state)"
if [ "${1-}" = "--status" ]; then
  case "$STATE" in
    no-secrets)        echo "❌ no ~/.fpl/secrets.env — phone login required"; exit 1 ;;
    no-refresh-token)  echo "❌ no refresh token stored — phone login required"; exit 1 ;;
    ok\ *)
      _l="${STATE#ok }"
      if [ "$_l" -gt 0 ]; then
        echo "✅ access token valid for $(( _l / 60 )) min"; exit 0
      else
        echo "⚠️  access token EXPIRED $(( -_l / 60 )) min ago — a refresh is due"; exit 2
      fi ;;
  esac
fi

case "$STATE" in
  no-secrets|no-refresh-token)
    alert "No refresh token on the box (${STATE})."
    exit 1 ;;
esac

# Refresh whenever under ~2h remain, so a scheduled 6-hourly run never leaves a
# window where the token dies between fires.
LEFT="${STATE#ok }"
if [ "$LEFT" -gt 7200 ]; then
  echo "token healthy — ${LEFT}s left, no refresh needed"
  exit 0
fi

echo "token has ${LEFT}s left — refreshing..."
if out="$(cd "$HERE" && npx tsx "$AUTH" --refresh --force 2>&1)"; then
  echo "$out" | grep -E '^✅' || echo "$out"
  exit 0
fi

echo "$out" >&2
if echo "$out" | grep -qi 'invalid_grant\|does not exist\|expired'; then
  alert "The refresh token was REJECTED by the auth server (invalid_grant) — the grant is dead and only a phone login can restore it."
else
  alert "Refresh failed for an unexpected reason (network? API change?)."
fi
exit 1
