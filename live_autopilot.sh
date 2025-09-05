#!/bin/zsh
set -e

COMMIT_MSG="SimbaGlobal AI: GPT-5 autopilot sync, build, deploy"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Starting SimbaGlobal AI Autopilot with GPT-5 integration..."

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

git fetch --all --prune
git add -A
git commit -m "$COMMIT_MSG" || echo "Nothing new to commit"
git pull origin $CURRENT_BRANCH --rebase
git push origin $CURRENT_BRANCH

for BRANCH in main backup/bare-current preview
do
  git checkout $BRANCH || git checkout -b $BRANCH
  git reset --hard $CURRENT_BRANCH
  git push origin $BRANCH --force
done

git checkout $CURRENT_BRANCH

echo "Cleaning dependency caches..."
rm -rf node_modules .expo .expo-shared
watchman watch-del-all || true
npm install

echo "Running Expo prebuild..."
npx expo prebuild --clean --non-interactive

echo "Publishing OTA updates..."
eas update --branch development --message "OTA: SimbaGlobal AI + GPT-5 integration"
eas update --branch preview --message "OTA: SimbaGlobal AI + GPT-5 integration"
eas update --branch production --message "OTA: SimbaGlobal AI + GPT-5 integration"

echo "Building fresh apps..."
npx eas build --platform ios --profile preview --non-interactive --clear-cache
npx eas build --platform android --profile preview --non-interactive --clear-cache

echo "Submitting to app stores..."
eas submit -p ios --latest --profile production
eas submit -p android --latest --profile production

echo "Exporting web build..."
npx expo export:web

echo "Sending Firebase push notification..."
curl -X POST \
  -H "Authorization: key=$FIREBASE_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"/topics/all","notification":{"title":"SimbaGlobal AI Updated","body":"GPT-5 update is live. Open the app now."}}' \
  https://fcm.googleapis.com/fcm/send

echo "SimbaGlobal AI Autopilot finished successfully."