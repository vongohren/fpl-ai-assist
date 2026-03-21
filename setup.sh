#!/bin/bash
# FPL AI Assistant - Setup Script
# Run with: source setup.sh (to load env vars into current shell)
# Or just: ./setup.sh (env vars won't be loaded into current shell)
#
# For full onboarding (checks everything): cd fpl-mcp-server && npm run onboard
# For headless token refresh: cd fpl-mcp-server && npm run refresh-token

set -e

cd "$(dirname "$0")/fpl-mcp-server"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Check if playwright browsers are installed
if ! npx playwright --version > /dev/null 2>&1; then
  echo "Installing Playwright browsers..."
  npx playwright install chromium
fi

echo ""
npm run setup

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
