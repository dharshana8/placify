$env:JAVA_HOME="C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot"
Write-Host "Starting Placify AI Backend..." -ForegroundColor Green
Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Yellow
Set-Location "d:\placify2\placify\placify-ai\backend"
.\mvnw.cmd spring-boot:run
