#!/usr/bin/env bash
# Store the Brave Search API key used by the get_community_trends MCP tool.
#
#   ./scripts/set-brave-key.sh            # prompt for the key (never echoed)
#   ./scripts/set-brave-key.sh --show     # show whether a key is set (masked)
#   ./scripts/set-brave-key.sh --remove   # delete the stored key
#
# The key is verified against the Brave API before it is saved, so a typo
# fails here rather than silently at the next gameweek evaluation.
#
# NOTE ON PERSISTENCE: ~/.fpl lives on this container's overlay filesystem,
# which is NOT one of the persisted mounts. A box rebuild wipes it. See the
# "Surviving a rebuild" note this script prints on success.

set -euo pipefail

FPL_DIR="$HOME/.fpl"
SECRETS_FILE="$FPL_DIR/secrets.env"
VAR="BRAVE_SEARCH_API_KEY"

die() { printf '%s\n' "$*" >&2; exit 1; }

current_key() {
  [ -f "$SECRETS_FILE" ] || return 1
  sed -n "s|^export ${VAR}=\"\(.*\)\"$|\1|p" "$SECRETS_FILE" | head -1
}

mask() {
  local k="$1"
  if [ "${#k}" -le 8 ]; then printf '%s' '********'; else printf '%s…%s' "${k:0:4}" "${k: -4}"; fi
}

case "${1-}" in
  --show)
    if key=$(current_key) && [ -n "$key" ]; then
      echo "✅ $VAR is set in $SECRETS_FILE  ($(mask "$key"))"
    else
      echo "❌ $VAR is not set in $SECRETS_FILE"
      exit 1
    fi
    exit 0
    ;;
  --remove)
    [ -f "$SECRETS_FILE" ] || die "No $SECRETS_FILE to edit."
    sed -i "/^export ${VAR}=/d" "$SECRETS_FILE"
    echo "🗑  Removed $VAR from $SECRETS_FILE"
    echo "   Run 'source $SECRETS_FILE' in a fresh shell and restart Claude Code."
    exit 0
    ;;
  -h|--help)
    sed -n '2,12p' "$0" | sed 's|^# \{0,1\}||'
    exit 0
    ;;
  "") ;;
  *) die "Unknown option: $1  (try --help)" ;;
esac

# ---- prompt ---------------------------------------------------------------
if key=$(current_key) && [ -n "$key" ]; then
  echo "A key is already stored ($(mask "$key")). Entering a new one replaces it."
  echo ""
fi

printf 'Brave Search API key (input hidden): '
IFS= read -rs NEW_KEY || true
printf '\n'
[ -n "${NEW_KEY:-}" ] || die "❌ No key entered. Nothing changed."

# Reject a pasted "export FOO=bar" line or stray quotes — easy mistake, and it
# would be written verbatim and then fail confusingly at request time.
NEW_KEY="${NEW_KEY#export ${VAR}=}"
NEW_KEY="${NEW_KEY%\"}"; NEW_KEY="${NEW_KEY#\"}"
NEW_KEY="${NEW_KEY%\'}"; NEW_KEY="${NEW_KEY#\'}"
case "$NEW_KEY" in
  *[[:space:]]*) die "❌ Key contains whitespace — that is almost certainly a bad paste." ;;
esac

# ---- verify before saving -------------------------------------------------
echo "🔎 Verifying against the Brave API..."
http=$(curl -s -o /tmp/brave-check.$$ -w '%{http_code}' --max-time 25 \
  "https://api.search.brave.com/res/v1/web/search?q=fpl+test&count=1" \
  -H "Accept: application/json" \
  -H "X-Subscription-Token: $NEW_KEY" || echo 000)
body=$(head -c 300 /tmp/brave-check.$$ 2>/dev/null || true)
rm -f /tmp/brave-check.$$

case "$http" in
  200) echo "   ✅ Key works." ;;
  # Brave answers an invalid subscription token with 422, not 401/403.
  401|403|422) die "   ❌ Brave rejected the key (HTTP $http) — check you pasted the whole thing. Not saved.
   $body" ;;
  429) echo "   ⚠️  Rate limited (HTTP 429) — the key is valid but throttled. Saving anyway." ;;
  000) die "   ❌ Could not reach the Brave API. Not saved (network problem, not a bad key)." ;;
  *)   die "   ❌ Unexpected response (HTTP $http). Not saved.
   $body" ;;
esac

# ---- save (idempotent) ----------------------------------------------------
mkdir -p "$FPL_DIR"
touch "$SECRETS_FILE"
if grep -q "^export ${VAR}=" "$SECRETS_FILE"; then
  tmp=$(mktemp)
  grep -v "^export ${VAR}=" "$SECRETS_FILE" > "$tmp"
  printf 'export %s="%s"\n' "$VAR" "$NEW_KEY" >> "$tmp"
  mv "$tmp" "$SECRETS_FILE"
else
  printf 'export %s="%s"\n' "$VAR" "$NEW_KEY" >> "$SECRETS_FILE"
fi
chmod 600 "$SECRETS_FILE"
unset NEW_KEY

echo ""
echo "💾 Saved to $SECRETS_FILE (chmod 600)"
echo ""
echo "Next:"
echo "  1. source ~/.fpl/secrets.env"
echo "  2. restart Claude Code so the MCP server picks it up"
echo ""
echo "⚠️  Surviving a rebuild"
echo "  ~/.fpl is on this container's overlay filesystem. Only /workspace,"
echo "  ~/.claude and ~/.tailscale are on the persistent volume — so a box"
echo "  REBUILD wipes this key (and the FPL refresh token next to it,"
echo "  meaning a fresh phone login)."
echo ""
echo "  To make it durable, add it to the box's fnox profile on beast and to"
echo "  the world's SECRETS list, then rebuild the box (fnox.toml is baked at"
echo "  build time — a restart is not enough). After that it arrives as an env"
echo "  var at boot, and everything here reads env first, so no code changes."
