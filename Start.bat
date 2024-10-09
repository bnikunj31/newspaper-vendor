@echo off
cd /d "%~dp0"              
start "" cmd /c npm run electron .\main.js
@REM start "" cmd /c "npm start" 
timeout /t 3 /nobreak > nul
exit