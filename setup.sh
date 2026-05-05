#!/bin/bash
# FPL AI Assistant - Setup Script
# Run with: source setup.sh (to load env vars into current shell)
# Or just: ./setup.sh (env vars won't be loaded into current shell)
#
# Behavior:
#   - If ~/.fpl/credentials.env exists, runs headless login (refresh-token).
#   - Otherwise, prompts you to save credentials, then runs headless login.
#   - Pass --interactive to force the manual browser-login flow instead.
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
MODE="auto"
for arg in "$@"; do
  case "$arg" in
    --interactive|-i) MODE="interactive" ;;
    --save-credentials) MODE="save-credentials" ;;
  esac
done

# Check if node_modules exists
if [ ! -d "$SERVER_DIR/node_modules" ]; then
  echo "Installing dependencies..."
  npm --prefix "$SERVER_DIR" install
fi

# Check if playwright browsers are installed (npx resolves from cwd, so use a subshell)
if ! (cd "$SERVER_DIR" && npx playwright --version > /dev/null 2>&1); then
  echo "Installing Playwright browsers..."
  (cd "$SERVER_DIR" && npx playwright install chromium)
fi

echo ""

if [ "$MODE" = "interactive" ]; then
  # Manual browser login (user types credentials in the browser)
  npm --prefix "$SERVER_DIR" run setup
elif [ "$MODE" = "save-credentials" ]; then
  npm --prefix "$SERVER_DIR" run save-credentials
  npm --prefix "$SERVER_DIR" run refresh-token
elif [ -f "$FPL_CREDENTIALS_FILE" ]; then
  echo "🔐 Found stored credentials at $FPL_CREDENTIALS_FILE"
  echo "   Running headless login..."
  echo ""
  npm --prefix "$SERVER_DIR" run refresh-token
else
  echo "🔐 No stored credentials found at $FPL_CREDENTIALS_FILE"
  echo "   Saving credentials so future runs can log in headlessly."
  echo ""
  npm --prefix "$SERVER_DIR" run save-credentials
  echo ""
  npm --prefix "$SERVER_DIR" run refresh-token
fi

# Source the secrets file to load env vars into current shell
FPL_SECRETS_FILE="$HOME/.fpl/secrets.env"
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
