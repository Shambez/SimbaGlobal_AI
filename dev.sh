#!/bin/bash
set -e
APP_NAME=""
if [ -f "app.json" ]; then
  if command -v jq &> /dev/null; then
    APP_NAME=$(jq -r '.name' app.json)
  else
    APP_NAME=$(grep -o '"name": *"[^"]*"' app.json | head -1 | cut -d'"' -f4)
  fi
fi
if [ -z "$APP_NAME" ]; then
  APP_NAME=$(basename "$PWD")
fi
echo ""
echo "🔧 [$APP_NAME] - Full Environment Bootstrap Starting..."
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
  nvm install 20 || nvm install 18
  nvm use 20 || nvm use 18
else
  echo "⚠️  nvm not found, using system node (should be v18 or v20)"
fi
node -v
rm -rf node_modules package-lock.json yarn.lock .expo .expo-shared ios android build
npm install --legacy-peer-deps
npx expo doctor --fix-dependencies || true
npm dedupe || true
npx expo install || true
[ -f "eslint.config.js" ] && npm run lint || echo "No ESLint config found, skipping lint."
[ -f "jest.config.js" ] && npm run test || echo "No Jest config found, skipping tests."
echo ""
npx expo prebuild --platform all --clean
echo ""
if [ -d "ios" ]; then
  cd ios
  pod install --repo-update || true
  cd ..
fi
echo ""
echo "🚀 [$APP_NAME] is ready for development!"
npx expo start --clear