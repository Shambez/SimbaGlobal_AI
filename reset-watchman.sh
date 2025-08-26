#!/bin/bash

echo "🧹 Stopping & Removing Watchman Everywhere..."
brew services stop watchman || true
brew uninstall watchman || true
rm -rf /usr/local/Cellar/watchman /opt/homebrew/Cellar/watchman
rm -rf ~/.watchman* /usr/local/bin/watchman /opt/homebrew/bin/watchman
rm -rf /usr/local/var/run/watchman /private/tmp/watchman*

echo "🧼 Cleaning caches (metro, haste-map, expo, watchman logs)..."
rm -rf /tmp/haste-map-* /tmp/metro-* ~/.metro-cache ~/.expo
rm -rf ~/Library/Caches/watchman ~/Library/Logs/watchman
rm -rf ~/Library/Preferences/com.facebook.watchman.plist

echo "🔁 Reinstalling Watchman fresh..."
brew install watchman

echo "🔍 Verifying Watchman setup..."
watchman --version
watchman watch-del-all
watchman shutdown-server

echo "📁 Recreating .watchmanconfig..."
cd "$(dirname "$0")"
echo '{}' > .watchmanconfig

echo "📦 Resetting node_modules and npm cache..."
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

echo "🚀 Starting Expo with clean cache..."
npx expo start -c
