@echo off
title MySlack - Building Web Application for Cloud Hosting
color 0A
echo ===================================================================
echo               MySlack - Building Web Production Build
echo ===================================================================
echo.

cd /d "%~dp0myslack-web"

echo Checking and installing dependencies if needed...
call npm install

echo Building production static web bundle...
call npm run build

echo.
echo ===================================================================
echo  [SUCCESS] Production build created in folder:
echo          %~dp0myslack-web\dist
echo.
echo  You can now drag-and-drop the "dist" folder to Netlify Drop:
echo  https://app.netlify.com/drop
echo  Or upload the project to Vercel / GitHub Pages!
echo ===================================================================
echo.
pause
