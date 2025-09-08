#!/bin/bash
set -e

cd ~/Desktop/SimbaGlobal_AI || exit 1

echo "🔧 Refreshing .gitignore..."
# (same .gitignore overwrite block as before)

echo "📈 Bumping version..."
# (same jq bump logic for expo.version, ios.buildNumber, android.versionCode)

VERSION=$(jq -r '.expo.version' app.json)

echo "✅ New version $VERSION"

# Git
git rm -r --cached . >/dev/null 2>&1 || true
git add .
git commit -m "autopilot: v$VERSION live update" || true
git push origin main

# Expo OTA
echo "🚀 Publishing OTA update..."
eas update --branch live --message "Live update v$VERSION"

# Build new binaries
echo "📱 Building iOS..."
EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --platform ios --profile production --clear-cache
echo "🤖 Building Android..."
EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --platform android --profile production --clear-cache

# Firebase push notify (assumes you have firebase CLI + service account JSON)
echo "📢 Sending push notification to users..."
npx ts-node scripts/sendPush.ts "🚀 SimbaGlobal_AI v$VERSION is now live! Tap to explore."