@echo off
chcp 65001 >nul
cls
color 0C
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
echo             Audira Billing Management System - Server Shutdown
echo  ════════════════════════════════════════════════════════════════════════
echo.
echo  [INFO] Stopping all AudiraNET services...
echo.

REM Kill processes on port 3217
echo [1/3] Stopping Frontend (port 3217)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3217 ^| findstr LISTENING') do (
    echo  - Terminating process %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Frontend stopped
echo.

REM Kill processes on port 3218
echo [2/4] Stopping Backend (port 3218)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3218 ^| findstr LISTENING') do (
    echo  - Terminating process %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Backend stopped
echo.

REM Kill processes on port 3219 and 3001
echo [3/4] Stopping Customer Portal (port 3219)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3219 ^| findstr LISTENING') do (
    echo  - Terminating process %%a
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo  - Terminating process %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Customer Portal stopped
echo.

REM Kill Node processes with specific titles
echo [4/4] Cleaning up Node.js processes...
taskkill /FI "WindowTitle eq AudiraNET Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Frontend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Customer Portal*" /F >nul 2>&1
echo  [OK] Cleanup complete
echo.

echo  ════════════════════════════════════════════════════════════════════════
echo.
echo  [SUCCESS] All AudiraNET services stopped!
echo.
echo  ════════════════════════════════════════════════════════════════════════
echo.
timeout /t 3 /nobreak >nul
