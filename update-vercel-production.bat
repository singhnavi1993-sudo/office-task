@echo off
title MySlack - Update Live Vercel Production Site
color 0A
echo ===================================================================
echo               MySlack - Updating Live Production Vercel Site
echo ===================================================================
echo.

cd /d "%~dp0myslack-web"

echo 1. Re-building fresh production bundle...
call npm run build

echo.
echo 2. Pushing production update to Vercel...
echo -------------------------------------------------------------------
echo  Updating your existing live Vercel URL... Please wait.
echo -------------------------------------------------------------------
echo.

npx vercel --prod

echo.
echo ===================================================================
echo  [SUCCESS] Live Vercel Production Site Updated Successfully!
echo ===================================================================
pause
