#!/bin/zsh
set -e

echo "
SimbaGlobal AI Autopilot:
All builds are live and interactive (GPT-5 + Mufasa voice).
Every execution deploys across Git, Expo, EAS, iOS, Android, Web.
End users always get the latest build instantly.
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
        exit 1
      fi
    }
  done
}

COMMIT_MSG="SimbaGlobal AI: GPT-5 autopilot live build & deploy"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Starting SimbaGlobal AI LIVE Autopilot..."

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

retry git fetch --all --prune
retry git add .
git commit -m "$COMMIT_MSG" || echo "✅ Nothing new to commit"
retry git pull origin $CURRENT_BRANCH --rebase
retry git push origin $CURRENT_BRANCH

for BRANCH in main backup/bare-current preview
do
  git checkout $BRANCH || git checkout -b $BRANCH
  git reset --hard $CURRENT_BRANCH
  retry git push origin $BRANCH --force
done

git checkout $CURRENT_BRANCH

rm -rf node_modules .expo .expo-shared
watchman watch-del-all || true
retry npm install

retry npx expo prebuild --clean

retry eas update --branch development --message "OTA: SimbaGlobal AI + GPT-5 live sync"
retry eas update --branch preview --message "OTA: SimbaGlobal AI + GPT-5 live sync"
retry eas update --branch production --message "OTA: SimbaGlobal AI + GPT-5 live sync"

retry npx eas build --platform ios --profile preview --interactive
retry npx eas build --platform android --profile preview --interactive

retry eas submit -p ios --latest --profile production --interactive
retry eas submit -p android --latest --profile production --interactive

retry npx expo export:web

curl -X POST \
  -H "Authorization: key=$FIREBASE_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"/topics/all","notification":{"title":"SimbaGlobal AI Updated","body":"🔥 GPT-5 live update is now available. Open the app!"}}' \
  https://fcm.googleapis.com/fcm/send

echo "🎉 SimbaGlobal AI Autopilot finished successfully — live GPT-5 build deployed everywhere!"