@echo off
title Placify AI - Complete Setup
color 0A

echo.
echo ========================================
echo   PLACIFY AI - AUTOMATIC SETUP
echo ========================================
echo.

echo [1/4] Checking if backend is already running...
netstat -ano | findstr :8080 > nul
if %errorlevel% equ 0 (
    echo Backend is already running on port 8080
    goto seed_data
)

echo [2/4] Starting Backend...
cd /d d:\placify2\placify\placify-ai\backend
set JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot
start "Placify Backend" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak

:seed_data
echo.
echo [3/4] Seeding Sample Data...
cd /d d:\placify2\placify\placify-ai

echo Getting admin token...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}" > temp_token.json

for /f "tokens=2 delims=:," %%a in ('findstr "token" temp_token.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo.
echo Creating 3 companies and 18 jobs...
curl -s -X POST http://localhost:8080/api/admin/seed-data -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo Fixing department data...
curl -s -X POST http://localhost:8080/api/admin/fix-departments -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo [4/4] Verifying data...
curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/admin/stats

del temp_token.json

echo.
echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Your database now has:
echo - 3 Companies: TCS, Infosys, Wipro
echo - 18 Jobs (6 per company)
echo - 10 Departments
echo.
echo Backend: http://localhost:8080
echo Frontend: Start with: cd frontend ^&^& npm run dev
echo.
echo Login credentials:
echo - Admin: admin@placify.com / admin123
echo - TCS: hr@tcs.com / password123
echo - Infosys: hr@infosys.com / password123
echo - Wipro: hr@wipro.com / password123
echo.
echo Next: Open http://localhost:5173 in browser
echo.
pause
