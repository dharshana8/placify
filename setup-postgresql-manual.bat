@echo off
echo ========================================
echo    PostgreSQL Manual Setup Guide
echo ========================================
echo.

echo STEP 1: Install PostgreSQL
echo --------------------------
echo 1. Download from: https://www.postgresql.org/download/windows/
echo 2. Install with these settings:
echo    - Username: postgres
echo    - Password: dharsh2803
echo    - Port: 5432
echo    - Install pgAdmin (recommended)
echo.

echo STEP 2: Start PostgreSQL Service
echo ---------------------------------
echo After installation, PostgreSQL should start automatically.
echo If not, you can start it manually:
echo.
echo Method 1 - Windows Services:
echo 1. Press Win + R, type "services.msc"
echo 2. Find "postgresql-x64-15" (or similar)
echo 3. Right-click and select "Start"
echo.
echo Method 2 - Command Line (if in PATH):
echo net start postgresql-x64-15
echo.

echo STEP 3: Create Database
echo -----------------------
echo 1. Open pgAdmin or use psql command line
echo 2. Connect with:
echo    - Host: localhost
echo    - Port: 5432
echo    - Username: postgres
echo    - Password: dharsh2803
echo.
echo 3. Run this SQL:
echo    CREATE DATABASE placify_ai;
echo.

echo STEP 4: Test Connection
echo ----------------------
echo Try connecting to: localhost:5432
echo Database: placify_ai
echo Username: postgres
echo Password: dharsh2803
echo.

echo ========================================
echo After PostgreSQL is running, use:
echo ./start-backend.bat
echo ========================================
echo.
pause