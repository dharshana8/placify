@echo off
echo PostgreSQL Database Setup for Placify AI
echo ========================================
echo.

echo This script will create the database and user for Placify AI.
echo You will be prompted for the postgres user password.
echo.

set /p continue="Continue? (y/n): "
if /i not "%continue%"=="y" exit /b

echo.
echo Creating database 'placify_ai'...
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost placify_ai
if %errorlevel% equ 0 (
    echo ✓ Database created successfully
) else (
    echo ! Database creation failed or already exists
)

echo.
echo Creating user 'placify_user'...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d placify_ai -c "CREATE USER placify_user WITH PASSWORD 'placify123';"
if %errorlevel% equ 0 (
    echo ✓ User created successfully
) else (
    echo ! User creation failed or already exists
)

echo.
echo Granting privileges...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d placify_ai -c "GRANT ALL PRIVILEGES ON DATABASE placify_ai TO placify_user;"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d placify_ai -c "GRANT ALL ON SCHEMA public TO placify_user;"

echo.
echo Testing connection...
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U placify_user -h localhost -d placify_ai -c "SELECT current_database(), current_user;"

echo.
echo Database setup complete!
echo You can now run start-postgresql.bat to start the application.
echo.
pause