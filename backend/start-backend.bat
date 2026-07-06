@echo off
set "JAVA_HOME=C:\Program Files\OpenLogic\jdk-17.0.14.7-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
mvnw.cmd spring-boot:run
