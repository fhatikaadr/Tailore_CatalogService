@echo off
echo ==========================================
echo Tailore Catalog Service - Quick Start
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

:: Check if outfits.csv exists
if not exist "..\outfits.csv" (
    echo [WARNING] outfits.csv not found in parent directory
    echo            Please ensure outfits.csv is available before seeding
    echo.
)

:: Install dependencies
echo [STEP 1] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

:: Initialize database
echo [STEP 2] Initializing database...
call npm run init-db
if %errorlevel% neq 0 (
    echo X Failed to initialize database
    pause
    exit /b 1
)
echo [OK] Database initialized
echo.

:: Seed database
echo [STEP 3] Seeding database with data...
call npm run seed
if %errorlevel% neq 0 (
    echo X Failed to seed database
    pause
    exit /b 1
)
echo.

echo ==========================================
echo [SUCCESS] Setup Complete!
echo ==========================================
echo.
echo Default credentials:
echo    Admin: username=admin, password=admin123
echo    User:  username=user, password=user123
echo.
echo To start the server:
echo    Development: npm run dev
echo    Production:  npm start
echo.
echo Server will run on: http://localhost:3000
echo ==========================================
echo.
pause
