@echo off
echo Testing Placify AI Backend APIs...
echo.

set BASE_URL=http://localhost:8080/api

echo 1. Testing Health Check...
curl -s %BASE_URL%/health
echo.
echo.

echo 2. Testing Database Health...
curl -s %BASE_URL%/health/db
echo.
echo.

echo 3. Testing User Registration...
curl -s -X POST %BASE_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"role\":\"STUDENT\",\"departmentName\":\"Computer Science\"}"
echo.
echo.

echo 4. Testing User Login...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"student@college.edu\",\"password\":\"student123\"}"
echo.
echo.

echo 5. Testing Job Listings...
curl -s %BASE_URL%/jobs
echo.
echo.

echo API Testing Complete!
pause