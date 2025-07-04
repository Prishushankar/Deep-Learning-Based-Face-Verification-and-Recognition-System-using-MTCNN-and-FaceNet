# Render Deployment Guide - Face Comparison API

## 🚨 CRITICAL PYTHON VERSION ISSUE

**MAJOR PROBLEM**: Render is defaulting to Python 3.13 even when Python 3.9.18 is specified in configuration files. Our ML dependencies (TensorFlow 2.15.0, DeepFace) are **INCOMPATIBLE** with Python 3.13.

### Signs of Python 3.13 Being Used (BUILD WILL FAIL):
- Build logs show: `/opt/render/project/src/.venv/lib/python3.13/site-packages/pip/`
- TensorFlow installation fails with: `No matching distribution found for tensorflow==2.15.0`
- Build script shows: `❌ CRITICAL ERROR: Python 3.13 detected!`

### 🛠️ SOLUTION: Manual Service Creation

**You MUST manually create the service and explicitly select Python 3.9.18**

## Step-by-Step Deployment

### Step 1: Delete Any Existing Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. If you have an existing `face-comparison-api` service, **DELETE IT COMPLETELY**
3. Wait for deletion to complete

### Step 2: Create New Web Service (Manual Setup)
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. **CRITICAL CONFIGURATION**:
   - **Name**: `face-comparison-api`
   - **Runtime**: `Python`
   - **Python Version**: **3.9.18** ⚠️ **SELECT THIS FROM DROPDOWN - DO NOT USE "Latest"**
   - **Root Directory**: `backend`
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (for testing)

### Step 3: Environment Variables
Add these variables:
```
ALLOWED_ORIGINS = *
PYTHONUNBUFFERED = 1
PYTHON_VERSION = 3.9.18
PIP_NO_CACHE_DIR = 1
PYTHONDONTWRITEBYTECODE = 1
```

### Step 4: Deploy and Monitor Build

1. Click **"Create Web Service"**
2. **IMMEDIATELY check build logs** for:
   ```
   ✅ Python version check passed: Python 3.9.x
   ```
3. **If you see Python 3.13**, STOP deployment and delete service

### Build Process (10-15 minutes)
The build script will:
1. Check Python version (fails if 3.13 detected)
2. Install system dependencies (OpenCV, build tools)
3. Install Python packages in order:
   - FastAPI core
   - NumPy, SciPy
   - OpenCV, Pillow
   - TensorFlow 2.15.0
   - DeepFace

### Expected Success Messages:
```
✅ Python version check passed: Python 3.9.18
✅ TensorFlow 2.15.0 imported successfully
✅ OpenCV 4.8.1 imported successfully
✅ DeepFace imported successfully
✅ MTCNN imported successfully
=== Build completed successfully! ===
```

## Testing Deployment

Once deployed successfully:

### 1. Basic Health Check
```bash
curl https://your-service-name.onrender.com/
# Expected: {"message": "Face Comparison API is running"}
```

### 2. Detailed Health Check
```bash
curl https://your-service-name.onrender.com/health
# Expected: Complete system status with ML library versions
```

### 3. Face Comparison Test
```bash
curl -X POST "https://your-service-name.onrender.com/compare-faces" \
  -H "Content-Type: application/json" \
  -d '{
    "image1_url": "https://example.com/person1.jpg",
    "image2_url": "https://example.com/person2.jpg"
  }'
```

## Troubleshooting

### Python Version Issues

**Problem**: Build fails with Python 3.13
```
❌ CRITICAL ERROR: Python 3.13 detected!
🚨 DEPLOYMENT FAILED - PYTHON VERSION MISMATCH 🚨
```

**Solution**:
1. Delete the service completely
2. Create a new service
3. **Manually select Python 3.9.18** in the dropdown
4. Do not select "Latest" or any 3.13.x version

### TensorFlow Installation Failures

**Problem**: 
```
ERROR: No matching distribution found for tensorflow==2.15.0
```

**Cause**: Python 3.13 is being used (TensorFlow doesn't support it yet)
**Solution**: Follow Python version fix above

### Memory Issues During Build

**Problem**: Build fails with out-of-memory errors

**Solutions**:
1. Upgrade to paid plan (more build memory)
2. Or try smaller dependency chunks in build script

### OpenCV Runtime Issues

**Problem**: 
```
ImportError: libGL.so.1: cannot open shared object file
```

**Solution**: The `apt-packages` file should handle this, but verify:
- `libgl1-mesa-glx` is installed
- System dependencies completed successfully

## Frontend Integration

After successful backend deployment:

### 1. Update Frontend Environment
In your frontend project, update `.env`:
```
VITE_API_URL=https://your-render-service-name.onrender.com
```

### 2. Update CORS Settings
In backend deployment, set:
```
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:5173
```

## Alternative Solutions

If Render continues to use Python 3.13 despite manual selection:

### Option 1: Docker Deployment
1. Switch to Docker runtime in Render
2. Use explicit Python 3.9.18 base image
3. Custom Dockerfile with ML dependencies

### Option 2: Different Platform
Consider deploying to:
- Railway (better Python version control)
- Google Cloud Run
- AWS Lambda (with custom layers)
- Heroku (if still available)

## Files Reference

Your repository should have these files:

```
backend/
├── main.py              # FastAPI app
├── url.py               # Face comparison logic
├── requirements.txt     # ML dependencies
├── runtime.txt          # python-3.9.18
├── .python-version      # 3.9.18
├── build.sh             # Custom build script
├── apt-packages         # System dependencies
└── Procfile             # Process definition

render.yaml              # Render configuration
RENDER_DEPLOYMENT.md     # This guide
```

## Getting Help

If deployment still fails after following this guide:

1. Check [Render Status Page](https://status.render.com/)
2. Contact Render support about Python version selection issues
3. Share build logs that show Python 3.13 being used despite 3.9.18 configuration
4. Consider the alternative deployment options mentioned above

---

**Key Success Factor**: Ensuring Python 3.9.18 is actually used (not just configured). This is currently the main blocker for ML-heavy deployments on Render.
