@echo off
setlocal enabledelayedexpansion

:: Smart Campus KLH - Deployment Helper (Windows)
echo ========================================
echo 🚀 Smart Campus KLH - Deployment Helper
echo ========================================
echo.

:: Check for uncommitted changes
git status --short > nul 2>&1
if !errorlevel! equ 0 (
    for /f %%i in ('git status --short') do (
        echo ⚠ You have uncommitted changes!
        set /p commit="Do you want to commit them? (y/n): "
        if /i "!commit!"=="y" (
            git add .
            set /p message="Enter commit message: "
            git commit -m "!message!"
            echo ✓ Changes committed
        )
        goto :push
    )
)

:push
echo.
echo 📤 Pushing to GitHub...
git push origin main
if !errorlevel! equ 0 (
    echo ✓ Code pushed to GitHub
) else (
    echo ✗ Failed to push to GitHub
    pause
    exit /b 1
)

:: Deployment options
echo.
echo Choose deployment platform:
echo 1) Render (Recommended - Free tier with WebSocket)
echo 2) Vercel (Frontend) + Railway (Backend)
echo 3) Docker Compose (Self-hosted)
echo 4) Skip deployment
echo.
set /p option="Select option (1-4): "

if "%option%"=="1" goto render
if "%option%"=="2" goto vercel
if "%option%"=="3" goto docker
if "%option%"=="4" goto skip
echo ✗ Invalid option
pause
exit /b 1

:render
echo.
echo 🎯 Deploying to Render...
echo.
echo Next steps:
echo 1. Go to https://render.com
echo 2. Click 'New +' → 'Blueprint'
echo 3. Connect your GitHub repo
echo 4. Render will use render.yaml for configuration
echo 5. Add your environment variables in Render dashboard
echo.
echo ✓ render.yaml is already configured!
echo.
echo 📋 Don't forget to add these environment variables in Render:
echo    - MONGODB_URI
echo    - JWT_SECRET
echo    - CLOUDINARY_* (optional)
echo    - GEMINI_API_KEY (optional)
echo    - EMAIL_* (optional)
echo    - FRONTEND_URL (after frontend is deployed)
goto end

:vercel
echo.
echo 🎯 Deploying to Vercel + Railway...
echo.
echo Backend (Railway):
echo 1. Go to https://railway.app
echo 2. New Project → Deploy from GitHub
echo 3. Select your repo and set root directory to 'backend'
echo 4. Add environment variables
echo 5. Generate domain and copy URL
echo.
echo Frontend (Vercel):
echo 1. Go to https://vercel.com
echo 2. Import Project from GitHub
echo 3. Set root directory to 'frontend'
echo 4. Add VITE_API_URL and VITE_SOCKET_URL
echo 5. Deploy!
goto end

:docker
echo.
echo 🐳 Deploying with Docker Compose...
echo.
set /p docker="Do you have Docker installed? (y/n): "
if /i "!docker!"=="y" (
    echo Building and starting containers...
    docker-compose down
    docker-compose build
    docker-compose up -d
    echo ✓ Containers started!
    echo.
    echo Access your application at:
    echo   Frontend: http://localhost:3000
    echo   Backend: http://localhost:5000
    echo   MongoDB: localhost:27017
) else (
    echo ✗ Please install Docker first: https://docs.docker.com/get-docker/
)
goto end

:skip
echo ⚠ Deployment skipped
goto end

:end
echo.
echo ✨ Deployment process completed!
echo.
echo 📚 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
