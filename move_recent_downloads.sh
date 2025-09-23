#!/bin/bash

# Script to move the 4 most recent files from Downloads to current directory
# Filters for files modified in the last 30 minutes

DOWNLOADS_DIR="$HOME/Downloads"
TARGET_DIR="/Users/vongohren/code/personal-projects/fpl-ai-assist"

echo "Looking for files in $DOWNLOADS_DIR modified in the last 30 minutes..."

# Find files in Downloads modified in last 30 minutes, sort by modification time (newest first), take first 4
files=$(find "$DOWNLOADS_DIR" -maxdepth 1 -type f -mmin -30 -exec ls -1t {} + 2>/dev/null | head -4)

if [ -z "$files" ]; then
    echo "No files found in Downloads folder modified in the last 30 minutes."
    exit 0
fi

echo "Found the following recent files:"
echo "$files"
echo ""

# Count how many files we found
file_count=$(echo "$files" | wc -l)
echo "Moving $file_count file(s) to $TARGET_DIR"
echo ""

# Move each file
while IFS= read -r file; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "Moving: $filename"
        mv "$file" "$TARGET_DIR/"
        if [ $? -eq 0 ]; then
            echo "✓ Successfully moved $filename"
        else
            echo "✗ Failed to move $filename"
        fi
    fi
done <<< "$files"

echo ""
echo "Done!"
