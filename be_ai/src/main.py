import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.modules.creator.voice.router import router as voice_router
from src.modules.creator.video.router import video_router
from src.modules.creator.dubbing.router import router as dubbing_router
from src.modules.creator.stitch.router import router as stitch_router
from src.modules.creator.storyboard.router import storyboard_router
from src.modules.creator.template_video.router import template_video_router
from src.modules.shared.auth.router import auth_router
from src.modules.shared.notifications.router import notifications_router
from src.modules.shared.ws.notification_ws import ws_router
from src.modules.creator.voice.voice_queue_manager import VoiceGenerationQueueManager
from src.modules.creator.dubbing.dubbing_queue_manager import DubbingQueueManager

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend AI Engine & Media Worker (OmniVoice TTS, Vietsub, Thuyết minh & Render)",
    version="1.0.0",
)

# Cấu hình CORS (Cho phép local dev và mọi domain triển khai trên Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Khởi tạo trạng thái hàng đợi AI và nạp cấu hình song song từ Database."""
    queue_mgr = VoiceGenerationQueueManager.get_instance()
    await queue_mgr.init_concurrency_from_db()
    dubbing_queue_mgr = DubbingQueueManager.get_instance()
    await dubbing_queue_mgr.init_concurrency_from_db()
    # Dọn dẹp các tác vụ mồ côi (stale jobs) bị gián đoạn do tắt máy hoặc khởi động lại server
    from src.modules.creator.dubbing.repository import DubbingMongoRepository
    await DubbingMongoRepository().cleanup_stale_processing_jobs()


@app.on_event("shutdown")
async def shutdown_event():
    """Dọn dẹp background tasks khi tắt server."""
    pass


# Đăng ký Routers AI Engine & Media Worker
app.include_router(auth_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")
app.include_router(ws_router, prefix="/api/v1")
app.include_router(voice_router, prefix="/api/v1/creator")
app.include_router(video_router, prefix="/api/v1/creator")
app.include_router(dubbing_router, prefix="/api/v1/creator")
app.include_router(stitch_router, prefix="/api/v1")
app.include_router(storyboard_router, prefix="/api/v1/creator")
app.include_router(template_video_router, prefix="/api/v1/creator")


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "engine": settings.OMNIVOICE_MODEL_ID,
        "device": settings.OMNIVOICE_DEVICE,
    }


@app.get("/", response_class=HTMLResponse, tags=["Public"])
async def home_page():
    return """<!DOCTYPE html>
<html>
<head>
    <title>Auto Video AI Studio</title>
    <meta name="tiktok-developers-site-verification" content="ExEJvY6WIw6HL5yDRx1sXyMPE9NjdKtp">
</head>
<body style="font-family:sans-serif;padding:40px;line-height:1.6;">
    <h1>Auto Video AI Studio</h1>
    <p>AI Video creation and content automation platform for creators.</p>
    <p><a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a></p>
</body>
</html>"""


@app.get("/terms", response_class=HTMLResponse, tags=["Public"])
async def terms_page():
    return """<!DOCTYPE html>
<html>
<head>
    <title>Terms of Service - Auto Video AI</title>
    <meta name="tiktok-developers-site-verification" content="ExEJvY6WIw6HL5yDRx1sXyMPE9NjdKtp">
</head>
<body style="font-family:sans-serif;padding:40px;line-height:1.6;">
    <h1>Terms of Service</h1>
    <p>Welcome to Auto Video AI. By accessing or using our platform, you agree to comply with our terms.</p>
</body>
</html>"""


@app.get("/tiktokExEJvY6WIw6HL5yDRx1sXyMPE9NjdKtp.txt", response_class=PlainTextResponse, tags=["Public"])
async def tiktok_verification():
    return "tiktok-developers-site-verification=ExEJvY6WIw6HL5yDRx1sXyMPE9NjdKtp"


@app.get("/privacy", response_class=HTMLResponse, tags=["Public"])
async def privacy_page():
    return """<!DOCTYPE html>
<html>
<head>
    <title>Privacy Policy - Auto Video AI</title>
    <meta name="tiktok-developers-site-verification" content="ExEJvY6WIw6HL5yDRx1sXyMPE9NjdKtp">
</head>
<body style="font-family:sans-serif;padding:40px;line-height:1.6;">
    <h1>Privacy Policy</h1>
    <p>Auto Video AI respects your privacy. We only use authorized access tokens to publish videos as requested by you.</p>
</body>
</html>"""


