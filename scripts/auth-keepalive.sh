#!/usr/bin/env bash
# =============================================================================
# auth-keepalive — keep the FPL grant usable, and shout early when it isn't.
#
#   scripts/auth-keepalive.sh            refresh if needed, alert on failure
#   scripts/auth-keepalive.sh --status   report token state, change nothing
#   scripts/auth-keepalive.sh --login    start a fresh login (the doorbell)
#
# TWO MODES, picked by what is on the box:
#
#   broker  `oauth-token` exists and holds an `fpl` grant. The oauth-broker on
#           beast owns the FPL refresh token (it rotates on every use, and the
#           broker is its only holder); this box asks it for a fresh ACCESS
#           token and writes that into ~/.fpl/secrets.env as FPL_X_API_AUTH.
#           Scheduled every 30 min: PingOne's access tokens are 60 min now.
#           A dead grant is recovered by `oauth-token login fpl --force`: it
#           prints + ntfy-sends the broker's approve link, the human approves on
#           the phone, logs in to the Premier League in a new tab, pastes the
#           404 page's address into the SAME broker page — no page of our own.
#   legacy  no broker grant: mobile-auth.ts refreshes with the refresh token in
#           ~/.fpl/secrets.env (the pre-2026-09-17 shape, still the path off the
#           fleet). Kept so this script works anywhere.
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
# actually cost us a gameweek — and, in broker mode, that the link to fix it is
# already on the phone when we do.
# =============================================================================
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AUTH="$HERE/fpl-mcp-server/scripts/mobile-auth.ts"
SECRETS="$HOME/.fpl/secrets.env"
FORENSICS="$HOME/.fpl/auth-forensics.jsonl"
LOCK="$HOME/.fpl/keepalive.lock"
PROVIDER=fpl

# ---------------------------------------------------------------------------- mode
broker_mode() {
  command -v oauth-token >/dev/null 2>&1 || return 1
  case "$(oauth-token status "$PROVIDER" 2>/dev/null)" in
    *"(no grant)"*|"") return 1 ;;
    *) return 0 ;;
  esac
}

# Append one non-secret row describing the CURRENT grant: which PingOne SSO
# session it belongs to, which login created it, how old it is, and the ids of
# the tokens in play. Every field comes out of the stored JWTs, so this costs no
# network call and spends no rotation.
#
# Why it exists: until now a death could only be placed somewhere inside a 6h
# window, and never attributed to a particular session or login. The tokens
# are bound to an SSO session id (sid), so logging sid + auth_time turns "it
# died some time today" into "session X, born at Y, died at age Z". In broker
# mode the refresh token is not on this box, so refresh_jti is null there.
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
    if broker_mode || command -v oauth-token >/dev/null 2>&1; then
      brain-send "FPL auth needs you: $msg Run 'scripts/auth-keepalive.sh --login' in /workspace/fpl-ai-assist — it prints the broker's approve link (and buzzes the phone); Snorre approves, logs in to the Premier League in the new tab and pastes the 404 page's address into that same page. Until then every authenticated FPL tool returns stale data." >/dev/null 2>&1 || true
    else
      brain-send "FPL auth needs you: $msg Run 'npx tsx fpl-mcp-server/scripts/mobile-auth.ts --start' in /workspace/fpl-ai-assist, send Snorre the URL, then finish with --finish '<pasted-url>'. Until then every authenticated FPL tool returns stale data." >/dev/null 2>&1 || true
    fi
  fi
}

token_state() {
  [ -f "$SECRETS" ] || { echo "no-secrets"; return; }
  python3 - "$SECRETS" "$( broker_mode && echo broker || echo legacy )" <<'PY'
import re,sys,json,base64,time
s=open(sys.argv[1]).read(); mode=sys.argv[2]
def grab(k):
    m=re.search(r'export %s="([^"]+)"'%k,s); return m.group(1) if m else None
a=grab("FPL_X_API_AUTH"); r=grab("FPL_REFRESH_TOKEN")
if mode=="legacy" and not r: print("no-refresh-token"); raise SystemExit
if mode=="broker" and not a: print("no-access-token"); raise SystemExit
def exp(t):
    t=t[7:] if t.startswith("Bearer ") else t
    try: return json.loads(base64.urlsafe_b64decode(t.split('.')[1]+'==')).get('exp')
    except Exception: return None
ea=exp(a) if a else None
left=int(ea-time.time()) if ea else -1
print("ok %d"%left)
PY
}

