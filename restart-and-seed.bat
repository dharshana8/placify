@echo off
echo Restarting backend and seeding data...

cd /d d:\placify2\placify\placify-ai\backend

echo Starting Spring Boot...
start "Placify Backend" cmd /k "set JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot && mvnw.cmd spring-boot:run"

echo Waiting for backend to start...
timeout /t 20 /nobreak

echo Seeding data...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@placify.com\",\"password\":\"admin123\"}" > temp_token.json

for /f "tokens=2 delims=:," %%a in ('findstr "token" temp_token.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

curl -X POST http://localhost:8080/api/admin/seed-data -H "Authorization: Bearer %TOKEN%"

del temp_token.json

echo.
echo Done! Check if companies and jobs were created.
pause
