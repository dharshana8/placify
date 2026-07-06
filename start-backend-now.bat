@echo off
cd /d d:\placify2\placify\placify-ai\backend
set JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot
echo Starting Placify AI Backend...
echo.
mvnw.cmd spring-boot:run
