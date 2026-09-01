@echo off
title MySlack - Share Live Online Link
color 0B
echo ===================================================================
echo               MySlack - Share Live Online Link (Tunnel)
echo ===================================================================
echo.
echo 1. Starting Frontend Web Server...
cd /d "%~dp0myslack-web"

start "MySlack Central Database" cmd /k "node server.js"
start "MySlack Dev Server" cmd /k "npm run dev -- --host"

echo.
echo 2. Creating Public Online URL for Client (Mac / Windows / Mobile)...
echo -------------------------------------------------------------------
echo  Generating secure public link... Please wait a few seconds.
echo -------------------------------------------------------------------
echo.

npx --yes localtunnel --port 5173

pause
