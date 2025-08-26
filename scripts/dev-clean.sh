#!/bin/bash
echo "🧹 Cleaning and starting fresh dev build..."

watchman watch-del-all
rm -rf /tmp/metro-* /tmp/haste-map-*
rm -rf node_modules
npm install
npx expo start -c