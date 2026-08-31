@echo off
title MySlack - Deploying to Vercel (Free Cloud Hosting)
color 0B
echo ===================================================================
echo               MySlack - Deploying to Vercel (Free)
echo ===================================================================
echo.

cd /d "%~dp0myslack-web"

echo 1. Compiling production bundle...
call npm run build

echo.
echo 2. Launching Vercel Deployment CLI...
echo -------------------------------------------------------------------
echo  Follow the quick on-screen prompts to connect your Vercel account.
echo -------------------------------------------------------------------
echo.

npx vercel

echo.
echo ===================================================================
echo  [SUCCESS] Deployment process complete!
echo ===================================================================
pause
