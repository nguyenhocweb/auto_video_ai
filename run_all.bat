@echo off
title Video AI - Full Stack Launcher
echo =====================================================================
echo            KHOI DONG HE THONG VIDEO AI (BACKEND + FRONTEND)
echo =====================================================================
echo.
start "Backend - FastAPI (OmniVoice)" run_be.bat
start "Frontend - Next.js App" run_fe.bat
echo Backend va Frontend da duoc khoi chay!
echo Backend API Docs: http://127.0.0.1:8001/docs
echo Frontend App:      http://localhost:3002
echo =====================================================================
timeout /t 5
