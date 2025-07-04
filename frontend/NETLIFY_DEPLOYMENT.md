# Frontend Deployment Guide - Netlify

This guide will help you deploy the Face Comparison React frontend to Netlify, which offers free hosting for frontend applications with automatic builds from GitHub.

## Prerequisites

1. GitHub account with your code committed to https://github.com/Prishushankar/faceRecognition.git
2. Netlify account (Sign up at https://netlify.com/ - you can sign up with your GitHub account)

## Deployment Steps

### 1. Sign in to Netlify

- Go to https://netlify.com/
- Sign in with GitHub for easiest setup

### 2. Create a New Site

- Click "Add new site" → "Import an existing project" 
- Select "GitHub" as the Git provider
- Authorize Netlify to access your GitHub account if prompted
- Select your repository "Prishushankar/faceRecognition"

### 3. Configure Build Settings

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`
- **Advanced build settings**:
  - Click "Add a variable"
  - Add the environment variable `VITE_API_URL` with the value of your backend URL (e.g., `https://face-comparison-api.onrender.com`)

### 4. Deploy Site

- Click "Deploy site"
- Wait for the deployment to complete (usually takes 1-2 minutes)
- Netlify will provide you with a random URL for your site (e.g., https://face-recognition-xyz.netlify.app)

### 5. Verify Your Deployment

- Open the provided URL in your browser
- Test the application with some image URLs
- If there are issues connecting to the backend, check that the `VITE_API_URL` environment variable is set correctly

## Customizing Your Deployment

### Custom Domain

If you want to use a custom domain:

1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter your domain and follow the instructions to configure DNS

### Environment Variables

If you need to update the backend URL after deployment:

1. Go to "Site settings" → "Environment variables"
2. Update the `VITE_API_URL` value
3. Trigger a new deployment by clicking "Clear cache and deploy site" under "Deploys"

## Netlify Specific Features

### Netlify Redirects

To ensure all routes work correctly with React Router (if you're using it), create a `_redirects` file in your `frontend/public` directory with:

```
/* /index.html 200
```

This ensures that all routes are handled by your React application.

## Troubleshooting

### Build Failures

If your build fails, check the deploy logs for errors:

1. Common issues include:
   - Missing dependencies
   - Build script errors
   - Incorrect environment variables

2. Make any necessary fixes in your GitHub repository
3. Netlify will automatically attempt to deploy again after you push changes

### CORS Issues

If you see CORS errors in the browser console:

1. Make sure your backend's `ALLOWED_ORIGINS` environment variable includes your Netlify URL
2. Update the backend configuration and redeploy if necessary
