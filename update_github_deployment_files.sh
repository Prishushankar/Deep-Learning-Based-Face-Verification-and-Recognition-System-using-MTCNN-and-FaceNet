#!/bin/bash

# Set environment variable for display
export PYTHONPATH=/usr/lib/python3/dist-packages

# Change directory to the backend
cd $(dirname "$0")

# Add a message
echo "Updating GitHub repository with deployment files..."

# Initialize Git repository (if not already done)
git init

# Add remote (if not already added)
git remote add origin https://github.com/Prishushankar/faceRecognition.git 2>/dev/null || true

# Add all files
git add .

# Commit
git commit -m "Add Render deployment configuration files"

# Push to GitHub
git push -u origin master

echo "Deployment files pushed to GitHub!"
