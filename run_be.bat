@echo off
title Video AI - Backend & Tunnel Launcher
chcp 65001 >nul
echo =====================================================================
echo         KHỞI ĐỘNG HỆ THỐNG VIDEO AI BACKEND (FASTAPI CỔNG 8001)
echo =====================================================================
echo.
echo Chọn chế độ khởi động máy chủ:
echo   [1] Backend + Ngrok Static Tunnel (Cổng 8001 -^> giant-drudge-pastime.ngrok-free.dev)
echo       ==^> [MẶC ĐỊNH - DÙNG CHO TIKTOK, FACEBOOK & VERCEL]
echo.
echo   [2] Backend + Cloudflare Tunnel (Cổng 8001 -^> trycloudflare.com)
echo   [3] Chỉ chạy Backend Local (Cổng 8001 - Chạy nội bộ trên máy)
echo.
set /p choice="Nhập lựa chọn (1, 2 hoặc 3, nhấn Enter để chọn [1]): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo.
    echo [*] Đang khởi chạy Ngrok Static Tunnel (Cổng 8001)...
    start "Video AI - Ngrok Tunnel (giant-drudge-pastime.ngrok-free.dev)" cmd /k "title Ngrok Tunnel (TikTok & Vercel) && echo Đang kết nối Ngrok Tunnel tới cổng 8001... && ngrok http --domain=giant-drudge-pastime.ngrok-free.dev 8001"
    echo [*] Đã mở cửa sổ Ngrok Tunnel (https://giant-drudge-pastime.ngrok-free.dev).
)

if "%choice%"=="2" (
    echo.
    echo [*] Đang khởi tạo Cloudflare Tunnel ở cửa sổ riêng...
    start "Video AI - Cloudflare Tunnel (HTTPS)" cmd /k "title Cloudflare Tunnel (HTTPS cho Vercel) && echo Đang kết nối Cloudflare Tunnel... && cloudflared tunnel --url http://localhost:8001"
    echo [*] Đã mở cửa sổ Cloudflare Tunnel. Hãy copy link https://...trycloudflare.com dán vào Vercel.
)

echo.
echo [*] Đang khởi động Backend FastAPI tại cổng 8001...
cd /d "%~dp0be"
python -m uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
pause
