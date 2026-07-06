@echo off
echo Starting Placify AI - Campus Placement Management System
echo.

echo Installing dependencies...
cd frontend
call npm install
cd ..

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo.
echo Starting frontend development server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul