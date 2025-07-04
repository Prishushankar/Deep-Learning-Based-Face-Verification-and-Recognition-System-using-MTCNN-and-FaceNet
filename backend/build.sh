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

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Try binary wheels first
echo "Installing Python packages with wheels..."
pip install --only-binary=:all: -r requirements.txt || true

# If that failed, try again with regular install
echo "Installing any remaining packages..."
pip install --no-cache-dir -r requirements.txt

# Print Python and pip versions for debugging
echo "Python version:"
python --version
echo "Pip version:"
pip --version
echo "Installed packages:"
pip list

echo "Build completed successfully!"
