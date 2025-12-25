# 🚀 Vercel Deployment Guide

## Step 1: Deploy Backend to Railway (Required First)

Since Vercel is primarily for frontend, we need to deploy the backend separately.

### Deploy Backend to Railway:
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `hardikmishra0910/Tasks-Manager-dashboard`
5. Railway will auto-detect and deploy the backend

### Configure Backend Environment Variables:
In Railway dashboard → Variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-mongodb-atlas-connection-string
```

### Get Backend URL:
After deployment, copy the Railway URL (something like):
`https://tasks-manager-dashboard-backend-production.up.railway.app`

## Step 2: Deploy Frontend to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

### Option B: Vercel Dashboard
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository: `hardikmishra0910/Tasks-Manager-dashboard`
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Configure Environment Variables in Vercel
In Vercel dashboard → Project Settings → Environment Variables:

```
REACT_APP_API_URL = https://your-railway-backend-url.up.railway.app/api
REACT_APP_APP_NAME = Task Management Dashboard
REACT_APP_VERSION = 1.0.0
```

## Quick Commands for Deployment

```bash
# Test build locally first
cd frontend
npm run build

# Deploy to Vercel (if CLI installed)
vercel --prod

# Or deploy with specific settings
vercel --prod --build-env REACT_APP_API_URL=https://your-backend-url.up.railway.app/api
```

## 🎯 Expected Results

After successful deployment:
- **Frontend URL**: `https://your-project-name.vercel.app`
- **Backend URL**: `https://your-backend-name.up.railway.app`
- **GitHub Repo**: `https://github.com/hardikmishra0910/Tasks-Manager-dashboard`

## 🔧 Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (use 18+)
2. **API calls fail**: Verify backend URL in environment variables
3. **CORS errors**: Ensure backend allows your Vercel domain

### Vercel Build Settings:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Root Directory: `frontend`

## 🚀 Auto-Deploy Setup

Once connected to GitHub, Vercel will automatically deploy on every push to main branch!

## Next Steps After Deployment

1. Test all functionality on the live site
2. Update README.md with live URLs
3. Share the live demo link!

**Live Demo**: https://your-project-name.vercel.app