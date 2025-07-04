@echo off
REM Build script for Windows to prepare the frontend for production

echo Building the frontend...
npm run build

echo Build complete. Output is in the dist directory.
echo You can deploy these files to your hosting service.

pause
