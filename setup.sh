#!/bin/bash
# FPL AI Assistant - Setup Script
# Run this to authenticate with FPL and capture your token

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
