#!/bin/bash

echo "🚀 Block 5b — Building & Publishing SimbaGlobal_AI with OTA QR (Fixed Version)"

# 1. Run builds locally
echo "📱 Building iOS..."
npx expo run:ios --device

echo "🤖 Building Android..."
android/gradlew assembleDebug -p android

# Note: You'll need to log in to EAS first with: eas login
# 2. Publish OTA update to Preview branch
echo "📤 Publishing OTA update..."
npx eas-cli update --branch preview --message "SimbaGlobal_AI Block 5b OTA update"

# 3. Build installable artifacts
echo "🏗️  Building installable artifacts..."
npx eas-cli build --platform all --profile preview --non-interactive

# 4. Save QR codes for family testing
echo "💾 Saving QR codes..."
mkdir -p deployment/qr-codes
npx eas-cli build:list --json --limit 3 > deployment/qr-codes/builds.json
npx eas-cli build:list --json --limit 3 | jq -r '.[].artifacts.buildUrl' > deployment/qr-codes/urls.txt

echo "✅ Block 5b complete — SimbaGlobal_AI ready for install via QR codes."
echo "📋 Don't forget to:"
echo "   1. Run 'eas login' first if not already authenticated"
echo "   2. Check deployment/qr-codes/ folder for QR codes"