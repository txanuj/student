# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed ✅
- MongoDB installing now... ⏳

## Setup Steps

### 1. MongoDB is Installing
MongoDB is currently being installed on your system. This will take 2-3 minutes.

### 2. Once Installation Completes

**Start MongoDB Service:**
```bash
net start MongoDB
```

### 3. Seed the Database
```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Created 5 users
✅ Created 20 items
✅ Created 3 sample requests
🎉 Database seeding completed successfully!
```

### 4. Start the Server
```bash
npm start
```

### 5. Open Your Browser
Navigate to: **http://localhost:5000**

### 6. Login
Use any of these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@college.edu | admin123 |
| Lab Staff | lab@college.edu | lab123 |
| Library Staff | library@college.edu | library123 |
| Sports Staff | sports@college.edu | sports123 |
| Hostel Staff | hostel@college.edu | hostel123 |

## 🎯 What You Can Do

### As Admin:
- ✅ View all departments
- ✅ Add/Edit/Delete inventory items
- ✅ Approve/Reject requests
- ✅ View AI forecasting
- ✅ Export reports to CSV

### As Staff:
- ✅ View your department's items
- ✅ Create requests for items
- ✅ View AI predictions
- ✅ See analytics for your department

## 🤖 AI Features

The system automatically:
- Predicts when items will run out
- Identifies at-risk inventory
- Recommends reorder quantities
- Analyzes usage trends
- Alerts for low stock

## 📊 Pages

1. **Dashboard** - Overview with charts
2. **Inventory** - Manage items
3. **Requests** - Create and approve requests
4. **AI Forecast** - Predictions and recommendations
5. **Analytics** - Reports and exports

## 🛠️ Troubleshooting

### MongoDB Not Running?
```bash
net start MongoDB
```

### Want to Reset Data?
```bash
npm run seed
```

### Server Not Starting?
Make sure port 5000 is free, or change PORT in `server/.env`

---

## 🎉 That's It!

Your AI-Powered Inventory Management System is ready to use!

**No cloud setup, no connection strings, just local and simple!**
