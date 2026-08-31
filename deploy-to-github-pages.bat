@echo off
title MySlack - Deploy to GitHub Pages
color 0A
echo ===================================================================
echo               MySlack - Deploy to GitHub Pages
echo ===================================================================
echo.

cd /d "%~dp0myslack-web"

echo 1. Installing gh-pages tool if needed...
call npm install --save-dev gh-pages

echo.
echo 2. Building production bundle...
call npm run build

echo.
echo 3. Deploying to GitHub Pages (gh-pages branch)...
call npx gh-pages -d dist

echo.
echo ===================================================================
echo  [SUCCESS] Successfully deployed to GitHub Pages!
echo ===================================================================
echo.
echo  To enable GitHub Pages in your GitHub Repository:
echo  1. Go to your GitHub Repository -> Settings -> Pages
echo  2. Under "Source", select "Deploy from a branch"
echo  3. Choose branch "gh-pages" and click Save!
echo ===================================================================
pause
