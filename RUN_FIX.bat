@echo off
echo Starting backend...
cd backend
start "Placify Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo Waiting 40 seconds for backend to start...
ping 127.0.0.1 -n 41 > nul

echo Logging in as admin...
for /f "tokens=*" %%a in ('curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}"') do set RESPONSE=%%a
echo %RESPONSE%

for /f "tokens=2 delims=:," %%a in ("%RESPONSE%") do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo.
echo Running fix-departments...
curl -X POST http://localhost:8080/api/admin/fix-departments -H "Authorization: Bearer %TOKEN%"

echo.
echo Done! Check your admin dashboard to see updated departments.
pause
