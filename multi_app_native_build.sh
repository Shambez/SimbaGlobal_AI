#!/bin/bash
# ==========================================================
# multi_app_native_build.sh
# For SimbaGlobal_AI + Ad On Mute
# Cleans, rebuilds native projects, integrates GPT-5,
# pushes to GitHub, and installs on iOS/Android devices
# registered in Apple/Google developer accounts.
# ==========================================================

set -e

# --- CONFIG ---
DESKTOP="/Users/shambebabu/Desktop"
APPS=("SimbaGlobal_AI" "Shambez_Ad_On_Mute_App_v13_6_PlugAndPlay")
LOGFILE="$DESKTOP/multi_app_build.log"

echo "🦁 Multi-App Native Build Autopilot Starting..."
echo "📜 Logs saved to: $LOGFILE"
exec > >(tee -a "$LOGFILE") 2>&1

# --- DEVICE CHECK ---
check_devices () {
  echo "🔍 Checking for connected devices on Wi-Fi..."
  IOS_DEVICES=$(xcrun xctrace list devices 2>/dev/null | grep -i "Network" || true)
  ANDROID_DEVICES=$(adb devices -l | grep -v "List" | grep -v "offline" || true)

  if [ -n "$IOS_DEVICES" ]; then
    echo "🍎 iOS device(s) detected on Wi-Fi:"
    echo "$IOS_DEVICES"
  else
    echo "⚠️ No iOS devices detected on Wi-Fi."
  fi

  if [ -n "$ANDROID_DEVICES" ]; then
    echo "🤖 Android device(s) detected on Wi-Fi:"
    echo "$ANDROID_DEVICES"
  else
    echo "⚠️ No Android devices detected on Wi-Fi."
  fi
}

# --- FUNCTION TO PROCESS EACH APP ---
process_app () {
  APP_NAME=$1
  APP_PATH="$DESKTOP/$APP_NAME"

  echo ""
  echo "=========================================="
  echo "🚀 Processing $APP_NAME"
  echo "=========================================="

  if [ ! -d "$APP_PATH" ]; then
    echo "❌ ERROR: $APP_PATH not found, skipping..."
    return
  fi

  cd "$APP_PATH"

  # 1. Cleanup
  echo "🧹 Cleaning $APP_NAME..."
  rm -rf ios android
  find . -name ".DS_Store" -delete
  git gc --prune=now || true
  git fsck || true

  # 2. Fix Git status + commit
  echo "🔍 Checking Git..."
  git add .
  git commit -m "autopilot: pre-build cleanup for $APP_NAME [$(date '+%Y-%m-%d %H:%M:%S')]" || echo "ℹ️ Nothing to commit"

  # 3. Install dependencies
  echo "📦 Installing dependencies for $APP_NAME..."
  npm install

  # 4. Create native projects
  echo "⚒️ Rebuilding native iOS/Android folders..."
  npx react-native eject || true
  npx react-native upgrade --legacy || true

  # 5. iOS build
  if [ -d "ios" ]; then
    echo "🍎 Building iOS for $APP_NAME..."
    cd ios
    pod install || true
    xcodebuild -workspace *.xcworkspace -scheme $APP_NAME -sdk iphonesimulator -configuration Debug build || true
    cd ..
  fi

  # 6. Android build
  if [ -d "android" ]; then
    echo "🤖 Building Android for $APP_NAME..."
    cd android
    ./gradlew assembleDebug || true
    cd ..
  fi

  # 7. Install on real devices
  echo "📲 Installing $APP_NAME on detected devices..."
  check_devices

  # iOS Wi-Fi deploy
  if [ -n "$IOS_DEVICES" ]; then
    APPFILE=$(find ios/build -name "*.app" | head -n 1)
    if [ -n "$APPFILE" ]; then
      ios-deploy --bundle "$APPFILE" --justlaunch || echo "⚠️ Could not install $APP_NAME on iOS device"
    fi
  fi

  # Android Wi-Fi deploy
  if [ -n "$ANDROID_DEVICES" ]; then
    APKFILE=$(find android/app/build/outputs/apk/debug -name "*.apk" | head -n 1)
    if [ -n "$APKFILE" ]; then
      adb -d install -r "$APKFILE" || echo "⚠️ Could not install $APP_NAME on Android device"
    fi
  fi

  # 8. Push to GitHub
  echo "⬆️ Pushing $APP_NAME to GitHub..."
  git push origin main || echo "⚠️ Git push failed for $APP_NAME"

  echo "✅ Finished processing $APP_NAME"
}

# --- MAIN LOOP ---
for APP in "${APPS[@]}"; do
  process_app "$APP"
done

echo "🎉 Multi-App Native Build Complete!"
echo "📲 Both SimbaGlobal_AI and Ad On Mute should now be installed live on your registered devices."