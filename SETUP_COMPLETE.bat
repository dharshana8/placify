@echo off
title Placify AI - Complete Setup
color 0A

echo.
echo ========================================
echo   PLACIFY AI - AUTOMATED SETUP
echo ========================================
echo.

echo [Step 1/5] Checking Backend Status...
netstat -ano | findstr :8080 > nul
if %errorlevel% equ 0 (
    echo Backend is already running on port 8080
    echo.
    choice /C YN /M "Kill existing process and restart"
    if errorlevel 2 goto skip_kill
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
        echo Killing process %%a...
        taskkill /F /PID %%a > nul 2>&1
    )
    timeout /t 2 /nobreak > nul
)
:skip_kill

echo.
echo [Step 2/5] Starting Backend...
cd /d d:\placify2\placify\placify-ai\backend
set JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot
start "Placify Backend" cmd /k "echo Starting Placify AI Backend... && mvnw.cmd spring-boot:run"

echo Waiting for backend to initialize (30 seconds)...
timeout /t 30 /nobreak > nul

echo.
echo [Step 3/5] Testing Backend Health...
:check_health
curl -s http://localhost:8080/api/health > nul 2>&1
if %errorlevel% neq 0 (
    echo Backend not ready yet, waiting 5 more seconds...
    timeout /t 5 /nobreak > nul
    goto check_health
)
echo Backend is UP and healthy!

echo.
echo [Step 4/5] Seeding Sample Data...
cd /d d:\placify2\placify\placify-ai

echo Getting admin token...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}" > temp_token.json

for /f "tokens=2 delims=:," %%a in ('findstr "token" temp_token.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo Seeding companies and jobs...
curl -s -X POST http://localhost:8080/api/admin/seed-data -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
echo.

echo Fixing department data...
curl -s -X POST http://localhost:8080/api/admin/fix-departments -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
echo.

del temp_token.json

echo.
echo [Step 5/5] Verifying Setup...
echo.
echo Checking statistics...
curl -s -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/admin/stats
echo.
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Next Steps:
echo 1. Open new terminal and run: cd frontend ^&^& npm run dev
echo 2. Open browser: http://localhost:5173
echo 3. Login as admin@placify.com / admin123
echo 4. Verify dashboard shows 3 companies and 18 jobs
echo.
echo Sample Logins:
echo - Admin: admin@placify.com / admin123
echo - TCS: hr@tcs.com / password123
echo - Infosys: hr@infosys.com / password123
echo - Wipro: hr@wipro.com / password123
echo.
echo AI Features Ready:
echo - Placement Prediction
echo - Skill Gap Analysis
echo - Mock Interview
echo - Candidate Ranking
echo.
echo Press any key to open frontend setup instructions...
pause > nul

echo.
echo ========================================
echo   FRONTEND SETUP
echo ========================================
echo.
echo Run these commands in a NEW terminal:
echo.
echo   cd d:\placify2\placify\placify-ai\frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause
