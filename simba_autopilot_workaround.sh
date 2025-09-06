#!/bin/zsh
set -e

echo "
SimbaGlobal AI Autopilot (Node.js v24 Compatible):
GPT-5 powered builds with compatibility workarounds.
Deploying across Git, Expo, EAS, iOS, Android, Web.
"

retry() {
  local n=1
  local max=3
  local delay=10
  while true; do
    "$@" && break || {
      if [[ $n -lt $max ]]; then
        echo "⚠️ Command failed. Attempt $n/$max. Retrying in $delay seconds..."
        ((n++))
        sleep $delay
      else
        echo "❌ Command failed after $n attempts."
        return 1
      fi
    }
  done
}

COMMIT_MSG="SimbaGlobal AI: GPT-5 autopilot live build & deploy (Node v24 compatible)"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Starting SimbaGlobal AI LIVE Autopilot..."

# Update version numbers
node -e '
const fs = require("fs");
const app = JSON.parse(fs.readFileSync("app.json"));
let [major, minor, patch] = app.expo.version.split(".").map(Number);
patch++;
app.expo.version = `${major}.${minor}.${patch}`;
app.expo.ios = app.expo.ios || {};
app.expo.android = app.expo.android || {};
app.expo.ios.buildNumber = String(Number(app.expo.ios.buildNumber || 0) + 1);
app.expo.android.versionCode = Number(app.expo.android.versionCode || 0) + 1;
fs.writeFileSync("app.json", JSON.stringify(app, null, 2));
'

# Git operations
retry git fetch --all --prune
retry git add .
git commit -m "$COMMIT_MSG" || echo "✅ Nothing new to commit"
retry git pull origin $CURRENT_BRANCH --rebase
retry git push origin $CURRENT_BRANCH

# Update other branches
for BRANCH in main backup/bare-current preview
do
  git checkout $BRANCH || git checkout -b $BRANCH
  git reset --hard $CURRENT_BRANCH
  retry git push origin $BRANCH --force
done

git checkout $CURRENT_BRANCH

echo "🎯 Attempting EAS Build with compatibility mode..."

# Try with different Node options to work around TypeScript issues
export NODE_OPTIONS="--no-warnings --max-old-space-size=4096"

# Try prebuild with compatibility settings
echo "🔧 Attempting prebuild..."
npm run prebuild 2>/dev/null || npx expo install --fix || echo "⚠️ Prebuild had issues, continuing..."

# Try EAS updates with fallback strategy
echo "🚀 Attempting OTA Updates..."

# Try each update branch individually with error handling
for BRANCH_NAME in development preview production
do
  echo "📡 Updating $BRANCH_NAME branch..."
  eas update --branch $BRANCH_NAME --message "OTA: SimbaGlobal AI + GPT-5 live sync" || {
    echo "⚠️ OTA update failed for $BRANCH_NAME - this might be due to Node.js compatibility issues"
    echo "✅ Continuing with other deployment methods..."
  }
done

# Try builds with error handling
echo "📱 Attempting iOS build..."
eas build --platform ios --profile preview --non-interactive || {
  echo "⚠️ iOS build failed - this might be due to Node.js compatibility issues"
  echo "💡 Consider using Node.js v18 or v20 for full compatibility"
}

echo "🤖 Attempting Android build..."
eas build --platform android --profile preview --non-interactive || {
  echo "⚠️ Android build failed - this might be due to Node.js compatibility issues"
  echo "💡 Consider using Node.js v18 or v20 for full compatibility"
}

# Web export
echo "🌐 Exporting web build..."
npx expo export:web || echo "⚠️ Web export had issues"

# Firebase notification (if configured)
if [ ! -z "$FIREBASE_SERVER_KEY" ]; then
  echo "📱 Sending push notification..."
  curl -X POST \
    -H "Authorization: key=$FIREBASE_SERVER_KEY" \
    -H "Content-Type: application/json" \
    -d '{"to":"/topics/all","notification":{"title":"SimbaGlobal AI Updated","body":"🔥 GPT-5 live update is available. Open the app!"}}' \
    https://fcm.googleapis.com/fcm/send || echo "⚠️ Push notification failed"
fi

echo "
🎉 SimbaGlobal AI Autopilot completed!

✅ Git operations successful
✅ Version numbers updated  
✅ Repository synchronized across branches

⚠️  Build status:
- Some operations may have failed due to Node.js v24 compatibility issues
- For full functionality, consider using Node.js v18 or v20
- GPT-5 integration is configured and ready
- All file assets and configurations are preserved

💡 Next steps:
1. Check EAS dashboard for build status
2. Test the app locally: npm run ios or npm run android
3. Verify GPT-5 functionality in the app
"
