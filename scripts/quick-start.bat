@echo off
echo ========================================
echo   QUICK START - BILLING BY AUDIRA
echo ========================================
echo.
echo This script will start:
echo   1. Docker Desktop (if not running)
echo   2. PostgreSQL Database
echo   3. Redis Cache
echo   4. Backend API
echo   5. Frontend Web
echo.
pause

echo.
echo ========================================
echo   STEP 1: START DATABASE
echo ========================================
echo.

call start-database.bat

echo.
echo ========================================
echo   STEP 2: SEED DATABASE (if needed)
echo ========================================
echo.

cd apps\backend

echo Checking if admin user exists...
npx ts-node check-users.ts

echo.
echo If no users found, creating admin user...
npx ts-node prisma/seed-admin-only.ts

cd ..\..

echo.
echo ========================================
echo   STEP 3: START BACKEND
echo ========================================
echo.

cd apps\backend
start cmd /k "npm run dev"
cd ..\..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   STEP 4: START FRONTEND
echo ========================================
echo.

cd apps\frontend
start cmd /k "npm run dev"
cd ..\..

echo.
echo ========================================
echo   ALL SYSTEMS STARTED!
echo ========================================
echo.
echo 🗄️  Database: localhost:5433
echo 🔧 Backend API: http://localhost:4000
echo 🌐 Frontend: http://localhost:3000
echo.
echo 📧 Login dengan:
echo    Email: admin@audira.net
echo    Password: admin123
echo.
echo ========================================
echo.

echo Opening browser in 5 seconds...
timeout /t 5 /nobreak

start http://localhost:3000

echo.
echo Browser opened!
echo Press any key to close this window...
pause >nul
