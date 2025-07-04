# PowerShell script to update GitHub with minimal Python deployment

Write-Host "Updating GitHub with simplified Python deployment..." -ForegroundColor Cyan

# Rename simplified files to be the main ones used for deployment
Copy-Item -Path ".\backend\main_simple.py" -Destination ".\backend\main.py" -Force
Copy-Item -Path ".\backend\url_simple.py" -Destination ".\backend\url.py" -Force
Copy-Item -Path ".\backend\requirements-minimal.txt" -Destination ".\backend\requirements.txt" -Force

# Add all files
git add .

# Commit
git commit -m "Switch to simplified Python implementation for Render deployment"

# Push to GitHub
git push origin master

Write-Host "Simplified deployment configuration pushed to GitHub!" -ForegroundColor Green
Write-Host "Now in Render dashboard:" -ForegroundColor Yellow
Write-Host "1. Go to your service" -ForegroundColor Yellow
Write-Host "2. Deploy the latest commit" -ForegroundColor Yellow
Write-Host "3. Once deployed successfully, you can incrementally add back the ML dependencies" -ForegroundColor Yellow
