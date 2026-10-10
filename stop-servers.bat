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
echo [2/3] Stopping Backend (port 3218)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3218 ^| findstr LISTENING') do (
    echo  - Terminating process %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo  [OK] Backend stopped
echo.

REM Kill Node processes with specific titles
echo [3/3] Cleaning up Node.js processes...
taskkill /FI "WindowTitle eq AudiraNET Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Frontend*" /F >nul 2>&1
echo  [OK] Cleanup complete
echo.

echo  ════════════════════════════════════════════════════════════════════════
echo.
echo  [SUCCESS] All AudiraNET services stopped!
echo.
echo  ════════════════════════════════════════════════════════════════════════
echo.
timeout /t 3 /nobreak >nul
