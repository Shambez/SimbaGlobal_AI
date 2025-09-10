#!/bin/bash
set -euo pipefail

# 🧹 Git Auto-Cleaner
if [ -d ".git" ]; then
  pkill -9 git || true
  find .git -type f -name "*.lock" -exec rm -f {} \;
  rm -f .git/refs/.DS_Store
  rm -f ".git/refs/heads/main 2" ".git/refs/heads/main 3" || true
fi

ROOT_DIR="$HOME/Desktop"
LOG_FILE="$ROOT_DIR/multi_app_build.log"
APPS=("SimbaGlobal_AI" "Shambez_Ad_On_Mute_App_v13_6_PlugAndPlay")

say(){ echo -e "$1"; }

with_timeout() {
  local dur=$1; shift
  ( "$@" & pid=$!; (sleep $dur && kill -HUP $pid) 2>/dev/null & watcher=$!; wait $pid 2>/dev/null; kill -9 $watcher 2>/dev/null ) || true
}

inject_gpt5(){
  local APP=$1
  local APP_PATH="$ROOT_DIR/$APP"
  say "🤖 GPT-5 infusion in $APP..."
  grep -rl "openai" "$APP_PATH" | while read -r file; do
    if ! grep -q "gpt-5" "$file"; then
      LC_ALL=C sed -i.bak 's/gpt-4/gpt-5/g' "$file" && rm -f "$file.bak"
    fi
  done
}

migrate_expo(){
  local APP=$1
  local APP_PATH="$ROOT_DIR/$APP"
  say "🔄 Migrating Expo APIs in $APP..."
  grep -rl "expo-speech" "$APP_PATH" | while read -r file; do
    LC_ALL=C sed -i.bak 's|import \* as Speech from .expo-speech.|import Tts from "react-native-tts";|g' "$file"
    LC_ALL=C sed -i.bak 's/Speech.speak/Tts.speak/g' "$file"
    rm -f "$file.bak"
  done
  grep -rl "expo-av" "$APP_PATH" | while read -r file; do
    LC_ALL=C sed -i.bak 's|expo-av|react-native-sound|g' "$file"
    rm -f "$file.bak"
  done
}

distribute_app(){
  local APP=$1
  local APP_PATH="$ROOT_DIR/$APP"
  local APP_NAME=$(echo "$APP" | tr '[:upper:]' '[:lower:]')

  cd "$APP_PATH"
  say "📦 Packaging $APP for install..."

  # iOS
  cd ios
  xcodebuild -workspace *.xcworkspace -scheme * -sdk iphoneos -configuration Release archive -archivePath build/$APP_NAME.xcarchive
  xcodebuild -exportArchive -archivePath build/$APP_NAME.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/
  mv build/*.ipa "$ROOT_DIR/${APP_NAME}.ipa" || true
  cd ..

  # Android
  cd android
  ./gradlew assembleRelease
  mv app/build/outputs/apk/release/app-release.apk "$ROOT_DIR/${APP_NAME}.apk" || true
  cd ..

  # Web build
  npm run web-build || true
  mv web-build "$ROOT_DIR/${APP_NAME}_web" || true

  # Serve via HTTP
  cd "$ROOT_DIR"
  (python3 -m http.server 8081 >/dev/null 2>&1 &)

  # QR codes
  echo "http://$(hostname -I | awk '{print $1}'):8081/${APP_NAME}.apk" > "${APP_NAME}_android_url.txt"
  echo "http://$(hostname -I | awk '{print $1}'):8081/${APP_NAME}.ipa" > "${APP_NAME}_ios_url.txt"
  qrencode -o "${APP_NAME}_android_qr.png" < "${APP_NAME}_android_url.txt"
  qrencode -o "${APP_NAME}_ios_qr.png" < "${APP_NAME}_ios_url.txt"

  say "✅ $APP done. Scan ${APP_NAME}_*.png to install."
}

# Main
for APP in "${APPS[@]}"; do
  APP_PATH="$ROOT_DIR/$APP"
  [ ! -d "$APP_PATH" ] && say "⚠️ Skipping $APP (not found)" && continue

  say "=========================================="
  say "🚀 Processing $APP"
  say "=========================================="

  cd "$APP_PATH"

  # Git sync
  git add . || true
  git commit -m "autopilot: $APP update [$(date)]" || true
  git pull --rebase origin clean-slate || true
  git push origin clean-slate || true

  # Fix Expo → RN
  migrate_expo "$APP"

  # Install deps
  rm -rf node_modules
  npm install

  # iOS pods
  cd ios && pod install && cd ..

  # GPT-5 infusion
  inject_gpt5 "$APP"

  # Build
  with_timeout 900 npm run build || true

  # Package + QR
  distribute_app "$APP"

  say "✅ Finished $APP"
done

say "🎉 Multi-App Native Build Autopilot Complete!"