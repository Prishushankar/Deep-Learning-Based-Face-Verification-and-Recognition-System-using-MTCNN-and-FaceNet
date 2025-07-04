# PowerShell script to update GitHub repository with deployment files

Write-Host "Updating GitHub repository with deployment files..." -ForegroundColor Cyan

# Initialize Git repository (if not already done)
git init

# Add remote (if not already added)
try {
    git remote add origin https://github.com/Prishushankar/faceRecognition.git
} catch {
    Write-Host "Remote already exists, continuing..." -ForegroundColor Yellow
}

# Add all files
git add .

# Commit
git commit -m "Add Render deployment configuration files"

# Push to GitHub
git push -u origin master

Write-Host "Deployment files pushed to GitHub!" -ForegroundColor Green
