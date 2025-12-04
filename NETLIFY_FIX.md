# 🚀 Netlify Deployment Fix Guide

## Problem
Netlify only hosts **static files** (HTML/CSS/JS). Your Node.js backend with MongoDB isn't running!

## Solution: Split Deployment

### Step 1: Deploy Backend to Render (Free)

1. **Go to [Render.com](https://render.com)**
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your repository: `txanuj/student`
5. Configure:
   - **Name**: `inventory-backend`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/inventory-system
   JWT_SECRET = your-super-secret-jwt-key-change-this
   PORT = 5000
   NODE_ENV = production
   ```

7. Click **"Create Web Service"**
8. Wait for deployment (5-10 minutes)
9. **Copy your URL**: `https://inventory-backend-xxxx.onrender.com`

### Step 2: Update Frontend to Use Backend URL

1. Open `client/js/auth.js`
2. Find this line:
   ```javascript
   : 'https://YOUR_BACKEND_URL.onrender.com/api';
   ```
3. Replace with your Render URL:
   ```javascript
   : 'https://inventory-backend-xxxx.onrender.com/api';
   ```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Update API URL for Render backend"
git push origin main
```

Netlify will auto-deploy the updated frontend!

### Step 4: Seed Database (One-time)

In Render dashboard:
1. Go to your service
2. Click "Shell" tab
3. Run: `npm run seed`

## Alternative: Deploy Everything to Render

Instead of Netlify, deploy the full app to Render:

1. Same steps as above for backend
2. Render will automatically serve your `client/` folder
3. No need to update API URLs!
4. Access at: `https://inventory-backend-xxxx.onrender.com`

## Alternative: Use Railway (Easier)

1. Go to [Railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select `txanuj/student`
4. Add MongoDB plugin
5. Set environment variables
6. Deploy!
7. Railway gives you one URL for everything

## Quick Comparison

| Platform | Frontend | Backend | Database | Complexity |
|----------|----------|---------|----------|------------|
| Netlify + Render | ✅ | ✅ | Separate | Medium |
| Render Only | ✅ | ✅ | Separate | Easy |
| Railway | ✅ | ✅ | ✅ Built-in | Easiest |
| Heroku | ✅ | ✅ | ✅ Addon | Easy |

## Recommended: Use Railway

**Simplest solution:**
1. Go to railway.app
2. Deploy from GitHub
3. Add MongoDB plugin
4. Done! One URL for everything

---

**Current Issue**: Your Netlify site can't reach the backend because it's not deployed.
**Fix**: Deploy backend to Render/Railway, then update the API URL in `auth.js`

Need help? Let me know which platform you prefer!
