#!/usr/bin/env bash
set -euo pipefail

echo "Auto-updating npm dependencies (patch & minor only)…"
npx --yes npm-check-updates@^17 -u --target minor

if [ -f package-lock.json ]; then
  npm ci || npm install
else
  npm install
fi

echo "Dependency refresh complete."