# ------------------------------------------------------------- broker: the file
# Rewrite ~/.fpl/secrets.env with a fresh access token, KEEPING the non-token
# lines (manager id, Brave key) and DROPPING any legacy FPL_REFRESH_TOKEN — the
# broker is the one holder of the chain now, and a stale copy here is exactly
# the "two holders of one rotating refresh token" failure we already paid for.
# Atomic (tmp + mv, 0600): the MCP server re-reads this file on every mtime
# change and must never see a half-written one.
write_broker_secrets() { # write_broker_secrets <access-token>
  local tok="$1" manager brave tmp
  manager="$(grep -oE '^export FPL_MANAGER_ID="[^"]+"' "$SECRETS" 2>/dev/null | head -1 | sed -E 's/^export FPL_MANAGER_ID="([^"]+)"/\1/')"
  brave="$(grep -oE '^export BRAVE_SEARCH_API_KEY="[^"]+"' "$SECRETS" 2>/dev/null | head -1 | sed -E 's/^export BRAVE_SEARCH_API_KEY="([^"]+)"/\1/')"
  if [ -z "$manager" ]; then
    manager="$(curl -sS -m 10 -H "X-Api-Authorization: Bearer $tok" https://fantasy.premierleague.com/api/me/ 2>/dev/null \
      | python3 -c 'import json,sys; print((json.load(sys.stdin).get("player") or {}).get("entry") or "")' 2>/dev/null)"
  fi
  mkdir -p "$(dirname "$SECRETS")"
  tmp="$(mktemp "$(dirname "$SECRETS")/.secrets.env.XXXXXX")"
  {
    echo "# FPL Secrets (written by scripts/auth-keepalive.sh, broker mode)"
    echo "# The refresh token lives on the oauth-broker (beast), not here."
    echo "# Refresh: scripts/auth-keepalive.sh   Re-login: scripts/auth-keepalive.sh --login"
    echo "export FPL_X_API_AUTH=\"Bearer $tok\""
    [ -z "$manager" ] || echo "export FPL_MANAGER_ID=\"$manager\""
    [ -z "$brave" ] || echo "export BRAVE_SEARCH_API_KEY=\"$brave\""
  } > "$tmp"
  chmod 600 "$tmp" && mv -f "$tmp" "$SECRETS"
}

broker_login() {
  echo "🔐 Starting an FPL login through the oauth-broker (the link goes to the phone too)…"
  # --force: replace whatever grant is stored, live or dead. Blocks until the
  # human is done or the broker's window (20 min for fpl) closes.
  if ! oauth-token login "$PROVIDER" --force; then
    echo "❌ the login did not complete" >&2
    return 1
  fi
  local tok
  if tok="$(oauth-token get "$PROVIDER")"; then
    write_broker_secrets "$tok"
    record login_ok
    echo "✅ Logged in through the broker — $SECRETS updated"
    return 0
  fi
  echo "❌ the grant was stored but no access token came back" >&2
  return 1
}

# ------------------------------------------------------------------- --status
STATE="$(token_state)"
if [ "${1-}" = "--status" ]; then
  if broker_mode; then echo "mode: broker — $(oauth-token status "$PROVIDER")"; else echo "mode: legacy (no broker grant on this box)"; fi
  case "$STATE" in
    no-secrets)        echo "❌ no ~/.fpl/secrets.env — login required"; exit 1 ;;
    no-refresh-token)  echo "❌ no refresh token stored — phone login required"; exit 1 ;;
    no-access-token)   echo "❌ no access token in the file yet — run the keepalive"; exit 1 ;;
    ok\ *)
      _l="${STATE#ok }"
      if [ "$_l" -gt 0 ]; then
        echo "✅ access token valid for $(( _l / 60 )) min"; exit 0
      else
        echo "⚠️  access token EXPIRED $(( -_l / 60 )) min ago — a refresh is due"; exit 2
      fi ;;
  esac
fi

# One rotation at a time. Rotation is on (each refresh consumes the refresh
# token and issues the next), and replaying a consumed refresh token is a
# documented way to have the provider revoke the entire grant family. In broker
# mode the broker holds the token, but two concurrent `oauth-token get --force`
# calls would still race it into an invalid_grant that marks the grant DEAD on
# this box — so the lock stays. A second runner steps aside rather than racing.
mkdir -p "$(dirname "$LOCK")"
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "another keepalive run holds the lock — stepping aside, no rotation spent"
  exit 0
fi

# ------------------------------------------------------------------- --login
if [ "${1-}" = "--login" ]; then
  if command -v oauth-token >/dev/null 2>&1; then
    broker_login; exit $?
  fi
  echo "no oauth-token on this box — use the legacy phone login: npx tsx $AUTH --start / --finish" >&2
  exit 1
fi

# ------------------------------------------------------------------- broker run
if broker_mode; then
  # Every fire refreshes through the broker (--force), even when the access
  # token still looks healthy: an access token is a signed JWT that keeps
  # verifying until its own exp no matter what happened to the session behind
  # it, so a refresh is the ONLY way to learn the grant is alive. Every
  # 30 min since the access token shrank to 60 min (2026-09-17).
  record probe
  tok="$(oauth-token get "$PROVIDER" --force 2>"$HOME/.fpl/keepalive.err")"; rc=$?
  if [ "$rc" -eq 0 ]; then
    write_broker_secrets "$tok"
    record refresh_ok
    echo "✅ access token refreshed through the broker — $(oauth-token status "$PROVIDER")"
    exit 0
  fi
  cat "$HOME/.fpl/keepalive.err" >&2 2>/dev/null
  case "$rc" in
    3)  record refresh_failed "invalid_grant"
        alert "The broker refused to refresh the FPL grant — it is dead upstream (a login elsewhere, most likely). Starting a fresh login now; approve the link on the phone."
        broker_login; exit $? ;;
    2)  record refresh_failed "no-grant"
        alert "No FPL grant on the box. Starting a fresh login now; approve the link on the phone."
        broker_login; exit $? ;;
    4)  record refresh_failed "broker-unreachable"
        alert "The oauth-broker on beast is unreachable and the cached FPL token has expired."; exit 1 ;;
    *)  record refresh_failed "rc-$rc"
        alert "Refresh through the broker failed for an unexpected reason (rc=$rc)."; exit 1 ;;
  esac
fi

# ------------------------------------------------------------------- legacy run
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
