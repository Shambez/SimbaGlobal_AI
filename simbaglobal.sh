#!/bin/zsh
set -e

echo "🔄 Backing up current broken folder (if it exists)..."
if [ -d ~/Desktop/SimbaGlobal_AI ]; then
  mv ~/Desktop/SimbaGlobal_AI ~/Desktop/SimbaGlobal_AI_backup_$(date +%Y%m%d%H%M%S)
  echo "✅ Moved old folder to ~/Desktop/SimbaGlobal_AI_backup_*"
fi

echo "📥 Cloning fresh repo from GitHub..."
cd ~/Desktop
git clone https://github.com/Shambez/SimbaGlobal_AI.git
cd SimbaGlobal_AI

echo "📦 Installing dependencies..."
npm install
npx expo install

echo "📂 Restoring local-only files if backup exists..."
if [ -d ~/Desktop/SimbaGlobal_AI_backup_* ]; then
  cp ~/Desktop/SimbaGlobal_AI_backup_*/.env* . 2>/dev/null || true
  cp -r ~/Desktop/SimbaGlobal_AI_backup_*/assets ./ 2>/dev/null || true
fi

echo "✅ Project structure restored:"
ls -la

echo "🟢 Git status:"
git status

echo "✨ Done! You can now run 'eas build --platform ios --profile preview --clear-cache' or Android."