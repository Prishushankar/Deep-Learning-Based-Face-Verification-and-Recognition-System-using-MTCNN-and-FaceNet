# PowerShell script to upload the project to GitHub
# Repository URL: https://github.com/Prishushankar/faceRecognition.git

# Set your Git user information if needed
# git config --global user.name "Your Name"
# git config --global user.email "your.email@example.com"

# Initialize Git repository (if not already initialized)
Write-Host "Initializing Git repository..." -ForegroundColor Cyan
git init

# Add remote repository (will replace existing remote if it exists)
Write-Host "Adding remote repository..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/Prishushankar/faceRecognition.git

# Add all files to staging
Write-Host "Adding files to staging..." -ForegroundColor Cyan
git add .

# Commit the changes
$commitMessage = "Upload face recognition project"
Write-Host "Committing changes with message: $commitMessage" -ForegroundColor Cyan
git commit -m $commitMessage

# Pull the latest changes from the remote repository first to avoid conflicts
Write-Host "Pulling latest changes from remote repository..." -ForegroundColor Cyan
git pull origin main --allow-unrelated-histories

# Push the changes to GitHub
Write-Host "Pushing changes to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "GitHub upload complete!" -ForegroundColor Green
Write-Host "Visit your repository at https://github.com/Prishushankar/faceRecognition" -ForegroundColor Green
