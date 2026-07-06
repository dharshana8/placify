@echo off
echo ========================================
echo   Starting Placify AI Application
echo ========================================
echo.

REM Kill any existing Java processes
echo Stopping any existing backend processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

REM Start Backend
echo.
echo [1/2] Starting Backend on port 8080...
cd backend
start "Placify Backend" cmd /k "set JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot && set PATH=%%JAVA_HOME%%\bin;%%PATH%% && mvnw.cmd spring-boot:run"
cd ..

REM Wait for backend to start
echo Waiting 40 seconds for backend to initialize...
ping 127.0.0.1 -n 41 > nul

REM Start Frontend
echo.
echo [2/2] Starting Frontend on port 5173...
cd frontend
start "Placify Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   Application Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Two windows will open:
echo   1. Backend (Spring Boot)
echo   2. Frontend (Vite React)
echo.
echo Wait for both to fully start, then open:
echo http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
