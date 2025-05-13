@echo off

set NODE_ENV=test

REM Activate Python venv and run FastAPI

cd ..\ai-services
call .venv\Scripts\activate
start /b python -m uvicorn main:app --port 8000
cd ..\backend

REM Wait for port 8000 to be available
:loop
powershell -Command "(New-Object Net.Sockets.TcpClient).Connect('localhost',8000)" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 >nul
    goto loop
)


REM Run Node.js tests
call npm test

REM Kill FastAPI server (rudimentary)
taskkill /f /im python.exe
