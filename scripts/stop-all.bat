@echo off
setlocal enabledelayedexpansion
title AUDIRA NET ^& BILLING - Stop All Services
color 0C

echo.
echo  +========================================================================+
echo  ^|               AUDIRA NET - STOP ALL SERVICES                           ^|
echo  +========================================================================+
echo.
echo  [WARNING] Menghentikan semua service AudiraNET...
echo.

REM 1. Hentikan port web dan API
echo [1/3] Menghentikan port layanan (3217, 3218, 3219)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3217 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3218 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3219 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
echo   [OK] Port layanan dihentikan.
echo.

REM 2. Tutup jendela terminal
echo [2/3] Menutup jendela terminal konsol...
taskkill /FI "WindowTitle eq AudiraNET Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Frontend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Customer Portal*" /F >nul 2>&1
echo   [OK] Jendela terminal ditutup.
echo.

REM 3. Stop Docker Containers jika diinginkan
echo [3/3] Memeriksa Docker Containers...
cd /d "%~dp0.."
docker-compose down >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Docker containers stopped.
) else (
    echo   [INFO] Docker containers sudah berhenti atau tidak aktif.
)
echo.

echo  +========================================================================+
echo  ^|                    SEMUA SERVICE BERHASIL DIHENTIKAN                   ^|
echo  +========================================================================+
echo.
ping -n 3 127.0.0.1 >nul 2>&1
exit /b 0
