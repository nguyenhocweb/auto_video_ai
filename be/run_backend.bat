@echo off
title Video AI Backend - FastAPI + OmniVoice
echo =====================================================================
echo            KHOI DONG BACKEND VIDEO AI (FASTAPI)
echo =====================================================================
echo.
cd /d "%~dp0"
python -m uvicorn src.main:app --host 127.0.0.1 --port 8001 --reload
pause

