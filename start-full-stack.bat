@echo off
echo ========================================
echo    Placify AI - Full Stack Startup
echo ========================================
echo.

echo PostgreSQL is already running on port 5432!
echo.

echo Starting Backend (Spring Boot)...
start "Placify Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 >nul

echo Starting Frontend (React + Vite)...
start "Placify Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo    Placify AI is starting up!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Sample Login Credentials:
echo -------------------------
echo Student:  student@college.edu / student123
echo Company:  hr@techcorp.com / company123
echo Admin:    admin@placify.com / admin123
echo.
echo Press any key to close this window...
pause >nul