@echo off
echo Starting Placify AI with PostgreSQL...
echo.

echo Checking PostgreSQL service...
sc query postgresql-x64-18 | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo PostgreSQL service is not running. Please start it manually.
    echo Run: net start postgresql-x64-18 (as Administrator)
    pause
    exit /b 1
)

echo PostgreSQL service is running.
echo.

echo Creating database if it doesn't exist...
echo You may be prompted for the postgres user password.
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost placify_ai 2>nul
if %errorlevel% equ 0 (
    echo Database 'placify_ai' created successfully.
) else (
    echo Database 'placify_ai' already exists or creation failed.
    echo This is normal if the database already exists.
)

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && if exist mvn.cmd (mvn.cmd spring-boot:run) else (echo Maven not found. Please install Maven and try again. && pause)"

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
echo Database: PostgreSQL (placify_ai)
echo.
echo If you see connection errors, check:
echo 1. PostgreSQL service is running
echo 2. Database 'placify_ai' exists
echo 3. Username/password in application.properties is correct
echo.
echo Press any key to exit...
pause > nul