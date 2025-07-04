# Render Deployment Guide for Face Recognition API - PYTHON 3.9 REQUIRED

## ⚠️ CRITICAL: Manual Setup Required

Render may not be respecting the render.yaml file. Please follow these EXACT steps:

### Step 1: Delete Existing Service (if any)
- Go to your Render dashboard
- Delete any existing face-comparison-api service

### Step 2: Create New Web Service Manually
1. Click "New +" → "Web Service"
2. Connect to GitHub repository: `Prishushankar/faceRecognition`
3. Configure EXACTLY as follows:

**Basic Settings:**
- Name: `face-comparison-api`
- Root Directory: `backend`
- Runtime: `Python 3`
- Python Version: `3.9.18` (CRITICAL - NOT 3.13!)

**Build & Deploy:**
- Build Command: `chmod +x build.sh && ./build.sh`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
- `ALLOWED_ORIGINS` = `*`
- `PYTHONUNBUFFERED` = `1`
- `PYTHON_VERSION` = `3.9.18`

### Step 3: Deploy
- Click "Create Web Service"
- Monitor the build logs carefully
- If you see "Python 3.13" anywhere in logs, STOP and check settings
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
