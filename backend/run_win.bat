@echo off
REM Run script for Windows to start the backend server

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Starting the server...
uvicorn main:app --reload --host 0.0.0.0 --port 8001

pause
