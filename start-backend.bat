@echo off
echo Starting Placify AI Backend...
echo.

cd /d "%~dp0backend"

echo PostgreSQL is running on port 5432. Starting Spring Boot application...
echo.

.\mvnw.cmd spring-boot:run

pause