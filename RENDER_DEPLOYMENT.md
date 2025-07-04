# Render Deployment Guide for Face Comparison API

This guide provides detailed steps for deploying the Face Comparison API backend on Render.com.

## Prerequisites

- GitHub repository with your code (https://github.com/Prishushankar/faceRecognition.git)
- A Render account (Sign up at https://render.com if you don't have one)

## Deployment Steps

### 1. Sign in to Render

- Go to https://render.com
- Sign in with GitHub for easiest setup

### 2. Create a New Web Service

- Click the "New +" button in the dashboard
- Select "Web Service"
- Connect to your GitHub repository
  - Select "Prishushankar/faceRecognition" repository

### 3. Configure the Web Service

Use these settings:

- **Name**: face-comparison-api
- **Root Directory**: backend
- **Runtime**: Python 3
- **Build Command**: bash build.sh
- **Start Command**: uvicorn main:app --host 0.0.0.0 --port $PORT
- **Instance Type**: Free (for testing) or Basic (for production)

### 4. Set Environment Variables

Add these variables:
- `ALLOWED_ORIGINS`: Set this to your frontend URL, separated by commas if multiple (e.g., `https://your-frontend.vercel.app,http://localhost:5173`)

### 5. Deploy the Service

- Click "Create Web Service"
- Render will build and deploy your application
- Note the URL provided by Render (e.g., https://face-comparison-api.onrender.com)

### 6. Update Frontend Configuration

After deployment, update the frontend `.env` file:

```
VITE_API_URL=https://your-render-service-url.onrender.com
```

Replace the URL with your actual Render deployment URL.

## Troubleshooting

### Issues with OpenCV

If you encounter issues with OpenCV:
- Check the logs in your Render dashboard
- Verify that the system packages in `apt-packages` are being installed
- Try increasing the memory allocation in your Render settings

### CORS Issues

If you encounter CORS issues:
- Verify that the `ALLOWED_ORIGINS` environment variable includes your frontend URL
- Check that the format is correct (comma-separated, no spaces)

### DeepFace Issues

If DeepFace is having problems:
- Check Render logs for specific error messages
- Consider using a higher tier instance (Basic) if running into memory issues

## Monitoring Your Deployment

Render provides several tools to monitor your deployment:
- Live logs
- Health status
- Instance metrics

Visit your service in the Render dashboard to access these features.
