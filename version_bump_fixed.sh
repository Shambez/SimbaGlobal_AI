#!/bin/bash

# Fixed version bump script for Expo app.json
# This script properly handles jq commands and provides better error handling

set -e  # Exit on any error

echo "Starting version bump process..."

# Check if app.json exists
if [ ! -f app.json ]; then
    echo "Error: app.json not found!"
    exit 1
fi

# Bump patch version + native build numbers (uses jq if available, else sed fallback)
if command -v jq >/dev/null 2>&1 && [ -f app.json ]; then
    echo "Using jq for version bump..."
    
    # Get old version
    oldV=$(jq -r '.expo.version' app.json)
    echo "Current version: $oldV"
    
    # Apply version bump with proper error handling
    if jq '
        .expo.version |= (
            . as $v
            | (split(".") | .[0:2] + [((.[2]|tonumber)+1|tostring)] | join("."))
        )
        | .expo.ios.buildNumber |= ((. // "1" | if type == "string" then tonumber else . end)+1|tostring)
        | .expo.android.versionCode |= ((. // 1) + 1)
    ' app.json > app.json.tmp; then
        mv app.json.tmp app.json
        newV=$(jq -r '.expo.version' app.json)
        echo "Version bumped successfully: $oldV → $newV"
    else
        echo "Error: jq version bump failed"
        rm -f app.json.tmp
        exit 1
    fi
else
    echo "Using sed fallback for version bump..."
    # sed fallback for app.json
    [ -f app.json ] && \
    oldV=$(grep -oE '"version": *"[^"]+"' app.json | head -1 | cut -d'"' -f4) && \
    sed -i '' -E 's/"version": *"([0-9]+)\.([0-9]+)\.([0-9]+)"/"version": "\1.\2.$((\3+1))"/' app.json && \
    newV=$(grep -oE '"version": *"[^"]+"' app.json | head -1 | cut -d'"' -f4)
    echo "Version bumped with sed: $oldV → $newV"
fi

echo "Committing changes..."
git add -f app.json || true
git commit -m "version bump SimbaGlobal_AI ${oldV:-'?'} → ${newV:-'?'}"

echo "Pushing to remote..."
git push origin main

echo "Version bump completed successfully!"