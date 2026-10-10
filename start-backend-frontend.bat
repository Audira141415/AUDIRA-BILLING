@echo off
echo ================================================
echo   Starting Backend (Port 3218) and Frontend (Port 3217)
echo ================================================
echo.

REM Check if Docker is running
echo [1/4] Checking Docker status...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

REM Check if database containers are running
echo [2/4] Checking database containers...
docker ps --filter "name=sebilling-postgres" --format "{{.Names}}" | findstr "sebilling-postgres" >nul
if errorlevel 1 (
    echo [INFO] Starting database containers...
    cd /d "%~dp0"
    docker-compose up -d
    echo Waiting for database to be ready...
    timeout /t 5 /nobreak >nul
) else (
    echo [OK] Database containers are running
)
echo.

REM Start Backend and Frontend in parallel
echo [3/4] Starting Backend (Port 3218) and Frontend (Port 3217)...
echo [INFO] Backend API will be available at: http://localhost:3218
echo [INFO] Admin Panel will be available at: http://localhost:3217
echo.
cd /d "%~dp0"
start "Backend API (Port 3218)" cmd /k "cd apps\backend && pnpm run dev"
timeout /t 3 /nobreak >nul
start "Admin Panel (Port 3217)" cmd /k "cd apps\frontend && pnpm run dev"
echo.

echo [4/4] Services are starting...
echo.
echo ================================================
echo   Services Information:
echo ================================================
echo   Backend API:    http://localhost:3218
echo   Admin Panel:    http://localhost:3217
echo   Prisma Studio:  http://localhost:5555
echo ================================================
echo.
echo [INFO] Two new command windows have been opened.
echo [INFO] Keep them running to use the application.
echo [INFO] Press Ctrl+C in each window to stop the services.
echo.
echo Login Credentials:
echo   Admin: admin@audira.net / admin123
echo   Billing: billing@audira.net / billing123
echo.
pause
