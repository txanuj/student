# 📦 AI-Powered Inventory Management System

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/inventory-system)

> A full-stack web application for educational institutions to manage inventory with AI-powered forecasting, role-based access control, and comprehensive analytics.

## ✨ Features

- 🔐 **JWT Authentication** with role-based access (Admin/Staff)
- 📊 **AI Forecasting** - Predictive analytics for stock levels
- 📈 **Real-time Analytics** with Chart.js visualizations
- 🏢 **Department Isolation** - Secure data separation
- 📥 **CSV Export** for reports
- 🎨 **Modern UI** with glassmorphism and animations
- 📱 **Fully Responsive** design

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/inventory-system.git
cd inventory-system

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed database
npm run seed

# Start server
npm start
```

Visit `http://localhost:5000`

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Lab Staff | lab@college.edu | lab123 |
| Library | library@college.edu | library123 |

## 📁 Project Structure

```
├── client/          # Frontend (HTML/CSS/JS)
├── server/          # Backend (Node.js/Express)
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── utils/       # Utilities & AI
├── package.json
└── README.md
```

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** Vanilla JavaScript, Chart.js, CSS3  
**AI:** Statistical forecasting algorithms

## 📊 API Endpoints

- `POST /api/auth/login` - User login
- `GET /api/items` - Get inventory items
- `POST /api/requests` - Create request
- `GET /api/forecast` - AI predictions
- `GET /api/reports/export/items-csv` - Export CSV

[Full API Documentation](./docs/API.md)

## 🌐 Deployment

### Netlify (Frontend Only)
1. Fork this repository
2. Connect to Netlify
3. Set build command: `echo "Static site"`
4. Set publish directory: `client`

### Heroku (Full Stack)
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Railway/Render
- Auto-detects Node.js
- Add MongoDB connection string
- Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- Chart.js for visualizations
- MongoDB for database
- Express.js framework

---

⭐ Star this repo if you find it helpful!
