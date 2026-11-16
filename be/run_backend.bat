@echo off
title Video AI Backend - FastAPI + OmniVoice
chcp 65001 >nul
echo =====================================================================
echo            KHOI DONG BACKEND VIDEO AI (FASTAPI)
echo =====================================================================
echo.
cd /d "%~dp0"
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
pause
