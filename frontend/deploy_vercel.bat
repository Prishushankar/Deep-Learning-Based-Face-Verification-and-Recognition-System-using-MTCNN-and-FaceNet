@echo off
echo ===================================
echo Face Recognition Frontend Deployment
echo ===================================
echo.

echo 1. Committing latest changes to GitHub...
cd frontend

echo Adding files to git...
git add .

echo Committing...
set /p COMMIT_MSG="Enter commit message: "
git commit -m "%COMMIT_MSG%"

echo Pushing to GitHub...
git push origin master

echo.
echo 2. Deploying to Vercel...
echo.
echo Please choose a deployment method:
echo [1] Deploy via vercel.com dashboard (recommended)
echo [2] Deploy via Vercel CLI (requires installation)
echo.

set /p DEPLOY_OPTION="Enter option (1 or 2): "

if "%DEPLOY_OPTION%"=="1" (
  echo.
  echo Please follow these steps:
  echo 1. Go to https://vercel.com/new
  echo 2. Import your GitHub repository
  echo 3. Configure as follows:
  echo    - Framework: Vite
  echo    - Root Directory: frontend
  echo    - Build Command: npm run build
  echo    - Output Directory: dist
  echo 4. Add environment variable:
  echo    - VITE_API_URL = Your backend URL
  echo 5. Click Deploy
  echo.
  echo Press any key to open the Vercel dashboard...
  pause > nul
  start https://vercel.com/new
) else (
  echo.
  echo Installing Vercel CLI...
  npm install -g vercel
  
  echo.
  echo Logging in to Vercel...
  vercel login
  
  echo.
  echo Deploying to Vercel...
  vercel
)

echo.
echo Deployment process initiated! When complete, update your backend's ALLOWED_ORIGINS with the new frontend URL.
echo.
