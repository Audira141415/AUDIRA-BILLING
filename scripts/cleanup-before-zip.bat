@echo off
chcp 65001 > nul
cls
color 0C
cd /d "%~dp0.."

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║      █████╗ ██╗   ██╗██████╗ ██╗██████╗  █████╗          ║
echo ║     ██╔══██╗██║   ██║██╔══██╗██║██╔══██╗██╔══██╗         ║
echo ║     ███████║██║   ██║██║  ██║██║██████╔╝███████║         ║
echo ║     ██╔══██║██║   ██║██║  ██║██║██╔══██╗██╔══██║         ║
echo ║     ██║  ██║╚██████╔╝██████╔╝██║██║  ██║██║  ██║         ║
echo ║     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝         ║
echo ║                                                            ║
echo ║            CLEANUP SEBELUM ZIP PROJECT                     ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [CLEANUP] Membersihkan project untuk zipping...
echo.

:: Hentikan server dulu
echo [STEP 1/8] Menghentikan server yang sedang berjalan...
call "%~dp0..\stop-servers.bat" > nul 2>&1
timeout /t 2 /nobreak > nul

:: Hapus node_modules di setiap app
echo [STEP 2/8] Menghapus node_modules di apps...
if exist "apps\backend\node_modules" (
    echo    - apps\backend\node_modules
    rd /s /q "apps\backend\node_modules"
)
if exist "apps\frontend\node_modules" (
    echo    - apps\frontend\node_modules
    rd /s /q "apps\frontend\node_modules"
)
if exist "apps\customer-portal\node_modules" (
    echo    - apps\customer-portal\node_modules
    rd /s /q "apps\customer-portal\node_modules"
)
if exist "apps\mobile\node_modules" (
    echo    - apps\mobile\node_modules
    rd /s /q "apps\mobile\node_modules"
)

:: Hapus root node_modules
echo [STEP 3/8] Menghapus root node_modules...
if exist "node_modules" (
    echo    - node_modules (root)
    rd /s /q "node_modules"
)

:: Hapus build directories
echo [STEP 4/8] Menghapus build artifacts...
if exist "apps\frontend\.next" (
    echo    - apps\frontend\.next
    rd /s /q "apps\frontend\.next"
)
if exist "apps\customer-portal\.next" (
    echo    - apps\customer-portal\.next
    rd /s /q "apps\customer-portal\.next"
)
if exist "apps\backend\dist" (
    echo    - apps\backend\dist
    rd /s /q "apps\backend\dist"
)

:: Hapus pnpm cache
echo [STEP 5/8] Menghapus pnpm cache...
if exist ".pnpm" (
    echo    - .pnpm
    rd /s /q ".pnpm"
)

:: Hapus expo cache
echo [STEP 6/8] Menghapus Expo cache...
if exist ".expo" (
    echo    - .expo
    rd /s /q ".expo"
)

:: Hapus file temporary dan deprecated
echo [STEP 7/8] Menghapus file temporary dan deprecated...
if exist "start-backend-simple.bat" (
    echo    - start-backend-simple.bat (deprecated)
    del /q "start-backend-simple.bat"
)
if exist "test-technician-login.js" (
    echo    - test-technician-login.js (test file)
    del /q "test-technician-login.js"
)
for %%f in (_tmp_*) do (
    echo    - %%f (temporary file)
    del /q "%%f"
)

:: Hapus JSC Android build (React Native)
echo [STEP 8/8] Menghapus JSC Android builds...
if exist "apps\mobile\node_modules\jsc-android" (
    echo    - apps\mobile\node_modules\jsc-android
    rd /s /q "apps\mobile\node_modules\jsc-android"
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║  ✓ CLEANUP SELESAI!                                        ║
echo ║                                                            ║
echo ║  Project sudah bersih dan siap untuk di-zip.              ║
echo ║                                                            ║
echo ║  UKURAN PROJECT:                                           ║
echo ║  - Sebelum: ~2-3 GB (dengan node_modules)                 ║
echo ║  - Sesudah: ~50-100 MB (source code saja)                 ║
echo ║                                                            ║
echo ║  CARA RESTORE SETELAH UNZIP:                               ║
echo ║  1. pnpm install                                           ║
echo ║  2. cd apps\backend ^&^& pnpm run build                    ║
echo ║  3. start-servers.bat                                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Tampilkan ukuran folder setelah cleanup
echo [INFO] Mengecek ukuran folder...
powershell -Command "& {$size = (Get-ChildItem -Path . -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB; Write-Host ('Ukuran project: {0:N2} MB' -f $size)}"

echo.
echo [INFO] Tekan tombol apapun untuk menutup...
pause > nul
