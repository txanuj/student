# 🚀 Running the App Locally - Quick Guide

## 📦 One-Click Start (Easiest!)

Just double-click: **`quick-start.bat`**

This will:
1. Install dependencies (if needed)
2. Start MongoDB
3. Start the server
4. Open your browser automatically!

## 📋 Manual Setup (First Time Only)

### Step 1: Run Setup
Double-click: **`setup.bat`**

This will:
- Check if Node.js is installed
- Install npm dependencies
- Create .env file
- Start MongoDB
- Seed database with demo data

### Step 2: Start Server
Double-click: **`start-server.bat`**

### Step 3: Open Browser
Go to: **http://localhost:5000**

Login with:
- Email: `admin@college.edu`
- Password: `admin123`

## 🛑 Stopping the Server

Double-click: **`stop-server.bat`**

This will stop both Node.js and MongoDB services.

## 📁 Batch Files Included

| File | Purpose |
|------|---------|
| `quick-start.bat` | ⚡ One-click start everything |
| `setup.bat` | 🔧 First-time setup |
| `start-server.bat` | ▶️ Start the server |
| `stop-server.bat` | ⏹️ Stop all services |
| `start-mongodb.bat` | 🗄️ Start MongoDB only |

## ⚙️ Requirements

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud) - no local install needed!

## 🔧 Configuration

Edit `.env` file to configure:
```env
MONGODB_URI=mongodb://localhost:27017/inventory-system
JWT_SECRET=your-secret-key
PORT=5000
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory-system
```

## 🐛 Troubleshooting

### "Node.js is not installed"
Download and install from: https://nodejs.org/

### "MongoDB is not installed"
**Option 1:** Install locally from: https://www.mongodb.com/try/download/community

**Option 2:** Use MongoDB Atlas (cloud):
1. Create free account at: https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### Port 5000 already in use
Change `PORT=5000` to `PORT=3000` in `.env` file

### Database seeding fails
Make sure MongoDB is running:
```bash
net start MongoDB
```

Or check your MongoDB Atlas connection string.

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Seed database
npm run seed

# Start server (development)
npm run dev

# Start server (production)
npm start
```

## 📊 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Lab Staff | lab@college.edu | lab123 |
| Library | library@college.edu | library123 |
| Sports | sports@college.edu | sports123 |
| Hostel | hostel@college.edu | hostel123 |

## 🌐 Deployment

Your app is also live on Railway!

Check `RAILWAY_DEPLOYED.md` for your live URL.

---

**For the easiest experience, just run `quick-start.bat`!** 🚀
