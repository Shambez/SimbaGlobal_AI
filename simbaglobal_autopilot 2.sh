#!/bin/bash
set -e

PROJECT_ROOT=~/Desktop/SimbaGlobal_AI
LOGFILE=$PROJECT_ROOT/autopilot-$(date +"%Y%m%d-%H%M%S").log

cd $PROJECT_ROOT || exit 1

echo "🦁 SimbaGlobal_AI LIVE Autopilot Starting..." | tee -a $LOGFILE

# --- Step 0: Ensure Firebase deps ---
echo "📦 Checking Firebase dependencies..." | tee -a $LOGFILE
if ! npm list @react-native-firebase/app >/dev/null 2>&1; then
  npm install @react-native-firebase/app
fi
if ! npm list @react-native-firebase/messaging >/dev/null 2>&1; then
  npm install @react-native-firebase/messaging
fi

# --- Step 1: Refresh .gitignore ---
cat > .gitignore <<'EOF'
.DS_Store
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock*.json
.expo/
.expo-shared/
dist/
web-build/
*.expo*
*.packager
.env
.env.*
env.json
env.local
credentials.json
.idea/
.vscode/
*.iml
.venv/
.nvmrc
ios/build/
ios/Pods/
*.xcuserstate
*.xcworkspace/xcuserdata/
*.xcscmblueprint
*.xccheckout
*.xcsettings
*.xcodeproj/project.xcworkspace/xcuserdata/
DerivedData/
android/.gradle/
android/app/build/
*.apk
*.keystore
*.jks
*.tar.gz
*.tgz
*.zip
*.ipa
*.aab
*.bak
*~
Thumbs.db
EOF

# --- Step 2: Robust version bump ---
VERSION=""
BUILD_IOS=""
BUILD_ANDROID=""

if [ -f app.json ]; then
  echo "📈 Bumping app.json version..." | tee -a $LOGFILE

  if jq empty app.json >/dev/null 2>&1; then
    jq '.expo.version |= 
          (split(".") | .[0:2] + [((.[2] | tonumber) + 1 | tostring)] | join(".")) |
        .expo.ios.buildNumber |= ((.expo.ios.buildNumber | tonumber) + 1 | tostring) |
        .expo.android.versionCode |= (.expo.android.versionCode + 1)' \
        app.json > app.json.tmp && mv app.json.tmp app.json

    VERSION=$(jq -r '.expo.version' app.json)
    BUILD_IOS=$(jq -r '.expo.ios.buildNumber' app.json)
    BUILD_ANDROID=$(jq -r '.expo.android.versionCode' app.json)
  else
    echo "⚠️ app.json not valid JSON, using regex fallback..." | tee -a $LOGFILE
    sed -i '' -E 's/"version": *"([0-9]+)\.([0-9]+)\.([0-9]+)"/"version": "\1.\2.$((\3+1))"/' app.json
    VERSION=$(grep -o '"version": *"[^"]*"' app.json | head -1 | cut -d '"' -f4)
    BUILD_IOS="manual"
    BUILD_ANDROID="manual"
  fi

elif [ -f app.config.js ]; then
  echo "📈 Updating app.config.js version..." | tee -a $LOGFILE
  sed -i '' -E 's/version: *"([0-9]+)\.([0-9]+)\.([0-9]+)"/version: "\1.\2.$((\3+1))"/' app.config.js
  VERSION=$(grep -o 'version: *"[^"]*"' app.config.js | head -1 | cut -d '"' -f2)
fi

echo "✅ Version bumped to $VERSION (iOS $BUILD_IOS / Android $BUILD_ANDROID)" | tee -a $LOGFILE

# --- Step 3: Git sync ---
git rm -r --cached . >/dev/null 2>&1 || true
git add .

if ! git diff --cached --quiet; then
  git commit -m "autopilot: SimbaGlobal_AI v$VERSION (iOS $BUILD_IOS / Android $BUILD_ANDROID)" | tee -a $LOGFILE
  git push origin main | tee -a $LOGFILE
else
  echo "ℹ️ No changes to commit, skipping push" | tee -a $LOGFILE
fi

# --- Step 4: OTA update ---
eas update --branch live --message "Live update v$VERSION" | tee -a $LOGFILE

# --- Step 5: EAS builds ---
npx eas build --platform ios --profile production --clear-cache | tee -a $LOGFILE
npx eas build --platform android --profile production --clear-cache | tee -a $LOGFILE

# --- Step 6: Firebase push ---
npx ts-node scripts/sendPush.ts "🚀 SimbaGlobal_AI v$VERSION is live! Tap to explore." | tee -a $LOGFILE

# --- Step 7: Ensure client subscription ---
mkdir -p $PROJECT_ROOT/services
cat > $PROJECT_ROOT/services/notifications.ts <<'EOF'
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

export function useFCMSubscription() {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          console.log("✅ FCM Token:", token);
          await messaging().subscribeToTopic("all");
          console.log("📢 Subscribed to topic: all");
        }
      } catch (err) {
        console.error("❌ FCM setup failed", err);
      }
    };

    setupFCM();
  }, []);
}
EOF

# --- Step 8: Snapshot ---
SNAPSHOT=$PROJECT_ROOT/deployment-v$VERSION-$(date +"%Y%m%d-%H%M%S")
mkdir -p $SNAPSHOT
cp -R $PROJECT_ROOT/. $SNAPSHOT

echo "📂 Snapshot saved at: $SNAPSHOT" | tee -a $LOGFILE
echo "🎉 Autopilot Complete: SimbaGlobal_AI v$VERSION deployed LIVE!" | tee -a $LOGFILE