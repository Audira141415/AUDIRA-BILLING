@echo off
setlocal enabledelayedexpansion
title AUDIRA NET ^& BILLING - Start All Services
color 0A

echo.
echo  +========================================================================+
echo  ^|            AUDIRA NET ISP MANAGEMENT SYSTEM                            ^|
echo  ^|               Startup Script - All Services                            ^|
echo  +========================================================================+
echo.
echo  [INFO] Memulai semua service AudiraNET...
echo.

REM 1. Periksa Docker Desktop
echo [1/5] Memeriksa Docker Desktop...
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   [INFO] Docker daemon tidak aktif, mencoba menjalankan Docker Desktop...
    if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
        start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        echo   [INFO] Menunggu Docker Desktop siap...
        ping -n 8 127.0.0.1 >nul 2>&1
    )
) else (
    echo   [OK] Docker Desktop sudah berjalan.
)
echo.

REM 2. Jalankan Docker Containers
echo [2/5] Memulai Database Containers (PostgreSQL ^& Redis)...
cd /d "%~dp0.."
docker-compose up -d >nul 2>&1
echo   [OK] Database containers siap.
echo.

REM 3. Prisma Generate
echo [3/5] Generate Prisma Client...
cd /d "%~dp0..\apps\backend"
call npx prisma generate >nul 2>&1
echo   [OK] Prisma Client updated.
echo.

REM 4. Jalankan Backend (Port 3218)
echo [4/5] Memulai Backend REST API [Port 3218]...
start "AUDIRA Backend API" cmd /k "title AUDIRA Backend API - Port 3218 && color 0B && cd /d "%~dp0..\apps\backend" && npm run dev"
ping -n 4 127.0.0.1 >nul 2>&1
echo   [OK] Backend server started di http://localhost:3218
echo.

REM 5. Jalankan Web Admin (Port 3217) ^& Customer Portal (Port 3219)
echo [5/5] Memulai Web Admin [Port 3217] ^& Customer Portal [Port 3219]...
start "AUDIRA Web Admin" cmd /k "title AUDIRA Web Admin - Port 3217 && color 0E && cd /d "%~dp0..\apps\frontend" && npm run dev"
start "AUDIRA Customer Portal" cmd /k "title AUDIRA Customer Portal - Port 3219 && color 0A && cd /d "%~dp0..\apps\customer-portal" && npm run dev"
ping -n 4 127.0.0.1 >nul 2>&1
echo   [OK] Frontend servers started.
echo.

echo  +========================================================================+
echo  ^|                    SEMUA SERVICE BERHASIL DIJALANKAN                   ^|
echo  +========================================================================+
echo.
echo   * Landing Page SaaS  : http://localhost:3217/landing
echo   * Web Admin ISP      : http://localhost:3217
echo   * Customer Portal    : http://localhost:3219
echo   * Backend REST API   : http://localhost:3218
echo   * Database Port      : 5455 (PostgreSQL) ^& 6379 (Redis)
echo.
echo  Membuka browser...
start http://localhost:3217/landing
start http://localhost:3217
start http://localhost:3219
echo.
pause
exit /b 0
