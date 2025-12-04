@echo off
echo ========================================
echo   Quick Start - AI Inventory System
echo ========================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Dependencies not installed. Running setup...
    call setup.bat
    if %errorlevel% neq 0 exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo .env file not found. Running setup...
    call setup.bat
    if %errorlevel% neq 0 exit /b 1
)

REM Start MongoDB if not running
net start MongoDB >nul 2>nul

REM Start the server
echo Starting server...
start "AI Inventory Server" cmd /k "npm start"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:5000

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo.
echo Server is running in a separate window
echo Browser should open automatically
echo.
echo Login with:
echo   Email: admin@college.edu
echo   Password: admin123
echo.
echo Close the server window to stop the application
echo.
pause
