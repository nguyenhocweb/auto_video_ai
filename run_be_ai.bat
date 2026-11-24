@echo off
chcp 65001 >nul
title Video AI - AI Engine & Vietsub Worker (Port 8002)

echo =====================================================================
echo    KHOI DONG SERVER AI: VIETSUB, THUYET MINH, OMNIVOICE & RENDER
echo                          Cong (Port): 8002
echo =====================================================================
echo.
echo Chon che do khoi dong server AI:
echo   [1] AI Backend + Ngrok Tunnel (Cong 8002 - De Vercel goi ve may nha)
echo   [2] AI Backend + Cloudflare Tunnel (Cong 8002)
echo   [3] Chi chay AI Backend Local (Cong 8002)
echo.
set "choice=1"
set /p "choice=Nhap lua chon (1, 2 hoac 3, nhan Enter de chon [1]): "

if "%choice%"=="1" goto start_ngrok
if "%choice%"=="2" goto start_cloudflare
goto start_backend

:start_ngrok
echo.
echo [*] Dang khoi chay Ngrok Tunnel tai cong 8002...
start "Video AI - AI Ngrok Tunnel 8002" cmd /k "ngrok http 8002"
echo [*] Da mo cua so Ngrok Tunnel (Hay copy link https://... gan vao Vercel NEXT_PUBLIC_AI_API_URL).
goto start_backend

:start_cloudflare
echo.
echo [*] Dang khoi tao Cloudflare Tunnel tai cong 8002...
start "Video AI - AI Cloudflare Tunnel 8002" cmd /k "cloudflared tunnel --url http://localhost:8002"
echo [*] Da mo cua so Cloudflare Tunnel.
goto start_backend

:start_backend
echo.
echo [*] Dang khoi dong AI Backend (OmniVoice, Whisper, Dubbing) tai cong 8002...
cd /d "%~dp0be_ai"
python -m uvicorn src.main:app --host 0.0.0.0 --port 8002 --reload
pause
