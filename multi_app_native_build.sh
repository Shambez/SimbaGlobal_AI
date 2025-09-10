#!/bin/bash

set -e
clear
echo "🦁 SimbaGlobal Multi-App Native Build & Deploy"
echo "==================================================="

LOOP_MODE=false
if [[ "$1" == "--loop" ]]; then
  LOOP_MODE=true
  echo "♻️ Running in continuous loop mode..."
fi

APP_NAME=$(basename "$PWD")
if [[ "$APP_NAME" == "Desktop" ]]; then
  echo "⚡ Running from Desktop — choose app to autopilot:"
  select APP_CHOICE in "SimbaGlobal_AI" "Ad_On_Mute"; do
    APP_NAME="$APP_CHOICE"
    cd ~/Desktop/$APP_NAME
    break
  done
fi

echo "📂 Current App: $APP_NAME"

build_and_deploy() {
  NODE_VERSION=$(node -v || echo "none")
  EXPO_VERSION=$(npx expo --version || echo "none")
  echo "🔧 Node: $NODE_VERSION | Expo: $EXPO_VERSION"

  if [[ "$NODE_VERSION" == v24* ]]; then
    echo "⚠️ Node v24 detected — switching to v20..."
    nvm install 20 && nvm use 20
  fi

  if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
  fi

  if [ ! -f ".env" ]; then
    echo "⚠️ Missing .env file — Firebase + Stripe keys required!"
  fi

  echo "📈 Bumping version..."
  jq '.expo.version |= (split(".") | .[2] = ((.[2] | tonumber) + 1 | tostring) | join("."))' app.json > app.tmp && mv app.tmp app.json
  VERSION=$(jq -r '.expo.version' app.json)
  echo "✅ Version updated: $VERSION"

  echo "📦 Syncing with GitHub..."
  git add .
  git commit -m "chore: autopilot build $VERSION ($APP_NAME)" || echo "⚠️ No changes to commit."
  git push origin main || echo "⚠️ Git push skipped."

  if [[ "$HOSTNAME" == *"warp-server"* ]]; then
    echo "🚀 Running on Warp Server — full deploy enabled"
  else
    echo "💻 Running locally — preview build only"
  fi

  echo "🚀 Building iOS..."
  EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --platform ios --profile preview --non-interactive || true

  echo "🤖 Building Android..."
  EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --platform android --profile preview --non-interactive || true

  echo "🌐 Exporting Web..."
  npx expo export:web || true

  EAS_OUTPUT=$(npx eas build:list --json --limit 2)
  IOS_URL=$(echo $EAS_OUTPUT | jq -r '.builds[] | select(.platform=="ios") | .artifacts.buildUrl' | head -n1)
  ANDROID_URL=$(echo $EAS_OUTPUT | jq -r '.builds[] | select(.platform=="android") | .artifacts.buildUrl' | head -n1)

  echo "📡 Deploying to Warp server..."
  ssh warp-server "mkdir -p ~/deploy/$APP_NAME && rm -rf ~/deploy/$APP_NAME/*"
  rsync -avz --exclude 'node_modules' ./ warp-server:~/deploy/$APP_NAME/

  echo "🎉 Multi-App Native Build Complete!"
  echo "==================================================="
  echo "📲 $APP_NAME v$VERSION ready:"
  echo "   iOS build: $IOS_URL"
  echo "   Android build: $ANDROID_URL"
  echo "📡 Server deployed to: warp-server:~/deploy/$APP_NAME/"
  echo "📸 Scan QR with Expo Go for instant install."
  echo "==================================================="
}

if [ "$LOOP_MODE" = true ]; then
  while true; do
    build_and_deploy
    echo "⏳ Waiting for changes... (Ctrl+C to stop)"
    sleep 60
    git fetch origin main
    if ! git diff --quiet HEAD origin/main; then
      echo "🔄 New changes detected — pulling + rebuilding..."
      git pull origin main
    fi
  done
else
  build_and_deploy
fi

if [ "$LOOP_MODE" = false ]; then
  echo "⚡ Starting background Warp autopilot on server..."
  ssh warp-server "cd ~/deploy/$APP_NAME && nohup warp ./multi_app_native_build.sh --loop >> warp_autopilot.log 2>&1 &"
  echo "✅ Background Warp autopilot started on server."
fi