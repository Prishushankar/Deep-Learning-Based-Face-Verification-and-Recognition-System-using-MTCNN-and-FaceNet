# Face Recognition Comparison App

A web application that compares face images and determines if they are of the same person. Built with FastAPI backend and React frontend.

## Project Structure

```
faceRecognition/
├── backend/          # FastAPI backend
└── frontend/         # React frontend (Vite)
```

## Backend Setup

### Requirements

- Python 3.9+
- FastAPI
- DeepFace
- Other dependencies in requirements.txt

### Local Development

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the server:
```bash
uvicorn main:app --reload --port 8001
```

The API will be available at `http://localhost:8001`

### Backend Deployment Options

#### Option 1: Deploy to Heroku

1. Create a Heroku account if you don't have one.
2. Install the Heroku CLI.
3. Login to Heroku:
```bash
heroku login
```

4. Create a new Heroku app:
```bash
heroku create your-app-name
```

5. Set up Git and push to Heroku:
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

6. Set environment variables if needed:
```bash
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Option 2: Deploy to Render

1. Create a Render account.
2. Create a new Web Service.
3. Connect to your GitHub repository.
4. Configure settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add environment variable `ALLOWED_ORIGINS`

#### Option 3: Deploy to a VPS

1. Set up a server with Python 3.9+.
2. Clone your repository.
3. Set up a virtual environment and install dependencies.
4. Use Gunicorn with Uvicorn workers:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```
5. Set up Nginx as a reverse proxy.
6. Use systemd or supervisor to keep the application running.

## Frontend Setup

### Requirements

- Node.js 16+
- npm or yarn

### Local Development

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the backend URL:
```
VITE_API_URL=http://localhost:8001
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Frontend Deployment Options

#### Option 1: Deploy to Vercel

1. Create a Vercel account and install the Vercel CLI.
2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Deploy with Vercel:
```bash
vercel
```

4. Set the environment variable `VITE_API_URL` to your backend URL in the Vercel dashboard.

#### Option 2: Deploy to Netlify

1. Create a Netlify account.
2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Build the frontend:
```bash
cd frontend
npm run build
```

4. Deploy with Netlify:
```bash
netlify deploy
```

5. Set the environment variable `VITE_API_URL` in the Netlify dashboard.

#### Option 3: Deploy as Static Files

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The output will be in the `dist` directory, which you can serve using any static file server like Nginx, Apache, or GitHub Pages.

## Pushing to Your GitHub Repository

1. Initialize Git in the project root if not already done:
```bash
cd c:\Users\Priyanshu Shankar\Desktop\MMUY\Model\Model\protoype
git init
```

2. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/Prishushankar/faceRecognition.git
```

3. Add and commit your changes:
```bash
git add .
git commit -m "Initial commit"
```

4. Push to GitHub:
```bash
git push -u origin main
```

## Environment Variables

### Backend
- `PORT`: The port to run the server on (default: 8001)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

### Frontend
- `VITE_API_URL`: The URL of the backend API

## Application Features

- Face comparison between multiple images
- Distance metrics for face similarity
- Clear visual indication of matching results
- Responsive UI
