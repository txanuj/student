@echo off
echo ========================================
echo   AI Inventory Management System
echo   Local Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed!
    echo.
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
    echo.
    pause
)

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2/5] Checking .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo [IMPORTANT] Please edit .env file and set your MongoDB connection string!
    echo Press any key to open .env file...
    pause >nul
    notepad .env
)

echo.
echo [3/5] Starting MongoDB service...
net start MongoDB >nul 2>nul
if %errorlevel% equ 0 (
    echo MongoDB service started successfully!
) else (
    echo MongoDB service already running or not installed as service
    echo If using MongoDB Atlas, make sure your connection string is in .env
)

echo.
echo [4/5] Seeding database with demo data...
call npm run seed
if %errorlevel% neq 0 (
    echo [WARNING] Database seeding failed. Check your MongoDB connection.
    echo You can run 'npm run seed' manually later.
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo   Ready to start the application!
echo ========================================
echo.
echo To start the server, run: start-server.bat
echo Or manually run: npm start
echo.
pause
