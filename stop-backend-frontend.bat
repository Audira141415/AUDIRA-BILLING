@echo off
echo ================================================
echo   Stopping Backend and Frontend Services
echo ================================================
echo.

REM Kill Node.js processes (Backend and Frontend)
echo [1/2] Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo [INFO] No Node.js processes found
) else (
    echo [OK] Node.js processes stopped
)
echo.

REM Ask user if they want to stop Docker containers
echo [2/2] Docker containers status:
set /p STOP_DOCKER="Do you want to stop database containers? (Y/N): "
if /i "%STOP_DOCKER%"=="Y" (
    echo Stopping Docker containers...
    cd /d "%~dp0"
    docker-compose down
    echo [OK] Docker containers stopped
) else (
    echo [INFO] Docker containers are still running
)
echo.

echo ================================================
echo   All services stopped
echo ================================================
pause
