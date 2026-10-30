@echo off
setlocal enabledelayedexpansion
title AUDIRA NET ^& BILLING - Server Launcher
color 0A

echo.
echo  +========================================================================+
echo  ^|                                                                        ^|
echo  ^|      AAA   U   U DDDD   III RRRR    AAA        N   N EEEEE TTTTT       ^|
echo  ^|     A   A  U   U D   D   I  R   R  A   A       NN  N E       T         ^|
echo  ^|     AAAAA  U   U D   D   I  RRRR   AAAAA  ---  N N N EEEEE   T         ^|
echo  ^|     A   A  U   U D   D   I  R  R   A   A       N  NN E       T         ^|
echo  ^|     A   A   UUU  DDDD   III R   R  A   A       N   N EEEEE   T         ^|
echo  ^|                                                                        ^|
echo  +========================================================================+
echo.
echo             Audira Billing Management System - Server Launcher
echo  ========================================================================
echo.
echo  [INFO] Starting AudiraNET Services...
echo  [INFO] Please wait while servers are initializing...
echo.
echo  ========================================================================
echo.

REM Kill any existing processes on ports 3217, 3218, 3219, and 3001
echo [1/6] Checking for running services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3217 " ^| findstr "LISTENING"') do (
    echo  - Stopping existing frontend on port 3217...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3218 " ^| findstr "LISTENING"') do (
    echo  - Stopping existing backend on port 3218...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3219 " ^| findstr "LISTENING"') do (
    echo  - Stopping existing customer portal on port 3219...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 " ^| findstr "LISTENING"') do (
    echo  - Stopping legacy service on port 3001...
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Ports cleared
echo.

REM Start Backend
echo [2/6] Starting Backend Server (NestJS)...
cd /d "%~dp0apps\backend"
start "AUDIRA Backend API" cmd /k "title AUDIRA Backend API - Port 3218 && color 0B && pnpm run dev"
ping -n 4 127.0.0.1 >nul 2>&1
echo  [OK] Backend server starting...
echo.

REM Start Frontend
echo [3/6] Starting Frontend Web Admin (Next.js)...
cd /d "%~dp0apps\frontend"
start "AUDIRA Web Admin" cmd /k "title AUDIRA Web Admin - Port 3217 && color 0E && npm run dev"
ping -n 3 127.0.0.1 >nul 2>&1
echo  [OK] Frontend server starting...
echo.

REM Start Customer Portal & Landing Page
echo [4/6] Starting Customer Portal ^& Landing Page (Next.js)...
cd /d "%~dp0apps\customer-portal"
start "AUDIRA Customer Portal" cmd /k "title AUDIRA Customer Portal - Port 3219 && color 0A && npm run dev"
ping -n 3 127.0.0.1 >nul 2>&1
echo  [OK] Customer portal starting...
echo.

REM Wait for servers to initialize
echo [5/6] Waiting for servers to initialize...
ping -n 12 127.0.0.1 >nul 2>&1
echo  [OK] Servers should be ready
echo.

REM Check server status
echo [6/6] Checking server status...
netstat -ano | findstr :3218 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Backend server is running on http://localhost:3218
) else (
    echo  [WARNING] Backend server might still be starting...
)

netstat -ano | findstr :3217 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Web Admin is running on http://localhost:3217
) else (
    echo  [WARNING] Web Admin might still be starting...
)

netstat -ano | findstr :3219 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Landing Page ^& Portal is running on http://localhost:3219
) else (
    echo  [WARNING] Customer Portal might still be starting...
)
echo.

echo  ========================================================================
echo.
echo   SERVER INFORMATION:
echo   -------------------
echo   SaaS Product:    http://localhost:3217/landing (Brosur Penjualan SaaS BSS/OSS)
echo   Landing Portal:  http://localhost:3219 (Customer Self-Care)
echo   Web Admin:       http://localhost:3217 (Cockpit NOC / Admin)
echo   Backend API:     http://localhost:3218 (REST API Docs)
echo.
echo   Press Ctrl+C in server windows to stop servers
echo   Check server windows for detailed logs
echo.
echo  ========================================================================
echo.
echo  [SUCCESS] All services launched!
echo  Opening web browser in 3 seconds...
echo.
ping -n 4 127.0.0.1 >nul 2>&1

REM Open browser
start http://localhost:3217/landing
start http://localhost:3219
start http://localhost:3217

echo.
echo  [INFO] Browser opened for Landing Page (3217/landing), Portal (3219) ^& Admin Web (3217).
echo  [INFO] Server windows will remain running in background.
echo.
pause
exit /b 0
