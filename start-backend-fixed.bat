@echo off
echo Setting up Java environment...
set JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME: %JAVA_HOME%
echo.

echo Testing Java...
java -version
echo.

echo Starting Placify AI Backend...
cd backend
mvnw.cmd spring-boot:run

pause