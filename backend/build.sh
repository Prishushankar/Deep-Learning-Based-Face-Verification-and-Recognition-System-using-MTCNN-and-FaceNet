#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Starting build process for Face Comparison API..."

# Install system dependencies for OpenCV and Pillow
echo "Installing system dependencies..."
apt-get update -y
if [ -f apt-packages ]; then
  apt-get install -y $(cat apt-packages)
fi

if [ -f apt.txt ]; then
  apt-get install -y $(cat apt.txt)
fi

# Upgrade pip and setuptools
echo "Upgrading pip and setuptools..."
pip install --upgrade pip setuptools wheel

# Install core dependencies individually to avoid build issues
echo "Installing core dependencies..."
pip install fastapi==0.104.1
pip install pydantic==2.5.0
pip install uvicorn==0.24.0
pip install requests==2.31.0
pip install numpy==1.24.3

# Install remaining packages from simplified requirements
echo "Installing remaining dependencies..."
pip install -r requirements-simple.txt

# Print Python and pip versions for debugging
echo "Python version:"
python --version
echo "Pip version:"
pip --version
echo "Installed packages:"
pip list

echo "Build completed successfully!"
