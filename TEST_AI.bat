@echo off
echo Testing AI Service...
echo.

curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBnH3WQWuMoJjjtaHgB9Ezq-CVQe2joaRk" ^
-H "Content-Type: application/json" ^
-d "{\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"Say hello in JSON format: {\\\"message\\\": \\\"your response\\\"}\"}]}],\"generationConfig\":{\"temperature\":0.4,\"responseMimeType\":\"application/json\"}}"

echo.
echo.
echo If you see a JSON response above, AI is working!
pause
