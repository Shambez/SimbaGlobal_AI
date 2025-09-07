#!/bin/bash

# Find duplicate files with numbered suffixes in the current directory
# This script looks for files with patterns like " 2", " 3", " 4", etc.

echo "Finding duplicate files with numbered suffixes..."
echo "================================================="

# Find all files with numbered suffixes and organize them by base name
find . -name "* [0-9]*" -type f | while read -r file; do
    echo "$file"
done | sort

echo ""
echo "================================================="
echo "Summary of duplicate patterns found:"

# Count unique base names that have duplicates
find . -name "* [0-9]*" -type f | sed 's/ [0-9][0-9]*\././' | sed 's/ [0-9]\././' | sort | uniq -c | sort -nr

echo ""
echo "To remove these duplicates safely, run the cleanup script next."
