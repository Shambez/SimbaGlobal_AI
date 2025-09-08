#!/bin/zsh
set -e

COMMIT_MSG="chore: SimbaGlobal_AI sync + GPT5 + build + submit"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

node -e '
const fs = require("fs");
const app = JSON.parse(fs.readFileSync("app.json"));
let [major, minor, patch] = app.expo.version.split(".").map(Number);
patch++;
app.expo.version = major + "." + minor + "." + patch;
app.expo.ios = app.expo.ios || {};
app.expo.android = app.expo.android || {};
app.expo.ios.buildNumber = String(Number(app.expo.ios.buildNumber || 0) + 1);
app.expo.android.versionCode = Number(app.expo.android.versionCode || 0) + 1;
fs.writeFileSync("app.json", JSON.stringify(app, null, 2));
'

git fetch --all --prune
git add .
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"
git pull origin $CURRENT_BRANCH --rebase
git push origin $CURRENT_BRANCH

for BRANCH in main backup/bare-current preview
do
  git checkout $BRANCH || git checkout -b $BRANCH
  git reset --hard $CURRENT_BRANCH
  git push origin $BRANCH --force
done

git checkout $CURRENT_BRANCH

rm -rf node_modules ios Pods android .expo .expo-shared
watchman watch-del-all || true
npm install
npx expo prebuild --clean

eas update --branch preview --message "Live update"

npx eas build --platform ios --profile preview --clear-cache
npx eas build --platform android --profile preview --clear-cache

curl -X POST \
  -H "Authorization: key=$FIREBASE_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to":"/topics/all","notification":{"title":"SimbaGlobal AI Updated","body":"New GPT-5 update is live. Open the app now."}}' \
  https://fcm.googleapis.com/fcm/send

eas submit -p ios --latest --profile production
eas submit -p android --latest --profile production
