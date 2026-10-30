@echo off
cd /d "%~dp0"
title Mohamed Waleed Portfolio Server
echo ========================================================
echo   Launching Mohamed Waleed Portfolio...
echo   Local URL: http://localhost:3000
echo ========================================================
start http://localhost:3000
where py >nul 2>nul
if %errorlevel% equ 0 (
    py -m http.server 3000
) else (
    "C:\Users\Mohammed Waleed\AppData\Local\Python\pythoncore-3.14-64\python.exe" -m http.server 3000
)
pause
