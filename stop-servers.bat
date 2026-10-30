@echo off
setlocal enabledelayedexpansion
title AUDIRA NET ^& BILLING - Server Shutdown
color 0C

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
echo             Audira Billing Management System - Server Shutdown
echo  ========================================================================
echo.
echo  [INFO] Menghentikan seluruh service AUDIRA NET ^& BILLING...
echo.

REM 1. Hentikan Frontend Web Admin (Port 3217)
echo [1/4] Menghentikan Web Admin [Port 3217]...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3217 " ^| findstr "LISTENING"') do (
    echo   - Mematikan proses PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo   [OK] Web Admin berhasil dihentikan.
echo.

REM 2. Hentikan Backend REST API (Port 3218)
echo [2/4] Menghentikan Backend API [Port 3218]...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3218 " ^| findstr "LISTENING"') do (
    echo   - Mematikan proses PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo   [OK] Backend API berhasil dihentikan.
echo.

REM 3. Hentikan Customer Portal (Port 3219 ^& legacy 3001)
echo [3/4] Menghentikan Customer Portal [Port 3219 / 3001]...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3219 " ^| findstr "LISTENING"') do (
    echo   - Mematikan proses PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 " ^| findstr "LISTENING"') do (
    echo   - Mematikan legacy proses PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo   [OK] Customer Portal berhasil dihentikan.
echo.

REM 4. Bersihkan jendela terminal proses Node.js
echo [4/4] Menutup jendela konsol Node.js terkait...
taskkill /FI "WindowTitle eq AudiraNET Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Frontend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AudiraNET Customer Portal*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AUDIRA Backend API*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AUDIRA Web Admin*" /F >nul 2>&1
taskkill /FI "WindowTitle eq AUDIRA Customer Portal*" /F >nul 2>&1
echo   [OK] Konsol background dibersihkan.
echo.

echo  ========================================================================
echo   [SUKSES] Seluruh layanan AUDIRA NET ^& BILLING telah dinonaktifkan!
echo  ========================================================================
echo.
ping -n 3 127.0.0.1 >nul 2>&1
exit /b 0
