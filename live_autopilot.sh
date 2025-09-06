#!/bin/zsh
set -e

echo "
Warp Autopilot Instructions:
- Do not delete or overwrite any working assets (icons, splash, lion imoji, mp3 files). Only fix paths if broken.
- All routing and GPT-5 integration must remain intact.
- Fix only broken or missing files, never downgrade or remove working code.
- Every update must propagate live across Git, Expo, EAS, iOS, Android, and Web.
- End users must always get the latest build in real time when opening the app.
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

COMMIT_MSG="SimbaGlobal AI: GPT-5 autopilot sync, build, deploy"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Starting SimbaGlobal AI Autopilot..."

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

retry eas update --branch development --message "OTA: SimbaGlobal AI + GPT-5 sync"
retry eas update --branch preview --message "OTA: SimbaGlobal AI + GPT-5 sync"
retry eas update --branch production --message "OTA: SimbaGlobal AI + GPT-5 sync"

retry npx eas build --platform ios --profile preview
retry npx eas build --platform android --profile preview

retry eas submit -p ios --latest --profile production
retry eas submit -p android --latest --profile production

retry npx expo export:web

curl -X POST \
  -H "Authorization: key=$FIREBASE_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"/topics/all","notification":{"title":"SimbaGlobal AI Updated","body":"🔥 GPT-5 update is live. Open the app now."}}' \
  https://fcm.googleapis.com/fcm/send

echo "🎉 SimbaGlobal AI Autopilot finished successfully with GPT-5 integration!"