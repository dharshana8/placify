@echo off
echo ========================================
echo    Placify AI - Simple Startup
echo ========================================
echo.

echo Starting Backend...
start "Placify Backend" cmd /k "cd /d %~dp0backend && .\mvnw.cmd spring-boot:run"

echo.
echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak >nul

echo.
echo Starting Frontend...
start "Placify Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo    Applications Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Login Credentials:
echo Student:  student@college.edu / student123
echo Company:  hr@techcorp.com / company123
echo Admin:    admin@placify.com / admin123
echo.
echo Press any key to close...
pause