@echo off
title MySlack - Offline & Local Wi-Fi Mode Launcher
color 0A
echo ===================================================================
echo               MySlack Offline & Local Wi-Fi Launcher
echo ===================================================================
echo.
echo Detecting Local Wi-Fi IP Address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set LOCAL_IP=%%a
)

echo -------------------------------------------------------------------
echo  [Host Laptop URL]:     http://localhost:5173
echo  [Other Wi-Fi Laptops]: http://%LOCAL_IP:~1%:5173
echo -------------------------------------------------------------------
echo.
echo Starting Web Server in Offline Mode...

cd /d "%~dp0myslack-web"
start http://localhost:5173
npm run dev -- --host 0.0.0.0

pause
