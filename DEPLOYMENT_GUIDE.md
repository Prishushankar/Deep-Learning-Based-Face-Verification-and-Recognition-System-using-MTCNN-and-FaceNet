# Deployment Guide

This guide provides detailed instructions for deploying the Face Recognition Comparison App to various platforms.

## Backend Deployment

### Option 1: Heroku Deployment

1. **Sign up for Heroku**
   - Create an account at [heroku.com](https://heroku.com)

2. **Install Heroku CLI**
   ```powershell
   # Using chocolatey
   choco install heroku-cli
   # Or download from Heroku website
   ```

3. **Login to Heroku**
   ```powershell
   heroku login
   ```

4. **Create a Heroku app**
   ```powershell
   cd backend
   heroku create face-recognition-api
   ```

5. **Add buildpacks for OpenCV and TensorFlow dependencies**
   ```powershell
   heroku buildpacks:add --index 1 heroku/python
   heroku buildpacks:add --index 2 https://github.com/heroku/heroku-buildpack-apt
   ```

6. **Create an Aptfile in backend folder**
   Create a file named `Aptfile` with:
   ```
   libsm6
   libxext6
   libxrender-dev
   libgl1-mesa-glx
   ```

7. **Deploy to Heroku**
   ```powershell
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

8. **Set environment variables**
   ```powershell
   heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

9. **Verify deployment**
   ```powershell
   heroku open
   ```

### Option 2: Render Deployment

1. **Sign up for Render**
   - Create an account at [render.com](https://render.com)

2. **Create a new Web Service**
   - Connect to your GitHub repository
   - Select the `backend` directory
   - Choose "Python" as the environment
   
3. **Configure the service**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add the environment variable:
     - Key: `ALLOWED_ORIGINS`
     - Value: `https://your-frontend-domain.com`

4. **Deploy**
   - Click "Create Web Service"

### Option 3: Docker Deployment

1. **Create a Dockerfile in backend folder**
   ```dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   # Install dependencies for OpenCV
   RUN apt-get update && apt-get install -y \
       libsm6 \
       libxext6 \
       libxrender1 \
       libgl1-mesa-glx \
       && rm -rf /var/lib/apt/lists/*

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${PORT:-8001}"]
   ```

2. **Build and run the Docker image**
   ```powershell
   docker build -t face-recognition-api .
   docker run -p 8001:8001 -e ALLOWED_ORIGINS=https://your-frontend-domain.com face-recognition-api
   ```

## Frontend Deployment

### Option 1: Vercel Deployment

1. **Sign up for Vercel**
   - Create an account at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```powershell
   vercel login
   ```

4. **Deploy to Vercel**
   ```powershell
   cd frontend
   vercel
   ```

5. **Set environment variables**
   - In the Vercel dashboard, add:
     - `VITE_API_URL`: Your backend URL (e.g., `https://face-recognition-api.herokuapp.com`)

6. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Option 2: Netlify Deployment

1. **Sign up for Netlify**
   - Create an account at [netlify.com](https://netlify.com)

2. **Install Netlify CLI**
   ```powershell
   npm install -g netlify-cli
   ```

3. **Login to Netlify**
   ```powershell
   netlify login
   ```

4. **Build the project**
   ```powershell
   cd frontend
   npm run build
   ```

5. **Deploy to Netlify**
   ```powershell
   netlify deploy
   ```

6. **Set environment variables**
   - In the Netlify dashboard, add:
     - `VITE_API_URL`: Your backend URL

### Option 3: GitHub Pages Deployment

1. **Install gh-pages package**
   ```powershell
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Add deploy scripts to package.json**
   Add the following to your package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Set the base in vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/faceRecognition/'
   })
   ```

4. **Deploy to GitHub Pages**
   ```powershell
   npm run deploy
   ```

5. **Set environment variables**
   Create a `.env.production` file with:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

## Full-Stack Deployment with Railway

Railway is a platform that allows you to deploy both frontend and backend easily.

1. **Sign up for Railway**
   - Create an account at [railway.app](https://railway.app)

2. **Install Railway CLI**
   ```powershell
   npm i -g @railway/cli
   ```

3. **Login to Railway**
   ```powershell
   railway login
   ```

4. **Initialize a new project**
   ```powershell
   railway init
   ```

5. **Deploy backend**
   ```powershell
   cd backend
   railway up
   ```

6. **Deploy frontend**
   ```powershell
   cd frontend
   railway up
   ```

7. **Set environment variables**
   - In Railway dashboard, set variables for both services

## Domain Configuration

After deploying your application, you might want to configure a custom domain:

1. Purchase a domain from a domain registrar (Namecheap, GoDaddy, Google Domains, etc.)
2. Configure DNS settings to point to your deployment platform
3. Add the domain in your deployment platform's dashboard
4. Update ALLOWED_ORIGINS in your backend to include your custom domain
5. Update VITE_API_URL in your frontend to use your backend's custom domain
