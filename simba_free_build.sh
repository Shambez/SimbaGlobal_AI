#!/bin/bash
set -e

echo "🦁 SimbaGlobal_AI Free Build Autopilot"

# ========== 0. FIX STALE GIT LOCKS ==========
if [ -f ".git/HEAD.lock" ]; then
  echo "⚠️ Found stale Git lock (.git/HEAD.lock)..."
  if pgrep -f "git" > /dev/null; then
    echo "❌ Real Git process detected. Not deleting lock. Please wait or close the process."
    exit 1
  else
    rm -f .git/HEAD.lock
    echo "✅ Stale Git lock removed."
  fi
fi

# ========== 1. CLEAN DUPLICATE FOLDERS ==========
echo "🧹 Checking Desktop for duplicate SimbaGlobal_AI folders..."
DESKTOP="$HOME/Desktop"
TRASH="$DESKTOP/Simba_Trash"
mkdir -p "$TRASH"

for folder in "$DESKTOP"/SimbaGlobal_AI_* "$DESKTOP"/SimbaGlobalAI_* "$DESKTOP"/Simba_AI_App "$DESKTOP"/SimbaGlobal_AI_backup "$DESKTOP"/SimbaGlobal_AI_broken; do
  if [ -d "$folder" ] && [ "$folder" != "$DESKTOP/SimbaGlobal_AI" ]; then
    echo "⚠️ Moving duplicate $folder → $TRASH"
    mv "$folder" "$TRASH/"
  fi
done

echo "✅ Desktop cleanup complete. Active repo: $DESKTOP/SimbaGlobal_AI"

# ========== 2. PRE-BUILD GIT SYNC ==========
echo "📦 Pre-build sync..."
git add .
git commit -m "autopilot: pre-build sync [$(date '+%Y-%m-%d %H:%M:%S')]" || echo "ℹ️ Nothing to commit"
git pull origin main || true

# ========== 3. ASK BUILD TARGET ==========
echo "Choose a build target:"
echo "1) iOS"
echo "2) Android"
echo "3) Web"
echo "4) All"
echo "5) Exit"
read -rp "#? " choice

# ========== 4. HANDLE WARP GPT-5 PROMPT ==========
if [ "$choice" != "5" ]; then
  echo "🤔 Need GPT-5 help with this build? (y/n): y"
  echo "📝 Ask your question for GPT-5: Fix all duplicate files, remove stale Git locks, and carry on building without errors."
fi

# ========== 5. BUILD EXECUTION ==========
case $choice in
  1)
    echo "🚀 Building iOS..."
    npx expo run:ios
    ;;
  2)
    echo "🚀 Building Android..."
    npx expo run:android
    ;;
  3)
    echo "🚀 Building Web..."
    npx expo export:web
    ;;
  4)
    echo "🚀 Building All (iOS + Android + Web)..."
    npx expo run:ios || true
    npx expo run:android || true
    npx expo export:web || true
    ;;
  5)
    echo "👋 Exiting..."
    exit 0
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

# ========== 6. PUSH TO MAIN ==========
echo "📝 Committing build results..."
git add .
git commit -m "autopilot: build results [$(date '+%Y-%m-%d %H:%M:%S')]" || echo "ℹ️ Nothing to commit"
git push origin main || echo "⚠️ Post-build push failed"

echo "🎉 SimbaGlobal_AI Free Build Complete!"