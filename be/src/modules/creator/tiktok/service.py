import logging
import urllib.parse
from typing import Dict, Any, Optional, List
import httpx
from fastapi import HTTPException
from src.core.config import settings
from src.core.utils.date_utils import get_vn_now, to_vn_iso
from src.modules.creator.tiktok.repository import TikTokMongoRepository
from src.modules.creator.tiktok.schemas import (
    TikTokChannelListResponse,
    TikTokChannelItem,
    PublishTikTokRequest,
    PublishTikTokResponse,
)

logger = logging.getLogger("tiktok_service")


class TikTokService:
    """Xử lý toàn bộ logic nghiệp vụ xác thực OAuth v2 và đăng video lên TikTok."""

    def __init__(self):
        self.repo = TikTokMongoRepository()
        self.client_key = settings.TIKTOK_CLIENT_KEY
        self.client_secret = settings.TIKTOK_CLIENT_SECRET
        self.redirect_uri = settings.TIKTOK_REDIRECT_URI

    def get_auth_url(self, user_id: str, scope: Optional[str] = None) -> str:
        """Tạo đường dẫn ủy quyền TikTok OAuth v2 kèm scopes."""
        if not self.client_key:
            raise HTTPException(status_code=400, detail="Chưa cấu hình TIKTOK_CLIENT_KEY trong hệ thống.")

        target_scopes = scope or "user.info.basic"
        params = {
            "client_key": self.client_key,
            "scope": target_scopes,
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "state": user_id,
        }
        return f"{settings.TIKTOK_AUTH_BASE_URL}?{urllib.parse.urlencode(params)}"

    async def handle_callback(self, code: str, user_id: str) -> Dict[str, Any]:
        """Đổi mã Authorization Code lấy Access Token và lưu Kênh vào CSDL."""
        token_url = f"{settings.TIKTOK_API_BASE_URL}/oauth/token/"
        data = {
            "client_key": self.client_key,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache"}

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(token_url, data=data, headers=headers)
            res_data = resp.json()

        token_info = res_data.get("data") if isinstance(res_data.get("data"), dict) else res_data
        access_token = token_info.get("access_token")

        if resp.status_code != 200 or not access_token:
            err_msg = res_data.get("error_description") or res_data.get("message") or resp.text
            logger.error(f"Lỗi đổi TikTok token: {err_msg}")
            raise HTTPException(status_code=400, detail=f"TikTok OAuth Error: {err_msg}")

        refresh_token = token_info.get("refresh_token")
        open_id = token_info.get("open_id") or ""
        scope = token_info.get("scope")
        expires_in = token_info.get("expires_in", 86400)

        # Lấy thông tin tài khoản người dùng
        user_info = await self._fetch_user_profile(access_token)
        channel_data = {
            "channel_id": open_id or user_info.get("open_id", ""),
            "display_name": user_info.get("display_name") or f"TikTok_{open_id[:6]}",
            "username": user_info.get("username"),
            "avatar_url": user_info.get("avatar_url"),
            "follower_count": user_info.get("follower_count", 0),
            "likes_count": user_info.get("likes_count", 0),
            "video_count": user_info.get("video_count", 0),
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_expires_in": expires_in,
            "scope": scope,
            "is_active": True,
        }

        saved = await self.repo.save_channel(user_id=user_id, data=channel_data)
        logger.info(f"Đã liên kết kênh TikTok: {saved.get('display_name')} (ID: {open_id})")
        return saved

    async def _fetch_user_profile(self, access_token: str) -> Dict[str, Any]:
        """Gọi TikTok API lấy profile người dùng."""
        fields = "open_id,union_id,avatar_url,display_name"
        url = f"{settings.TIKTOK_API_BASE_URL}/user/info/?fields={fields}"
        headers = {"Authorization": f"Bearer {access_token}"}

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(url, headers=headers)
                data = res.json()
                if res.status_code == 200:
                    user_obj = data.get("data", {}).get("user") or data.get("user")
                    if isinstance(user_obj, dict):
                        return user_obj
        except Exception as ex:
            logger.warning(f"Không thể lấy profile TikTok: {ex}")
        return {}

    async def get_channels(self, user_id: str) -> TikTokChannelListResponse:
        """Lấy danh sách các kênh TikTok của người dùng."""
        items = await self.repo.get_channels(user_id)
        channels = [TikTokChannelItem(**it) for it in items]
        return TikTokChannelListResponse(channels=channels, total=len(channels))

    async def disconnect_channel(self, user_id: str, channel_id: str) -> bool:
        """Hủy liên kết kênh TikTok."""
        return await self.repo.disconnect_channel(user_id=user_id, channel_id=channel_id)

    async def publish_video_direct(
        self,
        user_id: str,
        request: PublishTikTokRequest,
        video_bytes: Optional[bytes] = None,
    ) -> PublishTikTokResponse:
        """Khởi tạo và tải video trực tiếp lên kênh TikTok bằng Content Posting API."""
        channel = await self.repo.get_channel(user_id=user_id, channel_id=request.channel_id)
        if not channel or not channel.get("access_token"):
            raise HTTPException(status_code=404, detail="Không tìm thấy kênh TikTok hoặc thiếu Access Token.")

        access_token = channel["access_token"]
        if not video_bytes and request.video_url:
            async with httpx.AsyncClient(timeout=60.0) as client:
                v_res = await client.get(request.video_url)
                if v_res.status_code == 200:
                    video_bytes = v_res.content

        if not video_bytes:
            raise HTTPException(status_code=400, detail="Không tìm thấy nội dung file video để đăng.")

        video_size = len(video_bytes)
        # Bước 1: Khởi tạo tác vụ Direct Post Video
        init_url = f"{settings.TIKTOK_API_BASE_URL}/post/publish/video/init/"
        payload = {
            "post_info": {
                "title": request.title,
                "privacy_level": request.privacy_level,
                "disable_duet": request.disable_duet,
                "disable_comment": request.disable_comment,
                "disable_stitch": request.disable_stitch,
                "video_cover_timestamp_ms": request.video_cover_timestamp_ms,
            },
            "source_info": {
                "source": "FILE_UPLOAD",
                "video_size": video_size,
                "chunk_size": video_size,
                "total_chunk_count": 1,
            },
        }
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json; charset=UTF-8",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(init_url, json=payload, headers=headers)
            init_data = resp.json()

        if resp.status_code != 200 or "data" not in init_data:
            err = init_data.get("error", {}).get("message") or resp.text
            logger.error(f"Lỗi khởi tạo upload TikTok: {err}")
            raise HTTPException(status_code=400, detail=f"Lỗi TikTok Video Init: {err}")

        publish_id = init_data["data"].get("publish_id", "")
        upload_url = init_data["data"].get("upload_url", "")

        # Bước 2: Tải video bytes lên URL máy chủ TikTok
        if upload_url:
            upload_headers = {
                "Content-Type": "video/mp4",
                "Content-Range": f"bytes 0-{video_size - 1}/{video_size}",
                "Content-Length": str(video_size),
            }
            async with httpx.AsyncClient(timeout=120.0) as client:
                up_res = await client.put(upload_url, content=video_bytes, headers=upload_headers)
                if up_res.status_code not in (200, 201):
                    logger.warning(f"TikTok upload chunk warning: {up_res.status_code} - {up_res.text}")

        now = to_vn_iso(get_vn_now())
        log_data = {
            "channel_id": request.channel_id,
            "publish_id": publish_id,
            "title": request.title,
            "privacy_level": request.privacy_level,
            "status": "PROCESSING",
        }
        await self.repo.record_uploaded_video(user_id=user_id, data=log_data)

        return PublishTikTokResponse(
            publish_id=publish_id,
            channel_id=request.channel_id,
            status="PROCESSING",
            title=request.title,
            uploaded_at=now,
            message="Đã khởi tạo đăng video lên TikTok thành công! TikTok đang xử lý kiểm duyệt nội dung.",
        )
