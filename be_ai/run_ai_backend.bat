@echo off
chcp 65001 > nul
title Video AI - AI Engine ^& Media Worker (Port 8002)

echo ==============================================================================
echo                 VIDEO AI PLATFORM - AI ENGINE & MEDIA WORKER
echo               Khởi chạy cụm xử lý AI, Vietsub, Thuyết minh & Render
echo                              Cổng (Port): 8002
echo ==============================================================================

cd /d "%~dp0"
python -m uvicorn src.main:app --host 127.0.0.1 --port 8002 --reload
pause
