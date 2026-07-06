@echo off
echo Starting Placify AI...
echo.

echo [1/2] Starting Backend...
start "Backend" cmd /c "cd backend && .\mvnw.cmd spring-boot:run && pause"

echo Waiting for backend to start...
timeout /t 20 >nul

echo [2/2] Starting Frontend...
start "Frontend" cmd /c "cd frontend && npm run dev && pause"

echo.
echo ========================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Login with:
echo student@college.edu / student123
echo ========================================
pause