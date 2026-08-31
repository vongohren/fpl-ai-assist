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
FORENSICS="$HOME/.fpl/auth-forensics.jsonl"
LOCK="$HOME/.fpl/keepalive.lock"

# Append one non-secret row describing the CURRENT grant: which PingOne SSO
# session it belongs to, which login created it, how old it is, and the ids of
# the tokens about to be used. Every field comes out of the stored JWTs, so this
# costs no network call and spends no rotation.
#
# Why it exists: until now a death could only be placed somewhere inside a 6h
# window, and never attributed to a particular session or login. The refresh
# token is bound to an SSO session id (sid), so logging sid + auth_time turns
# "it died some time today" into "session X, born at Y, died at age Z".
# The jti pair is the other half: rotation means each refresh consumes one
# refresh token and issues the next, so a repeated refresh_jti across two runs
# is a REPLAY, which is a documented way to get the whole grant family revoked.
record() {
  python3 - "$SECRETS" "$FORENSICS" "$1" "${2-}" <<'PY'
import base64, json, os, re, sys, time

secrets, ledger, event = sys.argv[1], sys.argv[2], sys.argv[3]
note = sys.argv[4] if len(sys.argv) > 4 else ""

try:
    blob = open(secrets).read()
except OSError:
    blob = ""

def grab(key):
    m = re.search(r'export %s="([^"]+)"' % key, blob)
    return m.group(1) if m else None

def claims(token):
    if not token:
        return {}
    token = token[7:] if token.startswith("Bearer ") else token
    parts = token.split(".")
    if len(parts) < 2:
        return {}
    try:
        return json.loads(base64.urlsafe_b64decode(parts[1] + "=="))
    except Exception:
        return {}

access = claims(grab("FPL_X_API_AUTH"))
refresh = claims(grab("FPL_REFRESH_TOKEN"))
auth_time = refresh.get("auth_time") or access.get("auth_time")

row = {
    "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "event": event,
    "sid": refresh.get("sid") or access.get("sid"),
    "auth_time": auth_time,
    "grant_age_s": int(time.time() - auth_time) if auth_time else None,
    "refresh_jti": refresh.get("jti"),
    "access_jti": access.get("jti"),
    "access_exp": access.get("exp"),
    "refresh_exp": refresh.get("exp"),
}
if note:
    row["note"] = note

os.makedirs(os.path.dirname(ledger), exist_ok=True)
with open(ledger, "a") as fh:
    fh.write(json.dumps(row) + "\n")

born = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(auth_time)) if auth_time else "?"
age = row["grant_age_s"]
print("   grant: sid=%s born=%s age=%s refresh_jti=%s"
      % (row["sid"], born, ("%dh%02dm" % (age // 3600, age % 3600 // 60)) if age else "?", row["refresh_jti"]))
PY
}

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

# One rotation at a time. Rotation is on (each refresh consumes the stored
# refresh token and issues a new one), and replaying a consumed refresh token is
# a documented way to have the provider revoke the entire grant family. Two runs
# overlapping — the 6-hourly fire and someone's manual `jobctl run` — would do
# exactly that, so a second runner steps aside rather than racing.
mkdir -p "$(dirname "$LOCK")"
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "another keepalive run holds the lock — stepping aside, no rotation spent"
  exit 0
fi

case "$STATE" in
  no-secrets|no-refresh-token)
    alert "No refresh token on the box (${STATE})."
    exit 1 ;;
esac

# Every fire refreshes, even when the access token still looks healthy.
#
# This used to short-circuit above 7200s left, which quietly made the job blind:
# the ONLY way to learn whether the grant is still alive is to spend a rotation,
# because an access token is a signed JWT that keeps verifying until its own exp
# no matter what happened to the session behind it. There is no cheap ping. So a
# short-circuited run proved nothing, and on a 6-hourly schedule that left gaps
# of ~12h in which a revocation was invisible.
#
# The cost is smaller than it looks: the old behaviour already rotated 3 times a
# day (sometimes 4), because at a 6h cadence the token is usually near or past
# its 8h expiry anyway. Forcing every fire makes it exactly 4. In exchange every
# death is bounded to 6h and attributable to a session via the ledger above.
LEFT="${STATE#ok }"
if [ "$LEFT" -gt 7200 ]; then
  echo "token has ${LEFT}s left — refreshing anyway, to prove the grant is alive"
else
  echo "token has ${LEFT}s left — refreshing..."
fi
record probe
if out="$(cd "$HERE" && npx tsx "$AUTH" --refresh --force 2>&1)"; then
  echo "$out" | grep -E '^✅' || echo "$out"
  record refresh_ok
  exit 0
fi

echo "$out" >&2
record refresh_failed "$(echo "$out" | grep -oiE 'invalid_grant|does not exist|expired' | head -1)"
if echo "$out" | grep -qi 'invalid_grant\|does not exist\|expired'; then
  alert "The refresh token was REJECTED by the auth server (invalid_grant) — the grant is dead and only a phone login can restore it."
else
  alert "Refresh failed for an unexpected reason (network? API change?)."
fi
exit 1
