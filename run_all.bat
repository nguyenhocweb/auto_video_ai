@echo off
title Video AI - Full Stack Launcher
echo =====================================================================
echo    KHOI DONG TOAN BO HE THONG VIDEO AI (CORE + AI ENGINE + FRONTEND)
echo =====================================================================
echo.
start "Server 1: Backend Core (Port 8001)" run_be.bat
start "Server 2: AI Engine & Vietsub (Port 8002)" run_be_ai.bat
start "Frontend - Next.js App" run_fe.bat
echo He thong da duoc khoi chay day du!
echo - Server 1 Core (Cào & Đăng):       http://127.0.0.1:8001/docs
echo - Server 2 AI (Vietsub & Dubbing):   http://127.0.0.1:8002/docs
echo - Frontend Next.js Studio:           http://localhost:3002
echo =====================================================================
timeout /t 5
