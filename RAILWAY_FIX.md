# 🔧 Railway Deployment Fix - MongoDB Missing

## ❌ Problem
Your app is trying to connect to `localhost:27017` (local MongoDB) but Railway doesn't have MongoDB set up yet!

## ✅ Solution: Add MongoDB to Railway

### Step 1: Add MongoDB Database

1. **Go to Railway Dashboard**: [railway.app/dashboard](https://railway.app/dashboard)
2. Click on your **"Student"** project
3. Click the **"+ New"** button (top right)
4. Select **"Database"**
5. Choose **"Add MongoDB"**
6. Railway will automatically:
   - Create a MongoDB instance
   - Set the `MONGODB_URI` environment variable
   - Connect it to your service

### Step 2: Add JWT_SECRET

1. In your project, click on your **"student"** service (not the MongoDB)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   - **Variable**: `JWT_SECRET`
   - **Value**: `your-super-secret-jwt-key-change-this-in-production-min-32-chars`
5. Click **"Add"**

### Step 3: Redeploy

Railway should auto-redeploy after adding variables. If not:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment

OR use CLI:
```bash
railway up
```

### Step 4: Seed Database (After Successful Deploy)

Once the app is running:
```bash
railway run npm run seed
```

## 🎯 Quick Checklist

- [ ] MongoDB database added to project
- [ ] `JWT_SECRET` variable set
- [ ] App redeployed successfully
- [ ] Database seeded with demo data

## 🔍 Verify It's Working

After adding MongoDB and redeploying:

1. **Check deployment status**:
   ```bash
   railway status
   ```

2. **View logs** (should show "MongoDB connected successfully"):
   ```bash
   railway logs
   ```

3. **Open your app**:
   ```bash
   railway open
   ```

## 📸 What You Should See in Railway

Your project should have **2 services**:
1. **student** (your Node.js app) - with globe icon 🌐
2. **MongoDB** (database) - with database icon 🗄️

## ⚠️ Common Issues

### "MONGODB_URI is undefined"
- Make sure MongoDB is added to the same project
- Railway auto-sets `MONGODB_URI` when you add MongoDB

### Still getting errors?
Check logs:
```bash
railway logs --follow
```

Look for:
- ✅ "MongoDB connected successfully"
- ✅ "Server running on port..."

---

**After fixing, your app will be live!** 🚀

Run `railway open` to access it!
