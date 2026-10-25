@echo off
chcp 65001 >nul
cls
color 0A
echo.
echo  ╔════════════════════════════════════════════════════════════════════════╗
echo  ║                                                                        ║
echo  ║            █████╗ ██╗   ██╗██████╗ ██╗██████╗  █████╗                 ║
echo  ║           ██╔══██╗██║   ██║██╔══██╗██║██╔══██╗██╔══██╗                ║
echo  ║           ███████║██║   ██║██║  ██║██║██████╔╝███████║                ║
echo  ║           ██╔══██║██║   ██║██║  ██║██║██╔══██╗██╔══██║                ║
echo  ║           ██║  ██║╚██████╔╝██████╔╝██║██║  ██║██║  ██║                ║
echo  ║           ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝                ║
echo  ║                                                                        ║
echo  ╚════════════════════════════════════════════════════════════════════════╝
echo.
echo             Audira Billing Management System - Server Launcher
echo  ════════════════════════════════════════════════════════════════════════
echo.
echo  [INFO] Starting AudiraNET Services...
echo  [INFO] Please wait while servers are initializing...
echo.
echo  ========================================================================
echo.

REM Kill any existing processes on ports 3217, 3218, 3219, and 3001
echo [1/6] Checking for running services...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3217 ^| findstr LISTENING') do (
    echo  - Stopping existing frontend on port 3217...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3218 ^| findstr LISTENING') do (
    echo  - Stopping existing backend on port 3218...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3219 ^| findstr LISTENING') do (
    echo  - Stopping existing customer portal on port 3219...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo  - Stopping legacy service on port 3001...
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Ports cleared
echo.

REM Start Backend
echo [2/6] Starting Backend Server (NestJS)...
cd /d "%~dp0apps\backend"
start "AudiraNET Backend" cmd /k "chcp 65001 >nul && color 0B && echo. && echo  ╔══════════════════════════════════════════════════╗ && echo  ║     AUDIRA BACKEND SERVER - PORT 3218            ║ && echo  ╚══════════════════════════════════════════════════╝ && echo. && pnpm run dev"
timeout /t 3 /nobreak >nul
echo  [OK] Backend server starting...
echo.

REM Start Frontend
echo [3/6] Starting Frontend Web Admin (Next.js)...
cd /d "%~dp0apps\frontend"
start "AudiraNET Frontend" cmd /k "chcp 65001 >nul && color 0E && echo. && echo  ╔══════════════════════════════════════════════════╗ && echo  ║     AUDIRA WEB ADMIN - PORT 3217                 ║ && echo  ╚══════════════════════════════════════════════════╝ && echo. && npm run dev"
timeout /t 2 /nobreak >nul
echo  [OK] Frontend server starting...
echo.

REM Start Customer Portal & Landing Page
echo [4/6] Starting Customer Portal & Landing Page (Next.js)...
cd /d "%~dp0apps\customer-portal"
start "AudiraNET Customer Portal" cmd /k "chcp 65001 >nul && color 0A && echo. && echo  ╔══════════════════════════════════════════════════╗ && echo  ║   AUDIRA LANDING & CUSTOMER PORTAL - PORT 3219   ║ && echo  ╚══════════════════════════════════════════════════╝ && echo. && npm run dev"
timeout /t 2 /nobreak >nul
echo  [OK] Customer portal starting...
echo.

REM Wait for servers to initialize
echo [5/6] Waiting for servers to initialize...
timeout /t 15 /nobreak >nul
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
    echo  [OK] Landing Page & Portal is running on http://localhost:3219
) else (
    echo  [WARNING] Customer Portal might still be starting...
)
echo.

echo  ════════════════════════════════════════════════════════════════════════
echo.
echo   SERVER INFORMATION:
echo   ───────────────────
echo   Landing Page:    http://localhost:3219
echo   Web Admin:       http://localhost:3217
echo   Backend API:     http://localhost:3218
echo.
echo   Press Ctrl+C in server windows to stop servers
echo   Check server windows for detailed logs
echo.
echo  ════════════════════════════════════════════════════════════════════════
echo.
echo  [SUCCESS] All services launched!
echo  Opening web browser in 3 seconds...
echo.
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:3219
start http://localhost:3217

echo.
echo  [INFO] Browser opened for Landing Page (3219) & Admin Web (3217).
echo  [INFO] Server windows will remain running in background.
echo.
pause
