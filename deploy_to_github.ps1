# PowerShell script for deploying to GitHub
# This is more advanced than the batch file version

Write-Host "Face Recognition App - GitHub Deployment Tool" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git detected: $gitVersion" -ForegroundColor Green
}
catch {
    Write-Host "Git is not installed or not in PATH. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit
}

# Check if repository exists
$repoExists = Test-Path -Path ".git"
if ($repoExists) {
    Write-Host "Git repository already initialized." -ForegroundColor Yellow
    
    # Check if remote exists
    $remoteExists = git remote -v | Select-String -Pattern "origin"
    if ($remoteExists) {
        Write-Host "Remote 'origin' is already configured:" -ForegroundColor Yellow
        git remote -v
        $changeRemote = Read-Host "Do you want to change the remote? (y/n)"
        if ($changeRemote -eq "y") {
            git remote remove origin
            git remote add origin https://github.com/Prishushankar/faceRecognition.git
            Write-Host "Remote updated to https://github.com/Prishushankar/faceRecognition.git" -ForegroundColor Green
        }
    }
    else {
        git remote add origin https://github.com/Prishushankar/faceRecognition.git
        Write-Host "Remote 'origin' added: https://github.com/Prishushankar/faceRecognition.git" -ForegroundColor Green
    }
}
else {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
    git remote add origin https://github.com/Prishushankar/faceRecognition.git
    Write-Host "Git repository initialized and remote added." -ForegroundColor Green
}

# Configure Git if needed
$configName = git config --get user.name
$configEmail = git config --get user.email

if (-not $configName -or -not $configEmail) {
    Write-Host "Git user configuration is incomplete." -ForegroundColor Yellow
    
    if (-not $configName) {
        $name = Read-Host "Enter your name for Git commits"
        git config --global user.name "$name"
    }
    
    if (-not $configEmail) {
        $email = Read-Host "Enter your email for Git commits"
        git config --global user.email "$email"
    }
    
    Write-Host "Git user configured." -ForegroundColor Green
}

# Check status
Write-Host "`nCurrent status:" -ForegroundColor Cyan
git status

# Stage files
$stageAll = Read-Host "`nDo you want to stage all files? (y/n)"
if ($stageAll -eq "y") {
    git add .
    Write-Host "All files staged." -ForegroundColor Green
}
else {
    Write-Host "Enter files to stage (separate by space, or enter '.' for all):"
    $files = Read-Host
    git add $files
    Write-Host "Files staged." -ForegroundColor Green
}

# Commit
$commitMessage = Read-Host "`nEnter commit message"
git commit -m "$commitMessage"
Write-Host "Changes committed." -ForegroundColor Green

# Push
$branch = git branch --show-current
if (-not $branch) {
    $branch = "main"
}

$pushNow = Read-Host "`nDo you want to push to GitHub now? (y/n)"
if ($pushNow -eq "y") {
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    
    # Check if branch exists on remote
    $remoteBranchExists = git ls-remote --heads origin $branch
    
    if ($remoteBranchExists) {
        # Branch exists, pull first to avoid conflicts
        Write-Host "Branch '$branch' already exists on remote. Pulling latest changes..." -ForegroundColor Yellow
        git pull origin $branch --no-rebase
    }
    
    # Push
    git push -u origin $branch
    
    if ($?) {
        Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
    }
    else {
        Write-Host "`nPush failed. You may need to resolve conflicts." -ForegroundColor Red
    }
}
else {
    Write-Host "`nChanges are committed but not pushed." -ForegroundColor Yellow
    Write-Host "To push later, use: git push -u origin $branch" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
