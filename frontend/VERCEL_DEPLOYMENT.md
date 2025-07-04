# Frontend Deployment Guide - Vercel

This guide will help you deploy the Face Comparison React frontend to Vercel, which offers free hosting for frontend applications with automatic builds from GitHub.

## Prerequisites

1. GitHub account with your code committed to https://github.com/Prishushankar/faceRecognition.git
2. Vercel account (Sign up at https://vercel.com/ - you can sign up with your GitHub account)

## Deployment Steps

### 1. Sign in to Vercel

- Go to https://vercel.com/
- Sign in with GitHub for easiest setup

### 2. Import Your Project

- Click "Add New..." → "Project" 
- Under "Import Git Repository", find and select "Prishushankar/faceRecognition"
- Click "Import"

### 3. Configure Project Settings

- **Framework Preset**: Select "Vite" from the dropdown
- **Root Directory**: Set to "frontend"
- **Build and Output Settings**:
  - Build Command: `npm run build`
  - Output Directory: `dist`
- **Environment Variables**:
  - Add the variable `VITE_API_URL` with the value of your backend URL (e.g., `https://face-comparison-api.onrender.com`)

### 4. Deploy

- Click "Deploy"
- Wait for the deployment to complete (usually takes 1-2 minutes)
- Vercel will provide you with a URL for your deployed frontend (e.g., https://face-recognition-xyz.vercel.app)

### 5. Verify Your Deployment

- Open the provided URL in your browser
- Test the application with some image URLs
- If there are issues connecting to the backend, check that the `VITE_API_URL` environment variable is set correctly

## Customizing Your Deployment

### Custom Domain

If you want to use a custom domain instead of the Vercel subdomain:

1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your custom domain and follow the instructions to configure DNS

### Environment Variables

If you need to update the backend URL after deployment:

1. Go to your project settings in Vercel
2. Click on "Environment Variables"
3. Update the `VITE_API_URL` value
4. Redeploy your application

## Troubleshooting

### Build Failures

If your build fails, check the build logs for errors:

1. Common issues include:
   - Missing dependencies
   - Build script errors
   - Incorrect environment variables

2. Make any necessary fixes in your GitHub repository
3. Vercel will automatically attempt to deploy again after you push changes

### CORS Issues

If you see CORS errors in the browser console:

1. Make sure your backend's `ALLOWED_ORIGINS` environment variable includes your Vercel URL
2. Update the backend configuration and redeploy if necessary
