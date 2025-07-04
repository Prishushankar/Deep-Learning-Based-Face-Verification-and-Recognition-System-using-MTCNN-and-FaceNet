#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=== Starting build process for Face Comparison API ==="
echo "Build environment info:"
echo "Current directory: $(pwd)"
echo "User: $(whoami)"
echo "Available Python versions:"
ls -la /usr/bin/python* 2>/dev/null || echo "Standard Python locations not found"

# Check for Python 3.9 specifically
if command -v python3.9 &> /dev/null; then
    echo "Found python3.9 at: $(which python3.9)"
    # Create symlinks to ensure python3.9 is used
    mkdir -p /tmp/python-override
    ln -sf $(which python3.9) /tmp/python-override/python
    ln -sf $(which python3.9) /tmp/python-override/python3
    export PATH="/tmp/python-override:$PATH"
fi

echo "Python version check:"
python --version
python3 --version 2>/dev/null || echo "python3 not available"

# Critical check - fail immediately if Python 3.13 is detected
PYTHON_VERSION=$(python --version 2>&1)
if echo "$PYTHON_VERSION" | grep -q "3.13"; then
    echo "❌ CRITICAL ERROR: Python 3.13 detected!"
    echo "Current Python: $PYTHON_VERSION"
    echo ""
    echo "🚨 DEPLOYMENT FAILED - PYTHON VERSION MISMATCH 🚨"
    echo ""
    echo "This deployment REQUIRES Python 3.9.18 for ML dependencies compatibility."
    echo "Render is using Python 3.13 which is incompatible with TensorFlow 2.15.0"
    echo ""
    echo "REQUIRED ACTIONS:"
    echo "1. DELETE your current Render service completely"
    echo "2. Create a NEW Render service" 
    echo "3. In the service settings, explicitly select 'Python 3.9.18'"
    echo "4. Do NOT select 'Python 3.13' or 'Latest'"
    echo "5. Redeploy from GitHub"
    echo ""
    echo "The runtime.txt file specifies python-3.9.18 but Render is ignoring it."
    echo "You MUST manually select Python 3.9.18 in the Render dashboard."
    exit 1
fi

# Verify we have Python 3.9
if ! echo "$PYTHON_VERSION" | grep -q "3.9"; then
    echo "⚠️  WARNING: Python 3.9 not detected!"
    echo "Current Python: $PYTHON_VERSION"
    echo "Expected: Python 3.9.x"
    echo "ML dependencies may fail to install or work properly."
fi

echo "✅ Python version check passed: $PYTHON_VERSION"

echo "=== Installing system dependencies ==="
# Update package lists
apt-get update -y

# Install essential build tools first
apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    cmake \
    python3-dev

# Install system dependencies for OpenCV and other packages
apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libice6 \
    libfontconfig1 \
    libatlas-base-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    ffmpeg

echo "=== Configuring Python environment ==="
# Upgrade pip with version constraints for Python 3.9 compatibility
python -m pip install --upgrade "pip<24.0" "setuptools<70.0" "wheel<0.43.0"

# Set environment variables for better compilation
export CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS"
export FORCE_CMAKE=1
export PYTHONUNBUFFERED=1

echo "=== Installing Python dependencies in optimized order ==="

# Install core FastAPI stack first
echo "Installing FastAPI core..."
pip install --no-cache-dir fastapi==0.104.1 pydantic==2.5.0 uvicorn==0.24.0 requests==2.31.0

# Install numerical foundation
echo "Installing numerical libraries..."
pip install --no-cache-dir numpy==1.24.3 scipy==1.11.4

# Install image processing
echo "Installing image processing libraries..."
pip install --no-cache-dir Pillow==10.0.1 opencv-python-headless==4.8.1.78

# Install data science tools
echo "Installing pandas and scikit-learn..."
pip install --no-cache-dir pandas==2.1.4 scikit-learn==1.3.2

# Install face detection
echo "Installing MTCNN for face detection..."
pip install --no-cache-dir mtcnn==0.1.1

# Install TensorFlow (this is the critical package)
echo "Installing TensorFlow 2.15.0 (this may take several minutes)..."
pip install --no-cache-dir --timeout 1200 tensorflow==2.15.0

# Install DeepFace (depends on TensorFlow)
echo "Installing DeepFace..."
pip install --no-cache-dir deepface==0.0.79

echo "=== Verifying critical installations ==="
echo "Testing imports..."
python -c "import tensorflow as tf; print(f'✅ TensorFlow {tf.__version__} imported successfully')" || echo "❌ TensorFlow import failed"
python -c "import cv2; print(f'✅ OpenCV {cv2.__version__} imported successfully')" || echo "❌ OpenCV import failed"
python -c "import deepface; print('✅ DeepFace imported successfully')" || echo "❌ DeepFace import failed"
python -c "import mtcnn; print('✅ MTCNN imported successfully')" || echo "❌ MTCNN import failed"

echo "=== Build completed successfully! ==="
echo "Final package list:"
pip list | grep -E "(tensorflow|opencv|deepface|mtcnn|fastapi)"
