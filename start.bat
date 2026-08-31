@echo off
title Starting MySlack Application...
echo ========================================================
echo          Starting MySlack Web Application
echo ========================================================
echo.

cd /d "%~dp0myslack-web"
echo Starting Frontend Web Server...
start http://localhost:5173
npm run dev

pause
