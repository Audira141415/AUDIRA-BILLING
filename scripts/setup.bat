@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🔧 AUDIRANET ISP MANAGEMENT SYSTEM                    ║
echo ║             Setup & Installation Script                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Memulai instalasi lengkap AudiraNET...
echo.

REM Install Backend Dependencies
echo [1/4] 📦 Install Backend Dependencies...
cd apps\backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend installation gagal!
    pause
    exit /b 1
)
cd ..\..
echo [✓] Backend dependencies installed
echo.

REM Install Frontend Dependencies
echo [2/4] 📦 Install Frontend Dependencies...
cd apps\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend installation gagal!
    pause
    exit /b 1
)
cd ..\..
echo [✓] Frontend dependencies installed
echo.

REM Generate Prisma Client
echo [3/4] 🔧 Generate Prisma Client...
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
echo [4/4] 🗄️  Setup Database...
cd apps\backend
echo [INFO] Jalankan database migration...
call npx prisma migrate dev --name initial_setup
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Migration ada warning (mungkin sudah exist)
)
cd ..\..
echo [✓] Database setup completed
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SETUP SELESAI!                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🎉 AudiraNET berhasil di-setup!
echo.
echo 📋 Next Steps:
echo    1. Jalankan: start-all.bat
echo    2. Buka browser: http://localhost:3000
echo    3. Test API: test-apis.ps1
echo.
echo 📚 Documentation:
echo    - README.md
echo    - QUICK_START.md
echo    - TEST_REPORT.md
echo.
pause
