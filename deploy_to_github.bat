@echo off
REM Deployment script for pushing to GitHub

echo Initializing Git repository...
git init

echo Adding remote repository...
git remote add origin https://github.com/Prishushankar/faceRecognition.git

echo Adding files to Git...
git add .

set /p commit_msg="Enter commit message: "
echo Committing changes...
git commit -m "%commit_msg%"

echo Pushing to GitHub...
git push -u origin main

echo Deployment complete.
pause
