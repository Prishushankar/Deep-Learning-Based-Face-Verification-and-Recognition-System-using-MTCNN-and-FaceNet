# PowerShell script to update GitHub with Render deployment fixes

Write-Host "Updating GitHub with Render deployment fixes..." -ForegroundColor Cyan

# Add all files
git add .

# Commit
git commit -m "Fix Pillow installation and dependencies for Render deployment"

# Push to GitHub
git push origin master

Write-Host "Deployment fixes pushed to GitHub!" -ForegroundColor Green
Write-Host "Now redeploy your application on Render to apply these changes." -ForegroundColor Yellow
