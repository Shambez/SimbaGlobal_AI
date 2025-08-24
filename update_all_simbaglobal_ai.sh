#!/bin/bash

echo "🔁 Committing changes to Git..."
git add .
git commit -m "auto: update SimbaGlobal AI app changes"
git push origin main

echo "🚀 Publishing update to Expo (dev & preview)..."
eas update --branch dev --message "Auto update to dev"
eas update --branch preview --message "Auto update to preview"

echo "🛠 Building for iOS & Android (preview)..."
eas build -p ios --profile preview
eas build -p android --profile preview

echo "✅ SimbaGlobal_AI has been updated, published, and builds initiated successfully!"
