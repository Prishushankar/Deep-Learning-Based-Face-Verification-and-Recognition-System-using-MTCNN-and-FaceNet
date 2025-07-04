# GitHub Deployment Guide

This guide will help you commit your project to the GitHub repository at https://github.com/Prishushankar/faceRecognition.git.

## Prerequisites

1. Make sure you have Git installed on your computer. If not, download and install it from [git-scm.com](https://git-scm.com/).
2. Make sure you have GitHub credentials and access to the repository.

## Option 1: Using the Deployment Script

1. Run the `deploy_to_github.bat` script in the root directory of the project.
2. Enter your commit message when prompted.
3. The script will initialize the repository, add files, commit, and push to GitHub.

## Option 2: Manual Deployment

### Step 1: Initialize Git Repository

Open a command prompt or PowerShell in the project root directory:

```powershell
cd c:\Users\Priyanshu Shankar\Desktop\MMUY\Model\Model\protoype
git init
```

### Step 2: Add Remote Repository

```powershell
git remote add origin https://github.com/Prishushankar/faceRecognition.git
```

### Step 3: Configure Git (if first time)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Add Files to Staging Area

```powershell
git add .
```

### Step 5: Commit Changes

```powershell
git commit -m "Initial commit"
```

### Step 6: Push to GitHub

```powershell
git push -u origin main
```

If the repository already has a main branch and you're getting errors, you might need to:
- Pull first: `git pull origin main --allow-unrelated-histories`
- Or force push (only if you're sure): `git push -u origin main --force`

## Troubleshooting

### Authentication Issues

If you're having trouble with authentication, try:

1. Using GitHub CLI: `gh auth login`
2. Using a personal access token instead of password
3. Setting up SSH keys for GitHub

### Merge Conflicts

If you get merge conflicts:

1. Pull the latest changes: `git pull origin main`
2. Resolve conflicts in the conflicting files
3. Add the resolved files: `git add .`
4. Commit the changes: `git commit -m "Resolved merge conflicts"`
5. Push again: `git push origin main`

### Large Files

If you have large files that exceed GitHub's file size limit:

1. Add them to `.gitignore`
2. Or consider using Git LFS (Large File Storage)

## Continuous Deployment

For automatic deployment, consider:

1. Setting up GitHub Actions to deploy your backend to Heroku or Render
2. Setting up Vercel or Netlify to automatically deploy your frontend when you push to GitHub

Both services can be configured to deploy from your GitHub repository automatically.
