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
echo 2. Connecting to Vercel...
echo -------------------------------------------------------------------
echo  If prompted, select "Continue with GitHub / Email" to log in.
echo -------------------------------------------------------------------
echo.

npx vercel login

echo.
echo 3. Deploying updated site to Vercel Production...
npx vercel --prod

echo.
echo ===================================================================
echo  [SUCCESS] Live Vercel Production Site Updated Successfully!
echo ===================================================================
pause
