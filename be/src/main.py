import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.modules.creator.voice.router import router as voice_router
from src.modules.creator.video.router import video_router
from src.modules.creator.dubbing.router import router as dubbing_router
from src.modules.creator.inspector.router import inspector_router
from src.modules.creator.facebook.router import facebook_router
from src.modules.creator.youtube.router import router as youtube_router
from src.modules.creator.douyin.router import router as douyin_router
from src.modules.creator.automation.router import automation_router
from src.modules.creator.bgm.router import bgm_router
from src.modules.creator.storyboard.router import storyboard_router
from src.modules.shared.auth.router import auth_router
from src.modules.shared.notifications.router import notifications_router
from src.modules.admin.dashboard.router import admin_dashboard_router
from src.modules.admin.users.router import admin_users_router
from src.modules.admin.voices.router import admin_voices_router
from src.modules.admin.settings.router import admin_settings_router
from src.modules.shared.ws.notification_ws import ws_router
from src.modules.creator.voice.voice_queue_manager import VoiceGenerationQueueManager
from src.modules.creator.dubbing.dubbing_queue_manager import DubbingQueueManager
from src.modules.creator.automation.scheduler import AutomationScheduler

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API nền tảng Video AI Automation (Tích hợp OmniVoice TTS & Hàng đợi Async)",
    version="1.0.0",
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Khởi tạo trạng thái hàng đợi và nạp cấu hình song song từ Database."""
    queue_mgr = VoiceGenerationQueueManager.get_instance()
    await queue_mgr.init_concurrency_from_db()
    dubbing_queue_mgr = DubbingQueueManager.get_instance()
    await dubbing_queue_mgr.init_concurrency_from_db()
    # Dọn dẹp các tác vụ mồ côi (stale jobs) bị gián đoạn do tắt máy hoặc khởi động lại server
    from src.modules.creator.dubbing.repository import DubbingMongoRepository
    await DubbingMongoRepository().cleanup_stale_processing_jobs()
    # Khởi động bộ lập lịch Automation cào và đăng video tự động
    AutomationScheduler.get_instance().start()


@app.on_event("shutdown")
async def shutdown_event():
    """Dừng các background tasks khi tắt server."""
    AutomationScheduler.get_instance().stop()


# Đăng ký Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")
app.include_router(ws_router, prefix="/api/v1")
app.include_router(voice_router, prefix="/api/v1/creator")
app.include_router(video_router, prefix="/api/v1/creator")
app.include_router(dubbing_router, prefix="/api/v1/creator")
app.include_router(inspector_router, prefix="/api/v1/creator")
app.include_router(facebook_router, prefix="/api/v1/creator")
app.include_router(youtube_router, prefix="/api/v1/creator")
app.include_router(douyin_router, prefix="/api/v1/creator")
app.include_router(automation_router, prefix="/api/v1/creator")
app.include_router(bgm_router, prefix="/api/v1/creator")
app.include_router(storyboard_router, prefix="/api/v1/creator")
app.include_router(admin_dashboard_router, prefix="/api/v1/admin")
app.include_router(admin_users_router, prefix="/api/v1/admin")
app.include_router(admin_voices_router, prefix="/api/v1/admin")
app.include_router(admin_settings_router, prefix="/api/v1/admin")


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "engine": settings.OMNIVOICE_MODEL_ID,
        "device": settings.OMNIVOICE_DEVICE,
    }
