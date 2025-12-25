# 🚀 Complete Deployment Guide

## Backend Deployment (Railway) - Step 1

### 1. Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `hardikmishra0910/Tasks-Manager-dashboard`
5. Railway will auto-detect the backend and deploy it

### 2. Configure Environment Variables
In Railway dashboard:
- Go to your project → Variables tab
- Add these variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
```

### 3. Get Backend URL
After deployment, Railway will give you a URL like:
`https://tasks-manager-dashboard-backend-production.up.railway.app`

## Frontend Deployment (Netlify) - Step 2

### Option A: Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project root
netlify deploy --prod --dir=frontend/dist --build
```

### Option B: Netlify Dashboard
1. Go to [Netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Select your GitHub repository
5. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

### 3. Update Environment Variables
In Netlify dashboard → Site settings → Environment variables:
```
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app/api
REACT_APP_APP_NAME=Task Management Dashboard
REACT_APP_VERSION=1.0.0
```

## Quick Deploy Commands

```bash
# Build frontend locally to test
cd frontend
npm run build

# Deploy to Netlify (if CLI installed)
netlify deploy --prod --dir=dist
```

## 🎯 Final URLs
- **Frontend**: https://your-app-name.netlify.app
- **Backend**: https://your-app-name.up.railway.app
- **GitHub**: https://github.com/hardikmishra0910/Tasks-Manager-dashboard

## 🔧 Troubleshooting
- If build fails, check Node.js version (use Node 18+)
- If API calls fail, verify CORS settings in backend
- If MongoDB connection fails, check connection string format