# PowerShell script to update GitHub with FIXED Python 3.9 deployment

Write-Host "Updating GitHub with PYTHON 3.9 FORCED deployment..." -ForegroundColor Cyan
Write-Host "This MUST use Python 3.9.18, NOT 3.13!" -ForegroundColor Red

# Add all files
git add .

# Commit
git commit -m "Force Python 3.9.18 for Render deployment - full ML model"

# Push to GitHub
git push origin master

Write-Host "Python 3.9 deployment configuration pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "CRITICAL RENDER SETUP INSTRUCTIONS:" -ForegroundColor Red
Write-Host "1. DELETE any existing Render service" -ForegroundColor Yellow
Write-Host "2. Create NEW service with these settings:" -ForegroundColor Yellow
Write-Host "   - Python Version: 3.9.18 (NOT 3.13!)" -ForegroundColor White
Write-Host "   - Root Directory: backend" -ForegroundColor White
Write-Host "   - Build Command: chmod +x build.sh && ./build.sh" -ForegroundColor White
Write-Host "   - Start Command: uvicorn main:app --host 0.0.0.0 --port `$PORT" -ForegroundColor White
Write-Host "3. If you see Python 3.13 in logs, STOP and fix settings" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your full face recognition model will work once Python 3.9 is used!" -ForegroundColor Green
