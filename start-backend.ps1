# PowerShell script to start Placify AI Backend
Write-Host "Starting Placify AI Backend..." -ForegroundColor Green
Write-Host ""

Set-Location "backend"

Write-Host "Checking Java..." -ForegroundColor Yellow
java -version

Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Cyan
Write-Host ""

& ".\mvnw.cmd" spring-boot:run