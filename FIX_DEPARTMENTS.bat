@echo off
echo Killing any existing Java processes...
taskkill /F /IM java.exe 2>nul

echo Starting backend...
cd backend
start "Placify Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo Waiting 60 seconds for backend to fully start...
ping 127.0.0.1 -n 61 > nul

echo Testing connection...
curl -s http://localhost:8080/api/auth/login > nul
if errorlevel 1 (
    echo Backend not ready yet, waiting 20 more seconds...
    ping 127.0.0.1 -n 21 > nul
)

echo Logging in as admin...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}" > token.txt

for /f "tokens=2 delims=:, " %%a in ('type token.txt ^| findstr "token"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%

echo.
echo Running fix-departments...
curl -X POST http://localhost:8080/api/admin/fix-departments -H "Authorization: Bearer %TOKEN%"

del token.txt

echo.
echo.
echo Done! All students should now have proper department names.
pause
