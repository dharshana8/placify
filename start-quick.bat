@echo off
echo ========================================
echo    Placify AI - Quick Start (H2 DB)
echo ========================================
echo.
echo Using H2 in-memory database (no PostgreSQL required)
echo.

echo Starting Backend with H2 Database...
cd /d "%~dp0backend"

echo Cleaning and building...
call mvn clean compile -q

echo Starting Spring Boot with H2 profile...
start "Placify Backend (H2)" cmd /k "mvn spring-boot:run -Dspring-boot.run.profiles=h2"

cd /d "%~dp0"

echo Waiting for backend to start...
timeout /t 15 >nul

echo Starting Frontend...
start "Placify Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo    Placify AI is starting up!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Sample Login Credentials:
echo -------------------------
echo Student:  student@college.edu / student123
echo Company:  hr@techcorp.com / company123
echo Admin:    admin@placify.com / admin123
echo.
echo Note: Using H2 in-memory database
echo Data will be reset on each restart
echo.
echo Press any key to close this window...
pause >nul