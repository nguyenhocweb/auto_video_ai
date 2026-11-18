@echo off
chcp 65001 >nul
title Video AI - Backend Launcher

echo =====================================================================
echo         KHOI DONG HE THONG VIDEO AI BACKEND (FASTAPI CONG 8001)
echo =====================================================================
echo.
echo Chon che do khoi dong may chu:
echo   [1] Backend + Ngrok Tunnel (giant-drudge-pastime.ngrok-free.dev - Khuyen dung)
echo   [2] Backend + Cloudflare Tunnel (trycloudflare.com)
echo   [3] Chi chay Backend Local (Cong 8001)
echo.
set "choice=1"
set /p "choice=Nhap lua chon (1, 2 hoac 3, nhan Enter de chon [1]): "

if "%choice%"=="1" goto start_ngrok
if "%choice%"=="2" goto start_cloudflare
goto start_backend

:start_ngrok
echo.
echo [*] Dang khoi chay Ngrok Tunnel tinh...
start "Video AI - Ngrok Tunnel" cmd /k "ngrok http --domain=giant-drudge-pastime.ngrok-free.dev 8001"
echo [*] Da mo cua so Ngrok Tunnel.
goto start_backend

:start_cloudflare
echo.
echo [*] Dang khoi tao Cloudflare Tunnel...
start "Video AI - Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:8001"
echo [*] Da mo cua so Cloudflare Tunnel.
goto start_backend

:start_backend
echo.
echo [*] Dang khoi dong Backend FastAPI tai cong 8001...
cd /d "%~dp0be"
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
pause
