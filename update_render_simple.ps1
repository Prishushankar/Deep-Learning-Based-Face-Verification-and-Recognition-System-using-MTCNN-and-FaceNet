#!/usr/bin/env pwsh

Write-Host "Render Deployment - Python 3.9 Fix Script" -ForegroundColor Green
Write-Host "Face Comparison API with ML Dependencies" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow

Write-Host ""
Write-Host "CRITICAL PYTHON VERSION ISSUE!" -ForegroundColor Red -BackgroundColor Yellow
Write-Host ""
Write-Host "PROBLEM: Render defaults to Python 3.13 (incompatible with ML stack)" -ForegroundColor Red
Write-Host "SOLUTION: Manual service creation with forced Python 3.9.18" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend\main.py")) {
    Write-Host "Error: Not in the correct project directory" -ForegroundColor Red
    Write-Host "Please run this script from the root of your project" -ForegroundColor Yellow
    exit 1
}

Write-Host "Project directory verified" -ForegroundColor Green

# Check deployment files
$files = @(
    "backend\runtime.txt",
    "backend\.python-version", 
    "backend\build.sh",
    "backend\requirements.txt",
    "render.yaml"
)

Write-Host "Checking deployment files..." -ForegroundColor Blue
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Committing fixes to GitHub..." -ForegroundColor Blue

# Git operations
try {
    git add .
    git commit -m "CRITICAL FIX: Force Python 3.9.18 for Render ML deployment - Enhanced build script with Python version detection"
    git push origin master
    Write-Host "Changes pushed to GitHub successfully!" -ForegroundColor Green
} catch {
    Write-Host "Git operation failed - you may need to push manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "REQUIRED MANUAL STEPS FOR RENDER" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Step 1: Delete Existing Service" -ForegroundColor Blue
Write-Host "   - Go to https://dashboard.render.com/" -ForegroundColor Gray
Write-Host "   - Delete any existing face-comparison-api service" -ForegroundColor Gray
Write-Host ""
Write-Host "Step 2: Create New Web Service" -ForegroundColor Blue  
Write-Host "   - Click 'New +' -> 'Web Service'" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repository" -ForegroundColor Gray
Write-Host "   - Configuration:" -ForegroundColor Gray
Write-Host "     Name: face-comparison-api" -ForegroundColor White
Write-Host "     Runtime: Python" -ForegroundColor White
Write-Host "     Python Version: 3.9.18 (CRITICAL!)" -ForegroundColor Red
Write-Host "     Root Directory: backend" -ForegroundColor White
Write-Host "     Build Command: chmod +x build.sh; ./build.sh" -ForegroundColor White
Write-Host "     Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT" -ForegroundColor White
Write-Host ""
Write-Host "Step 3: Environment Variables" -ForegroundColor Blue
Write-Host "   ALLOWED_ORIGINS = *" -ForegroundColor White
Write-Host "   PYTHONUNBUFFERED = 1" -ForegroundColor White
Write-Host "   PYTHON_VERSION = 3.9.18" -ForegroundColor White
Write-Host "   PIP_NO_CACHE_DIR = 1" -ForegroundColor White
Write-Host ""
Write-Host "Step 4: Monitor Build (10-15 minutes)" -ForegroundColor Blue
Write-Host "   SUCCESS: Look for 'Python version check passed: Python 3.9.x'" -ForegroundColor Green
Write-Host "   FAILURE: If you see Python 3.13, STOP and recreate service!" -ForegroundColor Red
Write-Host ""

Write-Host "BUILD EXPECTATIONS" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Success Indicators:" -ForegroundColor Green
Write-Host "- Python version check passed: Python 3.9.18" -ForegroundColor Green
Write-Host "- TensorFlow 2.15.0 imported successfully" -ForegroundColor Green
Write-Host "- OpenCV imported successfully" -ForegroundColor Green
Write-Host "- DeepFace imported successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Failure Indicators:" -ForegroundColor Red
Write-Host "- CRITICAL ERROR: Python 3.13 detected!" -ForegroundColor Red
Write-Host "- No matching distribution found for tensorflow==2.15.0" -ForegroundColor Red
Write-Host "- /python3.13/site-packages/ in logs" -ForegroundColor Red
Write-Host ""

Write-Host "TESTING AFTER DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Basic test: curl https://your-service.onrender.com/" -ForegroundColor Blue
Write-Host "2. Health check: curl https://your-service.onrender.com/health" -ForegroundColor Blue
Write-Host "3. Face comparison test: Use the API endpoints" -ForegroundColor Blue
Write-Host ""

Write-Host "ADDITIONAL RESOURCES" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Detailed Guide: RENDER_DEPLOYMENT_CRITICAL.md" -ForegroundColor Blue
Write-Host "Render Dashboard: https://dashboard.render.com/" -ForegroundColor Blue
Write-Host ""

Write-Host "KEY SUCCESS FACTOR" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host ""
Write-Host "The ONLY way this will work is if Python 3.9.18 is manually" -ForegroundColor Yellow
Write-Host "selected in the Render UI. The config files are correct, but" -ForegroundColor Yellow
Write-Host "Render is not respecting them. Manual selection is required!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Good luck!" -ForegroundColor Green
