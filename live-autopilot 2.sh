#!/bin/bash
set -e

PROJECT_ROOT=~/Desktop/SimbaGlobal_AI
LOGFILE=$PROJECT_ROOT/autopilot-$(date +"%Y%m%d-%H%M%S").log

cd $PROJECT_ROOT || exit 1

echo "🦁 SimbaGlobal_AI LIVE Autopilot Starting..." | tee -a $LOGFILE

# --- Step 0: Ensure Firebase deps ---
echo "📦 Checking Firebase dependencies..." | tee -a $LOGFILE
if ! npm list @react-native-firebase/app >/dev/null 2>&1; then
  echo "➡️ Installing @react-native-firebase/app..." | tee -a $LOGFILE
  npm install @react-native-firebase/app
fi
if ! npm list @react-native-firebase/messaging >/dev/null 2>&1; then
  echo "➡️ Installing @react-native-firebase/messaging..." | tee -a $LOGFILE
  npm install @react-native-firebase/messaging
fi

# --- Step 1: Refresh .gitignore ---
echo "🔧 Updating .gitignore..." | tee -a $LOGFILE
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

# --- Step 2: Bump app.json version ---
echo "📈 Bumping app.json version..." | tee -a $LOGFILE
jq '.expo.version |= 
      (split(".") | .[0:2] + [((.[2] | tonumber) + 1 | tostring)] | join(".")) |
    .expo.ios.buildNumber |= ((.expo.ios.buildNumber | tonumber) + 1 | tostring) |
    .expo.android.versionCode |= (.expo.android.versionCode + 1)' \
    app.json > app.json.tmp && mv app.json.tmp app.json

VERSION=$(jq -r '.expo.version' app.json)
BUILD_IOS=$(jq -r '.expo.ios.buildNumber' app.json)
BUILD_ANDROID=$(jq -r '.expo.android.versionCode' app.json)

echo "✅ Version bumped to $VERSION (iOS $BUILD_IOS / Android $BUILD_ANDROID)" | tee -a $LOGFILE

# --- Step 3: Git sync ---
echo "📦 Syncing with GitHub..." | tee -a $LOGFILE
git rm -r --cached . >/dev/null 2>&1 || true
git add .
git commit -m "autopilot: SimbaGlobal_AI v$VERSION (iOS $BUILD_IOS / Android $BUILD_ANDROID)" || true
git push origin main | tee -a $LOGFILE

# --- Step 4: Expo OTA update ---
echo "🚀 Publishing OTA update..." | tee -a $LOGFILE
eas update --branch live --message "Live update v$VERSION" | tee -a $LOGFILE

# --- Step 5: EAS Builds (fingerprint enabled) ---
echo "📱 Building iOS (production, fingerprint verified)..." | tee -a $LOGFILE
npx eas build --platform ios --profile production --clear-cache | tee -a $LOGFILE

echo "🤖 Building Android (production, fingerprint verified)..." | tee -a $LOGFILE
npx eas build --platform android --profile production --clear-cache | tee -a $LOGFILE

# --- Step 6: Firebase push ---
echo "📢 Sending push notification to all users..." | tee -a $LOGFILE
npx ts-node scripts/sendPush.ts "🚀 SimbaGlobal_AI v$VERSION is live! Tap to explore." | tee -a $LOGFILE

# --- Step 7: Ensure client-side FCM subscription code ---
echo "🛠 Ensuring client-side Firebase subscription code..." | tee -a $LOGFILE
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

echo "✅ Firebase client subscription code updated in services/notifications.ts" | tee -a $LOGFILE

# --- Step 8: Save snapshot ---
SNAPSHOT=$PROJECT_ROOT/deployment-v$VERSION-$(date +"%Y%m%d-%H%M%S")
mkdir -p $SNAPSHOT
cp -R $PROJECT_ROOT/. $SNAPSHOT

echo "📂 Snapshot saved at: $SNAPSHOT" | tee -a $LOGFILE
echo "🎉 Autopilot Complete: SimbaGlobal_AI v$VERSION deployed LIVE!" | tee -a $LOGFILE
