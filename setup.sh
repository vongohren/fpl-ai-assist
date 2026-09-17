#!/bin/bash
# FPL AI Assistant - Setup Script
# Run with: source setup.sh (to load env vars into current shell)
# Or just: ./setup.sh (env vars won't be loaded into current shell)
#
# Behavior (default = through the oauth-broker when this box has one, else
# mobile-assisted OAuth; no password is ever stored on this box):
#   - Broker (a spawn box with `oauth-token`): refreshes the access token through
#     the broker on beast, which holds the FPL refresh token. No phone. If there
#     is no grant yet, `--login` starts one: the broker's approve link is printed
#     and buzzed to the phone; you approve, log in, paste the 404 page's address
#     into that same broker page.
#   - Legacy (no broker): if a refresh token is stored in ~/.fpl/secrets.env,
#     refreshes silently; otherwise the one-off phone login (link + QR, paste
#     the resulting URL back into the terminal).
#
# Flags:
#   --login              force a fresh login (e.g. refresh token revoked)
#   --password           legacy: stored email/password + headless browser
#   --interactive, -i    legacy: headful browser on THIS machine (needs a display)
#
# For full onboarding (checks everything): npm --prefix fpl-mcp-server run onboard

set -e

# Resolve the server directory without cd-ing the caller's shell (this script is
# typically sourced, so any `cd` would leave the user inside fpl-mcp-server/).
if [ -n "${BASH_SOURCE-}" ]; then
  _FPL_SCRIPT_PATH="${BASH_SOURCE[0]}"
else
  _FPL_SCRIPT_PATH="$0"
fi
SERVER_DIR="$(cd "$(dirname "$_FPL_SCRIPT_PATH")/fpl-mcp-server" && pwd)"
unset _FPL_SCRIPT_PATH

FPL_CREDENTIALS_FILE="$HOME/.fpl/credentials.env"
FPL_SECRETS_FILE="$HOME/.fpl/secrets.env"
MODE="auto"
for arg in "$@"; do
  case "$arg" in
    --interactive|-i) MODE="interactive" ;;
    --save-credentials) MODE="save-credentials" ;;
    --password) MODE="password" ;;
    --login) MODE="login" ;;
  esac
done

# Check if node_modules exists
if [ ! -d "$SERVER_DIR/node_modules" ]; then
  echo "Installing dependencies..."
  npm --prefix "$SERVER_DIR" install
fi

# Only the legacy password/browser flows need a real Chromium. The default
# mobile flow is pure HTTP, so don't make everyone download a browser.
ensure_playwright() {
  if ! (cd "$SERVER_DIR" && npx playwright --version > /dev/null 2>&1); then
    echo "Installing Playwright browsers..."
    (cd "$SERVER_DIR" && npx playwright install chromium)
  fi
}

echo ""

if [ "$MODE" = "interactive" ]; then
  # Legacy: headful browser on THIS machine (needs a display).
  ensure_playwright
  npm --prefix "$SERVER_DIR" run setup
elif [ "$MODE" = "save-credentials" ]; then
  ensure_playwright
  npm --prefix "$SERVER_DIR" run save-credentials
  npm --prefix "$SERVER_DIR" run refresh-token
elif [ "$MODE" = "password" ]; then
  # Legacy: stored email/password + headless browser.
  ensure_playwright
  if [ -f "$FPL_CREDENTIALS_FILE" ]; then
    npm --prefix "$SERVER_DIR" run refresh-token
  else
    npm --prefix "$SERVER_DIR" run save-credentials
    npm --prefix "$SERVER_DIR" run refresh-token
  fi
elif [ "$MODE" = "login" ] && command -v oauth-token > /dev/null 2>&1; then
  # Broker: a fresh login through the oauth-broker (the link goes to the phone).
  "$SERVER_DIR/../scripts/auth-keepalive.sh" --login
elif [ "$MODE" = "login" ]; then
  # Force a fresh phone login even if a refresh token is stored.
  npm --prefix "$SERVER_DIR" run auth
elif command -v oauth-token > /dev/null 2>&1 && ! oauth-token status fpl 2>/dev/null | grep -q "(no grant)"; then
  # Broker happy path: the access token is refreshed through the broker on
  # beast; nothing rotating lives on this box.
  "$SERVER_DIR/../scripts/auth-keepalive.sh"
elif grep -q "FPL_REFRESH_TOKEN" "$FPL_SECRETS_FILE" 2>/dev/null; then
  # Default happy path: silent refresh, no browser and no phone needed.
  npm --prefix "$SERVER_DIR" run auth:refresh
else
  # First run: box prints a link/QR, you finish the login on your phone.
  echo "🔐 No refresh token yet — starting the one-off phone login."
  echo ""
  npm --prefix "$SERVER_DIR" run auth
fi

# Source the secrets file to load env vars into current shell
if [ -f "$FPL_SECRETS_FILE" ]; then
  echo ""
  echo "🔄 Loading environment variables..."
  # shellcheck source=/dev/null
  source "$FPL_SECRETS_FILE"
  echo "✅ Environment variables loaded into current shell."

  # Show what was loaded (without exposing full values)
  if [ -n "$FPL_X_API_AUTH" ]; then
    echo "   FPL_X_API_AUTH: (set)"
  fi
  if [ -n "$FPL_MANAGER_ID" ]; then
    echo "   FPL_MANAGER_ID: $FPL_MANAGER_ID"
  fi
  if [ -n "$BRAVE_SEARCH_API_KEY" ]; then
    echo "   BRAVE_SEARCH_API_KEY: (set)"
  fi
fi
