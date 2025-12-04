# 🚀 Deployment Guide

## GitHub Setup

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: AI-Powered Inventory Management System"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `inventory-management-system`
3. **Don't** initialize with README (we already have one)

### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-system.git
git branch -M main
git push -u origin main
```

## Netlify Deployment (Frontend + Serverless)

### Option 1: Netlify UI

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure:
   - Build command: `npm install`
   - Publish directory: `client`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
6. Deploy!

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Heroku Deployment (Full Stack)

### 1. Install Heroku CLI

Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

### 2. Deploy

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main

# Open app
heroku open
```

## Railway Deployment

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add MongoDB plugin
5. Set environment variables
6. Deploy automatically!

## Render Deployment

1. Go to [Render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Create Web Service

## Environment Variables

For all platforms, set these:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory-system
JWT_SECRET=your-super-secret-key-min-32-characters
PORT=5000
NODE_ENV=production
```

## MongoDB Atlas Setup (For Cloud Deployment)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Database Access → Add user
4. Network Access → Add IP (0.0.0.0/0 for all)
5. Connect → Get connection string
6. Replace `<password>` with your password
7. Add to environment variables

## Post-Deployment

### Seed Database

```bash
# Heroku
heroku run npm run seed

# Railway/Render
# Use their CLI or dashboard to run: npm run seed
```

### Test Deployment

1. Visit your deployed URL
2. Login with: `admin@college.edu` / `admin123`
3. Test all features

## Troubleshooting

### MongoDB Connection Error
- Check connection string format
- Verify IP whitelist (0.0.0.0/0)
- Ensure user has correct permissions

### Build Fails
- Check Node.js version (use 18+)
- Verify all dependencies in package.json
- Check build logs

### 404 Errors
- Ensure redirects are configured (netlify.toml)
- Check publish directory setting

## Custom Domain

### Netlify
1. Domain settings → Add custom domain
2. Update DNS records
3. Enable HTTPS

### Heroku
```bash
heroku domains:add www.yourdomain.com
```

## Continuous Deployment

All platforms auto-deploy on git push to main branch!

```bash
git add .
git commit -m "Update feature"
git push origin main
# Automatically deploys! 🚀
```

## Security Checklist

- ✅ Change JWT_SECRET in production
- ✅ Use strong MongoDB password
- ✅ Enable HTTPS
- ✅ Set NODE_ENV=production
- ✅ Whitelist specific IPs if possible
- ✅ Regular security updates

---

Need help? Check platform-specific docs or open an issue!
