#!/bin/bash
# Script to fix repository and install dependencies

echo "🔧 Fixing SimbaGlobal_AI Repository..."

# Install dependencies cleanly
echo "📦 Installing dependencies..."
npm install

# Remove problematic files from .gitignore if they were created properly
echo "🗑️ Cleaning up temporary .gitignore entries..."
git checkout .gitignore
git add .gitignore

# Try to add remaining files one by one
echo "📁 Adding remaining project files..."
for file in *.json *.js *.ts *.md *.sh; do
    if [ -f "$file" ]; then
        echo "Adding: $file"
        git add "$file" 2>/dev/null || echo "Skipped (timeout): $file"
    fi
done

# Add directories that are likely to work
echo "📂 Adding project directories..."
for dir in lib screens services scripts constants; do
    if [ -d "$dir" ]; then
        echo "Adding directory: $dir"
        git add "$dir" 2>/dev/null || echo "Skipped (timeout): $dir"
    fi
done

echo "✅ Repository cleanup complete!"
echo "🔍 Current status:"
git status --short