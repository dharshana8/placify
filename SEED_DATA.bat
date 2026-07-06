@echo off
echo ========================================
echo SEEDING PLACIFY AI DATA
echo ========================================
echo.

echo Step 1: Getting admin token...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}" > token_temp.json

echo.
echo Step 2: Extracting token...
for /f "tokens=2 delims=:," %%a in ('findstr "token" token_temp.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo.
echo Step 3: Creating companies and jobs...
curl -X POST http://localhost:8080/api/admin/seed-data -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo Step 4: Fixing departments...
curl -X POST http://localhost:8080/api/admin/fix-departments -H "Authorization: Bearer %TOKEN%"

echo.
echo.
echo Step 5: Verifying data...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:8080/api/admin/stats

del token_temp.json

echo.
echo.
echo ========================================
echo SEEDING COMPLETE!
echo ========================================
echo.
echo Your database now has:
echo - 3 Companies (TCS, Infosys, Wipro)
echo - 18 Jobs
echo - 10 Departments
echo.
echo Open http://localhost:5173 and login as:
echo admin@placify.com / admin123
echo.
pause
