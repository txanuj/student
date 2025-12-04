@echo off
title AI Inventory Management System - Server

echo ========================================
echo   Starting AI Inventory System Server
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
net start MongoDB >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB service not running
    echo Attempting to start MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo.
        echo [INFO] If using MongoDB Atlas, ignore this warning
        echo Make sure MONGODB_URI in .env is set correctly
        echo.
    )
)

echo.
echo Starting server...
echo.
echo ========================================
echo   Server Information
echo ========================================
echo   Local URL: http://localhost:5000
echo   Login: admin@college.edu / admin123
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start

REM If server stops
echo.
echo Server stopped.
pause
