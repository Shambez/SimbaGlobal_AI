set -euo pipefail

cd ~/Desktop/SimbaGlobal_AI

git add -A
git commit -m "chore(ios): reset CocoaPods and prebuild for stable Expo iOS builds" || true
git push -u origin main || true

grep -qxF "ios/" .gitignore || echo "ios/" >> .gitignore
grep -qxF "android/" .gitignore || echo "android/" >> .gitignore
grep -qxF "node_modules/" .gitignore || echo "node_modules/" >> .gitignore
grep -qxF ".expo/" .gitignore || echo ".expo/" >> .gitignore
grep -qxF ".expo-shared/" .gitignore || echo ".expo-shared/" >> .gitignore
git add .gitignore || true
git commit -m "chore(git): ensure native folders and caches are ignored" || true
git push || true

if [ ! -f "assets/images/simba_global_ai.png" ]; then
  echo "Missing assets/images/simba_global_ai.png"
  exit 1
fi

export EAS_SKIP_AUTO_FINGERPRINT=1
export CI=1

xcode-select -p >/dev/null 2>&1 || sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept || true

rm -rf ios/Pods ios/Podfile.lock
rm -rf ~/Library/Caches/CocoaPods ~/.cocoapods/repos 2>/dev/null || true

watchman watch-del-all 2>/dev/null || true
pkill -f "node|metro|react-native|expo" 2>/dev/null || true

npm install

rm -rf ios android
npx expo prebuild --clean

cd ios
pod repo update || pod setup
RCT_NO_LAUNCH_PACKAGER=1 pod install --repo-update
cd ..

npx expo run:ios
