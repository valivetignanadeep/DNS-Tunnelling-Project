@echo off
cd /d "%~dp0"
title DNS Tunneling Detector - Launcher
echo Starting DNS Tunneling Detector (Backend: 5000 + Frontend: 5173)...
npm start
pause
