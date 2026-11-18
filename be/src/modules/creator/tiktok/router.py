import logging
from typing import Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from src.modules.shared.auth.dependencies import get_current_user
from src.modules.creator.tiktok.schemas import (
    TikTokAuthUrlResponse,
    TikTokChannelListResponse,
    PublishTikTokRequest,
    PublishTikTokResponse,
)
from src.modules.creator.tiktok.service import TikTokService

logger = logging.getLogger("tiktok_router")

tiktok_router = APIRouter(prefix="/tiktok", tags=["Creator - TikTok Publisher"])
service = TikTokService()


def _get_user_id(user: Any) -> str:
    """Trích xuất User ID từ JWT token dict hoặc object."""
    if isinstance(user, dict):
        return str(user.get("id") or user.get("_id") or "")
    return str(getattr(user, "id", ""))


@tiktok_router.get("/auth-url", response_model=TikTokAuthUrlResponse)
async def get_auth_url(current_user=Depends(get_current_user)):
    """Lấy đường dẫn ủy quyền TikTok OAuth v2 để kết nối Kênh."""
    try:
        url = service.get_auth_url(user_id=_get_user_id(current_user))
        return TikTokAuthUrlResponse(auth_url=url)
    except Exception as ex:
        logger.error(f"Lỗi tạo link TikTok OAuth: {ex}")
        raise HTTPException(status_code=400, detail=str(ex))


@tiktok_router.get("/callback")
async def oauth_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    error_description: Optional[str] = Query(None),
):
    """TikTok chuyển hướng về endpoint này sau khi người dùng cấp quyền."""
    fe_redirect = "http://localhost:3002/creator/tiktok"
    if error:
        logger.warning(f"TikTok OAuth từ chối: {error} - {error_description}")
        return RedirectResponse(f"{fe_redirect}?tiktok_error={error}")

    if not code:
        raise HTTPException(status_code=400, detail="Thiếu mã Authorization Code từ TikTok.")

    user_id = state or "default_user"
    try:
        await service.handle_callback(code=code, user_id=user_id)
        return RedirectResponse(f"{fe_redirect}?tiktok_connected=true")
    except Exception as ex:
        logger.error(f"Lỗi callback TikTok: {ex}")
        return RedirectResponse(f"{fe_redirect}?tiktok_error={str(ex)}")


@tiktok_router.get("/channels", response_model=TikTokChannelListResponse)
async def get_channels(current_user=Depends(get_current_user)):
    """Lấy danh sách tất cả các Kênh TikTok đã liên kết của người dùng."""
    try:
        return await service.get_channels(user_id=_get_user_id(current_user))
    except Exception as ex:
        logger.error(f"Lỗi lấy danh sách kênh TikTok: {ex}")
        raise HTTPException(status_code=500, detail=str(ex))


@tiktok_router.delete("/channels/{channel_id}")
async def disconnect_channel(channel_id: str, current_user=Depends(get_current_user)):
    """Hủy liên kết một Kênh TikTok."""
    success = await service.disconnect_channel(user_id=_get_user_id(current_user), channel_id=channel_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy kênh hoặc hủy liên kết thất bại.")
    return {"status": "success", "message": "Đã hủy liên kết kênh TikTok thành công."}


@tiktok_router.post("/publish", response_model=PublishTikTokResponse)
async def publish_video(
    channel_id: str = Form(...),
    title: str = Form(...),
    privacy_level: str = Form("PUBLIC_TO_EVERYONE"),
    disable_duet: bool = Form(False),
    disable_comment: bool = Form(False),
    disable_stitch: bool = Form(False),
    video_cover_timestamp_ms: int = Form(1000),
    video_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user=Depends(get_current_user),
):
    """Xuất bản video trực tiếp lên Kênh TikTok (Direct Post)."""
    user_id = _get_user_id(current_user)
    video_bytes = None
    if file:
        video_bytes = await file.read()

    req = PublishTikTokRequest(
        channel_id=channel_id,
        video_url=video_url,
        title=title,
        privacy_level=privacy_level,
        disable_duet=disable_duet,
        disable_comment=disable_comment,
        disable_stitch=disable_stitch,
        video_cover_timestamp_ms=video_cover_timestamp_ms,
    )
    return await service.publish_video_direct(user_id=user_id, request=req, video_bytes=video_bytes)
