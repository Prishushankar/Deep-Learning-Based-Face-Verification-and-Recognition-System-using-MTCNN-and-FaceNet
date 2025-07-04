# PowerShell script for deploying Frontend to Vercel

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Face Recognition Frontend Deployment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host

Write-Host "1. Committing latest changes to GitHub..." -ForegroundColor Yellow
Set-Location -Path ".\frontend"

Write-Host "Adding files to git..." -ForegroundColor Gray
git add .

Write-Host "Committing..." -ForegroundColor Gray
$commitMsg = Read-Host "Enter commit message"
git commit -m $commitMsg

Write-Host "Pushing to GitHub..." -ForegroundColor Gray
git push origin master

Write-Host
Write-Host "2. Deploying to Vercel..." -ForegroundColor Yellow
Write-Host
Write-Host "Please choose a deployment method:" -ForegroundColor White
Write-Host "[1] Deploy via vercel.com dashboard (recommended)" -ForegroundColor Green
Write-Host "[2] Deploy via Vercel CLI (requires installation)" -ForegroundColor Green
Write-Host

$deployOption = Read-Host "Enter option (1 or 2)"

if ($deployOption -eq "1") {
  Write-Host
  Write-Host "Please follow these steps:" -ForegroundColor White
  Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
  Write-Host "2. Import your GitHub repository" -ForegroundColor White
  Write-Host "3. Configure as follows:" -ForegroundColor White
  Write-Host "   - Framework: Vite" -ForegroundColor White
  Write-Host "   - Root Directory: frontend" -ForegroundColor White
  Write-Host "   - Build Command: npm run build" -ForegroundColor White
  Write-Host "   - Output Directory: dist" -ForegroundColor White
  Write-Host "4. Add environment variable:" -ForegroundColor White
  Write-Host "   - VITE_API_URL = Your backend URL" -ForegroundColor White
  Write-Host "5. Click Deploy" -ForegroundColor White
  Write-Host
  Write-Host "Press Enter to open the Vercel dashboard..." -ForegroundColor Gray
  Read-Host
  Start-Process "https://vercel.com/new"
} else {
  Write-Host
  Write-Host "Installing Vercel CLI..." -ForegroundColor Gray
  npm install -g vercel
  
  Write-Host
  Write-Host "Logging in to Vercel..." -ForegroundColor Gray
  vercel login
  
  Write-Host
  Write-Host "Deploying to Vercel..." -ForegroundColor Gray
  vercel
}

Write-Host
Write-Host "Deployment process initiated! When complete, update your backend's ALLOWED_ORIGINS with the new frontend URL." -ForegroundColor Green
Write-Host
