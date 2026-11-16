@echo off
title Video AI - Backend & Cloudflare Launcher
chcp 65001 >nul
echo =====================================================================
echo         KHOI DONG HE THONG VIDEO AI (FASTAPI + CLOUDFLARE)
echo =====================================================================
echo.
echo Chon che do khoi dong:
echo   [1] Khoi dong Backend + Cloudflare Tunnel (Ket noi voi Vercel) [MAC DINH]
echo   [2] Chi khoi dong Backend Local (Chay noi bo tren may)
echo.
set /p choice="Nhap lua chon (1 hoac 2, Enter de chon [1]): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo [*] Dang khoi tao Cloudflare Tunnel o cua so rieng...
    start "Video AI - Cloudflare Tunnel (HTTPS)" cmd /k "title Cloudflare Tunnel (HTTPS cho Vercel) && echo Dang ket noi Cloudflare Tunnel... && cloudflared tunnel --url http://localhost:8001"
    echo [*] Da mo cua so Cloudflare Tunnel. Hay copy link https://...trycloudflare.com dan vao Vercel.
)

echo.
echo [*] Dang khoi dong Backend FastAPI tai cong 8001...
cd /d "%~dp0be"
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
pause
