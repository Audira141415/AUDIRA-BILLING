@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🚀 AUDIRANET ISP MANAGEMENT SYSTEM                    ║
echo ║             Startup Script - All Services                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Memulai semua service AudiraNET...
echo.

REM Check and Start Docker Desktop
echo [1/6] 🐳 Memeriksa Docker Desktop...
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Docker Desktop tidak berjalan, memulai...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo [INFO] Menunggu Docker Desktop siap...
    :wait_docker
    timeout /t 5 /nobreak >nul
    docker ps >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [INFO] Masih menunggu Docker Desktop...
        goto wait_docker
    )
    echo [✓] Docker Desktop siap
) else (
    echo [✓] Docker Desktop sudah berjalan
)
echo.

REM Start Database Containers
echo [2/6] 🗄️  Memulai Database Containers...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Docker compose gagal, pastikan docker-compose.yml ada
) else (
    echo [✓] Database containers started
)
echo.

REM Check if node_modules exists
echo [3/6] 📦 Memeriksa dependencies...
if not exist "apps\backend\node_modules" (
    echo [WARNING] Backend dependencies tidak ditemukan!
    echo [INFO] Instalasi dependencies backend...
    cd apps\backend
    call npm install
    cd ..\..
)

if not exist "apps\frontend\node_modules" (
    echo [WARNING] Frontend dependencies tidak ditemukan!
    echo [INFO] Instalasi dependencies frontend...
    cd apps\frontend
    call npm install
    cd ..\..
)

echo [✓] Dependencies ready
echo.

REM Run Prisma Generate
echo [4/6] 🔧 Generate Prisma Client...
cd apps\backend
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma generate gagal!
    pause
    exit /b 1
)
cd ..\..
echo [✓] Prisma Client generated
echo.

REM Run Database Migration
echo [5/6] 🗄️  Jalankan Database Migration...
cd apps\backend
call npx prisma migrate dev --name initial_migration
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Migration mungkin sudah ada atau ada error
)
cd ..\..
echo [✓] Database migration completed
echo.

REM Start Backend in new window
echo [6/6] 🚀 Memulai Backend & Frontend Servers...
start "AudiraNET Backend" cmd /k "cd /d %CD%\apps\backend && npm run dev"
timeout /t 3 /nobreak >nul
echo [✓] Backend server starting on http://localhost:4000
echo.

REM Start Frontend in new window
start "AudiraNET Frontend" cmd /k "cd /d %CD%\apps\frontend && npm run dev"
timeout /t 2 /nobreak >nul
echo [✓] Frontend server starting on http://localhost:3000
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SEMUA SERVICE BERJALAN                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📍 Docker:    Running (PostgreSQL on port 5433)
echo 📍 Backend:   http://localhost:4000
echo 📍 Frontend:  http://localhost:3000
echo 📍 Prisma Studio: npx prisma studio (manual)
echo.
echo 💡 Tips:
echo    - Tunggu 10-15 detik untuk backend siap
echo    - Tunggu 20-30 detik untuk frontend siap
echo    - Database PostgreSQL running on port 5433
echo    - Cek terminal window masing-masing untuk logs
echo    - Tekan Ctrl+C di terminal untuk stop service
echo.
echo 🛑 Stop Services:
echo    - Run: stop-all.bat
echo.
echo 🧪 Testing:
echo    - Open browser: http://localhost:3000
echo    - API Health: http://localhost:4000/health
echo.
pause
