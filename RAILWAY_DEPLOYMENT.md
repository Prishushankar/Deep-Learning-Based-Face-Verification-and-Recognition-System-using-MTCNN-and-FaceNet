# Railway.app Deployment Guide for Face Recognition API

## Quick Deployment Steps

1. **Sign up for Railway**: Go to https://railway.app and sign up with GitHub

2. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `faceRecognition` repository

3. **Configure the Service**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**:
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:5173`
   - `PYTHONUNBUFFERED`: `1`

5. **Deploy**: Click Deploy and wait for the build to complete

## Why Railway Works Better for ML

- Better Python dependency management
- More generous build timeouts
- Better support for NumPy/OpenCV compilation
- Automatic HTTPS and custom domains

## Alternative Platforms

If Railway doesn't work, try:
- **Heroku**: Classic platform, good Python support
- **Google Cloud Run**: Containerized deployment
- **AWS Lambda**: For serverless deployment (may need adjustments)
