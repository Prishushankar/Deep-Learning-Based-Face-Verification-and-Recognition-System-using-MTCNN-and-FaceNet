# PowerShell script to update GitHub with Render deployment fixes

Write-Host "Updating GitHub with Docker-based Render deployment..." -ForegroundColor Cyan

# Add all files
git add .

# Commit
git commit -m "Switch to Docker-based deployment for Render"

# Push to GitHub
git push origin master

Write-Host "Docker deployment configuration pushed to GitHub!" -ForegroundColor Green
Write-Host "Now in Render dashboard:" -ForegroundColor Yellow
Write-Host "1. Go to your service settings" -ForegroundColor Yellow
Write-Host "2. Change Environment from 'Python' to 'Docker'" -ForegroundColor Yellow
Write-Host "3. Set Root Directory to 'backend'" -ForegroundColor Yellow
Write-Host "4. Leave other settings at default values" -ForegroundColor Yellow
Write-Host "5. Save changes and deploy" -ForegroundColor Yellow
