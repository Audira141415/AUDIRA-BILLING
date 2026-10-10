@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🛑 AUDIRANET - STOP ALL SERVICES                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [WARNING] Menghentikan semua service AudiraNET...
echo.

REM Kill Node processes
echo [1/3] 🔴 Stop Backend & Frontend...
taskkill /F /IM node.exe /T >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [✓] All Node.js processes stopped
) else (
    echo [INFO] Tidak ada Node.js process yang berjalan
)
echo.

REM Kill specific window titles (optional, safer)
echo [2/3] 🔴 Close Terminal Windows...
taskkill /FI "WindowTitle eq AudiraNET Backend*" /T >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Frontend*" /T >nul 2>&1
echo [✓] Terminal windows closed
echo.

REM Stop Docker Containers
echo [3/3] 🐳 Stop Docker Containers...
docker-compose down
if %ERRORLEVEL% EQU 0 (
    echo [✓] Docker containers stopped
) else (
    echo [INFO] Docker containers sudah stopped atau tidak ada
)
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SEMUA SERVICE DIHENTIKAN                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🛑 Services Stopped:
echo    • Backend & Frontend servers
echo    • Docker containers (PostgreSQL)
echo.
echo 💡 Untuk start kembali: start-all.bat
echo.
pause
