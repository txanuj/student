@echo off
echo ========================================
echo   Stopping AI Inventory System
echo ========================================
echo.

echo Stopping Node.js server...
taskkill /F /IM node.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo Server stopped successfully!
) else (
    echo No running server found.
)

echo.
echo Stopping MongoDB service...
net stop MongoDB >nul 2>nul
if %errorlevel% equ 0 (
    echo MongoDB stopped successfully!
) else (
    echo MongoDB service not running or not installed as service.
)

echo.
echo ========================================
echo   All services stopped
echo ========================================
echo.
pause
