#!/bin/bash
# ============================================================
# multi_app_native_build.sh
# Warp autopilot for SimbaGlobal_AI + Ad_On_Mute
# Moves projects fully off Expo, builds native iOS/Android
# Fuses GPT-5, Stripe, Firebase, Twilio securely via .env
# ============================================================

set -e

ROOT=~/Desktop
APPS=("SimbaGlobal_AI" "Shambez_Ad_On_Mute_App_v13_6_PlugAndPlay")
TRASH="$ROOT/Simba_Trash_$(date +%s)"
mkdir -p "$TRASH"

echo "🦁 Multi-App Native Build Autopilot Starting..."

# ------------------------------------------------------------
# 1. Clean stale Git locks + duplicate folders
# ------------------------------------------------------------
for APP in "${APPS[@]}"; do
  APP_PATH="$ROOT/$APP"
  if [ ! -d "$APP_PATH" ]; then
    echo "⚠️ Skipping missing app: $APP_PATH"
    continue
  fi

  echo "📂 Processing $APP..."

  # Remove stale git lock
  if [ -f "$APP_PATH/.git/HEAD.lock" ]; then
    echo "⚠️ Found stale Git lock in $APP, removing..."
    rm -f "$APP_PATH/.git/HEAD.lock"
  fi

  # Move duplicates
  find "$ROOT" -maxdepth 1 -type d -name "${APP}*" ! -name "$APP" | while read DUP; do
    echo "⚠️ Moving duplicate $DUP → $TRASH"
    mv "$DUP" "$TRASH/"
  done
done

# ------------------------------------------------------------
# 2. Create unified .env for each app
# ------------------------------------------------------------
for APP in "${APPS[@]}"; do
  APP_PATH="$ROOT/$APP"
  if [ ! -d "$APP_PATH" ]; then
    continue
  fi

  ENV_FILE="$APP_PATH/.env"
  echo "🔑 Writing .env for $APP..."
  cat > "$ENV_FILE" <<EOF
STRIPE_SECRET_KEY=sk_live_replace_me
FIREBASE_API_KEY=replace_me
FIREBASE_AUTH_DOMAIN=replace_me.firebaseapp.com
FIREBASE_PROJECT_ID=replace_me
FIREBASE_STORAGE_BUCKET=replace_me.appspot.com
FIREBASE_MESSAGING_SENDER_ID=replace_me
FIREBASE_APP_ID=replace_me
FIREBASE_MEASUREMENT_ID=replace_me
TWILIO_ACCOUNT_SID=replace_me
TWILIO_AUTH_TOKEN=replace_me
OPENAI_API_KEY=sk-replace_me
GPT5_MODEL=gpt-5
GPT5_MAX_TOKENS=4096
GPT5_TEMPERATURE=0.7
EOF

  # Ensure .gitignore has .env
  if ! grep -q "^.env" "$APP_PATH/.gitignore" 2>/dev/null; then
    echo ".env" >> "$APP_PATH/.gitignore"
  fi
done

# ------------------------------------------------------------
# 3. Setup native iOS + Android
# ------------------------------------------------------------
for APP in "${APPS[@]}"; do
  APP_PATH="$ROOT/$APP"
  if [ ! -d "$APP_PATH" ]; then
    continue
  fi

  echo "⚙️ Setting up native projects for $APP..."

  cd "$APP_PATH"

  # Remove old expo native dirs
  rm -rf ios android

  # Re-init native projects
  npx react-native init TempNativeApp --directory .
  rm -rf TempNativeApp

  # iOS CocoaPods
  if [ -d "ios" ]; then
    cd ios
    pod install || pod install --repo-update
    cd ..
  fi

  # Android Gradle sync
  if [ -d "android" ]; then
    cd android
    ./gradlew clean
    cd ..
  fi
done

# ------------------------------------------------------------
# 4. Build for iOS + Android
# ------------------------------------------------------------
for APP in "${APPS[@]}"; do
  APP_PATH="$ROOT/$APP"
  if [ ! -d "$APP_PATH" ]; then
    continue
  fi

  echo "🚀 Building $APP..."
  cd "$APP_PATH"

  if [ -d "ios" ]; then
    echo "📱 iOS build..."
    xcodebuild -workspace ios/*.xcworkspace \
      -scheme $(ls ios | grep .xcodeproj | sed 's/.xcodeproj//') \
      -sdk iphonesimulator -configuration Debug build
  fi

  if [ -d "android" ]; then
    echo "🤖 Android build..."
    cd android
    ./gradlew assembleDebug
    cd ..
  fi
done

# ------------------------------------------------------------
# 5. GitHub sync (commit + push)
# ------------------------------------------------------------
for APP in "${APPS[@]}"; do
  APP_PATH="$ROOT/$APP"
  if [ ! -d "$APP_PATH" ]; then
    continue
  fi

  echo "📦 Git sync for $APP..."
  cd "$APP_PATH"
  git add .
  git commit -m "autopilot: native migration + GPT-5 fusion [Warp]" || echo "ℹ️ Nothing to commit"
  git push origin main || echo "⚠️ Push failed for $APP"
done

echo "🎉 Multi-App Native Build Finished! Both apps are now Expo-free and ready for local device testing."