@echo off
title OmniVoice Local WebUI - Video AI
echo =====================================================================
echo           KHOI DONG GIAO DIEN OMNIVOICE (LOCAL DEMO)
echo =====================================================================
echo.
cd /d "%~dp0"
set PYTHONPATH=%~dp0app\core\engines;%PYTHONPATH%
python -m omnivoice.cli.demo --ip 127.0.0.1 --port 8001
pause
