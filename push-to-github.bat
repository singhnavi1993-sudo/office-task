@echo off
title MySlack - Push to GitHub Repository
color 0B
echo ===================================================================
echo               MySlack - Push Project to GitHub
echo ===================================================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/repository.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No GitHub URL provided. Exiting...
    pause
    exit /b
)

echo.
echo Connecting to GitHub repository...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing project files to GitHub main branch...
git push -u origin main

echo.
echo ===================================================================
echo  [SUCCESS] Project pushed to GitHub successfully!
echo ===================================================================
pause
