@echo off
echo Starting MongoDB service...
net start MongoDB
if %errorlevel% == 0 (
    echo MongoDB started successfully!
) else (
    echo Please run this file as Administrator
    echo Right-click and select "Run as administrator"
)
pause
