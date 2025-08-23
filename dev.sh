#!/bin/bash

set -e  # Exit immediately on error

APP_NAME=""
if [ -f "app.json" ]; then
  # Try to get app name from app.json
  APP_NAME=$(cat app.json | grep -o '"name": *"[^"]*"' | head -1 | cut -d'"' -f4)
fi
if [ -z "$APP_NAME" ]; then
  APP_NAME=$(basename "$PWD")
fi

echo ""
echo "🔧 [$APP_NAME] - Full Environment Bootstrap Starting..."

# ----- NODE VERSION -----
echo "🔄 Checking Node version (nvm preferred)..."
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
  nvm install 20 || nvm install 18
  nvm use 20 || nvm use 18
else
  echo "⚠️  nvm not found, using system node (should be v18 or v20)"
fi
node -v

echo "🧹 Cleaning previous builds and caches..."
rm -rf node_modules package-lock.json yarn.lock .expo .expo-shared ios android build

echo "📦 Installing dependencies (with legacy-peer-deps for RN/Expo)..."
npm install --legacy-peer-deps

echo "🔎 Checking Expo setup & auto-fixing issues..."
npx expo doctor --fix-dependencies || true
npm dedupe || true
npx expo install || true

echo "🧪 Linting and testing..."
[ -f "eslint.config.js" ] && npm run lint || echo "No ESLint config found, skipping lint."
[ -f "jest.config.js" ] && npm run test || echo "No Jest config found, skipping tests."

echo ""
echo "📲 Prebuilding native code for iOS and Android..."
npx expo prebuild --platform all --clean

echo ""
echo "📱 iOS pod install (if on MacOS & iOS folder exists)..."
if [ -d "ios" ]; then
  cd ios
  pod install --repo-update || true
  cd ..
fi

echo ""
echo "🚀 [$APP_NAME] is ready for development!"
echo "    - For dev client: npx expo run:ios or npx expo run:android"
echo "    - For QR code: npx expo start --dev-client"
echo "    - For web: npx expo start --web"
echo "    - For production: Use EAS build"

# Automatically start Expo dev server (comment out if you want manual control)
npx expo start --clear

