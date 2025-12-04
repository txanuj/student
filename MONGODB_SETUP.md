# 🚀 Local MongoDB Setup Guide

## Option 1: Install MongoDB Community Edition (Recommended)

### For Windows:

1. **Download MongoDB**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows" and download the MSI installer
   - Version: 7.0 or later

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **IMPORTANT**: Check "Install MongoDB as a Service"
   - **IMPORTANT**: Check "Install MongoDB Compass" (GUI tool)
   - Click "Install"

3. **Verify Installation**
   ```bash
   mongod --version
   ```
   
   You should see the MongoDB version number.

4. **MongoDB is now running!**
   - MongoDB runs automatically as a Windows service
   - Default connection: `mongodb://localhost:27017`
   - No configuration needed!

### For Mac:

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### For Linux (Ubuntu/Debian):

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 2: Use Docker (If you have Docker installed)

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# MongoDB is now running on localhost:27017
```

## ✅ Your .env is Already Configured!

The `.env` file is already set to use local MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/inventory-system
```

## 🧪 Test Your Setup

1. **Seed the database**:
   ```bash
   npm run seed
   ```

2. **Expected output**:
   ```
   ✅ Connected to MongoDB
   ✅ Created 5 users
   ✅ Created 20 items
   ✅ Created 3 sample requests
   🎉 Database seeding completed successfully!
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open browser**:
   ```
   http://localhost:5000
   ```

## 🔍 Verify MongoDB is Running

### Windows:
```bash
# Check if MongoDB service is running
sc query MongoDB
```

### Mac/Linux:
```bash
# Check if MongoDB is running
ps aux | grep mongod
```

### Using MongoDB Compass (GUI):
1. Open MongoDB Compass (installed with MongoDB)
2. Connect to: `mongodb://localhost:27017`
3. You should see your databases

## 🛠️ Troubleshooting

### Error: "MongoServerSelectionError: connect ECONNREFUSED"

**Solution**: MongoDB is not running

**Windows**:
```bash
# Start MongoDB service
net start MongoDB
```

**Mac**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongod
```

**Docker**:
```bash
docker start mongodb
```

### Error: "mongod: command not found"

**Solution**: MongoDB is not installed or not in PATH

- Reinstall MongoDB following the steps above
- Or use Docker option

## 🎯 Quick Start (After MongoDB is Running)

```bash
# 1. Seed database
npm run seed

# 2. Start server
npm start

# 3. Open browser to http://localhost:5000

# 4. Login with:
#    Email: admin@college.edu
#    Password: admin123
```

## 📊 View Your Data

Use **MongoDB Compass** (installed with MongoDB):
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `inventory-system`
4. Browse collections: `users`, `items`, `requests`

## 💡 Benefits of Local MongoDB

✅ No internet required
✅ No account setup needed
✅ Faster performance
✅ Full control over data
✅ Free forever
✅ Easy to reset/clear data

## 🔄 Reset Database

To start fresh:

```bash
# Just run seed again - it clears and recreates everything
npm run seed
```

---

**That's it!** Much simpler than MongoDB Atlas! 🎉
