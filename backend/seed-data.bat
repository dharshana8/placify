@echo off
curl -X POST http://localhost:8080/api/admin/seed-data ^
  -H "Content-Type: application/json"
pause
