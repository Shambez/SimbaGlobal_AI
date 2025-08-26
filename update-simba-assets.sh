#!/bin/bash

# Define asset files to watch
ASSETS=(
  "./assets/simba_global_ai_icon.PNG"
  "./assets/splash-simba_global_ai_icon.PNG"
  "./assets/adaptive-simba_global_ai_icon.PNG"
)

# Function to check if files exist
check_assets_exist() {
  for FILE in "${ASSETS[@]}"; do
    if [ ! -f "$FILE" ]; then
      echo "❌ Missing file: $FILE"
      exit 1
    fi
  done
}

# Check all required asset files are present
echo "🔍 Verifying assets..."
check_assets_exist
echo "✅ All asset files are present."

# Git add & commit
echo "📦 Committing changes to Git..."
git add app.json assets/
git commit -m "chore: updated icons, splash, and assets"
git push origin main

# Push to Expo preview
echo "🚀 Updating Expo preview build..."
eas update --branch preview --message "preview: auto-update triggered by asset/image change"

echo "✅ Done."
