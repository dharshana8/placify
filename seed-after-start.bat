@echo off
echo Waiting for backend to be ready...
timeout /t 5 /nobreak > nul

:check
curl -s http://localhost:8080/api/health > nul 2>&1
if %errorlevel% neq 0 (
    echo Backend not ready, waiting...
    timeout /t 3 /nobreak > nul
    goto check
)

echo Backend is ready! Seeding data...
echo.

curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}" > token.json

for /f "tokens=2 delims=:," %%a in ('findstr "token" token.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo Creating companies and jobs...
curl -X POST http://localhost:8080/api/admin/seed-data -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo Fixing departments...
curl -X POST http://localhost:8080/api/admin/fix-departments -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo Checking stats...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/admin/stats
echo.
echo.

del token.json

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Your Placify AI is ready with:
echo - 3 Companies (TCS, Infosys, Wipro)
echo - 18 Jobs
echo - 10 Departments
echo.
echo Login: admin@placify.com / admin123
echo.
pause
