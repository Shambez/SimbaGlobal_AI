#!/bin/bash

echo "== SimbaGlobal AI: Cleaning and Reinstalling Everything =="

echo "Removing node_modules, yarn.lock and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json yarn.lock

echo "Reinstalling NPM dependencies..."
npm install

echo "Reinstalling Expo and critical modules..."
npm install expo expo-router expo-linking expo-dev-client

echo "Cleaning Expo/Metro caches..."
npx expo start --clear

echo ""
echo "---- MANUAL CHECK: app.json ----"
echo "Make sure your app.json contains the following in the 'expo' root:"
echo '  "jsEngine": "hermes",'
echo '  "plugins": ["expo-linking"]'
echo ""
echo "Example:"
echo '{
  "expo": {
    "name": "SimbaGlobal AI",
    "slug": "simbaglobal-ai",
    "jsEngine": "hermes",
    "plugins": ["expo-linking"]
  }
}'
echo "--------------------------------"
echo ""
echo "== ALL DONE! Now: =="
echo "1. Run: npx expo run:ios"
echo "   (or 'eas build --profile development --platform ios' for physical device)"
echo "2. DO NOT use Expo Go! Use the dev client or actual app build."
echo "3. If error persists, send the terminal logs."