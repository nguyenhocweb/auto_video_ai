import os
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import httpx
from src.core.config import settings

logger = logging.getLogger("youtube_publisher")

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
API_BASE = "https://www.googleapis.com/youtube/v3"
UPLOAD_BASE = "https://www.googleapis.com/upload/youtube/v3"

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube",
]


class YouTubePublisher:
    @staticmethod
    def get_auth_url(state: Optional[str] = None) -> str:
        """Tạo đường link xác thực OAuth 2.0 (access_type=offline để lấy refresh_token vĩnh viễn)."""
        client_id = getattr(settings, "YOUTUBE_CLIENT_ID", "").strip()
        redirect_uri = getattr(settings, "YOUTUBE_REDIRECT_URI", "").strip()
        if not client_id:
            raise ValueError("Thiếu cấu hình YOUTUBE_CLIENT_ID trong .env")

        scope_str = " ".join(SCOPES)
        import urllib.parse
        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scope_str,
            "access_type": "offline",
            "prompt": "consent",
        }
        if state:
            params["state"] = state
        return f"{AUTH_URL}?{urllib.parse.urlencode(params)}"

    @staticmethod
    async def exchange_code_for_tokens(code: str) -> Dict[str, Any]:
        """Đổi mã Authorization Code lấy access_token và refresh_token vĩnh viễn."""
        client_id = getattr(settings, "YOUTUBE_CLIENT_ID", "").strip()
        client_secret = getattr(settings, "YOUTUBE_CLIENT_SECRET", "").strip()
        redirect_uri = getattr(settings, "YOUTUBE_REDIRECT_URI", "").strip()

        payload = {
            "code": code.strip(),
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.post(TOKEN_URL, data=payload)
            if res.status_code != 200:
                raise ValueError(f"Google OAuth Error: {res.text}")
            return res.json()

    @staticmethod
    async def refresh_access_token(refresh_token: str) -> Dict[str, Any]:
        """Dùng refresh_token vĩnh viễn để tự động cấp mới access_token."""
        client_id = getattr(settings, "YOUTUBE_CLIENT_ID", "").strip()
        client_secret = getattr(settings, "YOUTUBE_CLIENT_SECRET", "").strip()

        payload = {
            "refresh_token": refresh_token.strip(),
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "refresh_token",
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.post(TOKEN_URL, data=payload)
            if res.status_code != 200:
                raise ValueError(f"Google Refresh Error: {res.text}")
            return res.json()

    @staticmethod
    async def get_my_channel(access_token: str) -> Dict[str, Any]:
        """Lấy thông tin kênh YouTube chính chủ (Tên kênh, Avatar, Số người đăng ký)."""
        headers = {"Authorization": f"Bearer {access_token.strip()}"}
        url = f"{API_BASE}/channels?part=snippet,statistics&mine=true"

        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.get(url, headers=headers)
            if res.status_code != 200:
                raise ValueError(f"Lỗi lấy thông tin kênh YouTube: {res.text}")
            data = res.json()
            items = data.get("items", [])
            if not items:
                raise ValueError("Không tìm thấy kênh YouTube nào gắn với tài khoản này.")

            ch = items[0]
            snippet = ch.get("snippet", {})
            stats = ch.get("statistics", {})
            thumbnails = snippet.get("thumbnails", {})
            avatar = thumbnails.get("default", {}).get("url") or thumbnails.get("medium", {}).get("url")

            return {
                "channel_id": ch.get("id"),
                "title": snippet.get("title", "Kênh YouTube"),
                "custom_url": snippet.get("customUrl"),
                "avatar_url": avatar,
                "subscriber_count": int(stats.get("subscriberCount", 0)),
                "video_count": int(stats.get("videoCount", 0)),
            }

    @staticmethod
    async def upload_shorts(
        access_token: str,
        video_path: str,
        title: str,
        description: str = "",
        tags: Optional[List[str]] = None,
        privacy_status: str = "public",
        video_type: str = "video",
    ) -> Dict[str, Any]:
        """
        Tải video lên YouTube qua Resumable Upload API.
        Hỗ trợ:
        - video_type="video": Video dài chuẩn (16:9, phim, review), KHÔNG gắn ép buộc #Shorts.
        - video_type="shorts": Video ngắn dọc (9:16 <= 60s), tự động gắn #Shorts.
        """
        p = Path(video_path)
        if not p.exists():
            raise FileNotFoundError(f"Không tìm thấy file video: {video_path}")

        file_size = p.stat().st_size
        clean_title = title.strip()
        clean_desc = description.strip()

        is_shorts = (video_type == "shorts")

        if is_shorts:
            if "#Shorts" not in clean_title and "#shorts" not in clean_title:
                clean_title = f"{clean_title} #Shorts"
            if "#Shorts" not in clean_desc and "#shorts" not in clean_desc:
                clean_desc = f"{clean_desc}\n\n#Shorts #Viral"
            default_tags = ["Shorts", "Viral", "Reels"]
        else:
            # Video thường/dài: Đảm bảo chuyển sang tỷ lệ 16:9 nếu file là video dọc
            # để YouTube không tự động ép biến thành Shorts
            from src.core.engines.youtube.video_aspect_converter import VideoAspectConverter
            video_path = VideoAspectConverter.ensure_horizontal_16_9(str(p))
            p = Path(video_path)
            file_size = p.stat().st_size
            default_tags = ["Review Phim", "Phim Hay", "Video"]

        clean_title = clean_title[:100]  # Giới hạn 100 ký tự của YouTube

        meta_payload = {
            "snippet": {
                "title": clean_title,
                "description": clean_desc,
                "tags": tags or default_tags,
                "categoryId": "22",  # People & Blogs / Film
            },
            "status": {
                "privacyStatus": privacy_status,
                "selfDeclaredMadeForKids": False,
            },
        }

        # Bước 1: Khởi tạo Resumable Upload Session
        init_url = f"{UPLOAD_BASE}/videos?uploadType=resumable&part=snippet,status"
        init_headers = {
            "Authorization": f"Bearer {access_token.strip()}",
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Type": "video/mp4",
            "X-Upload-Content-Length": str(file_size),
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            init_res = await client.post(init_url, headers=init_headers, json=meta_payload)
            if init_res.status_code != 200:
                raise ValueError(f"Lỗi khởi tạo upload YouTube: {init_res.text}")

            upload_url = init_res.headers.get("Location")
            if not upload_url:
                raise ValueError("Không nhận được Upload Location từ YouTube.")

            # Bước 2: Truyền stream video lên máy chủ YouTube
            with open(p, "rb") as f:
                video_data = f.read()

            upload_headers = {
                "Content-Type": "video/mp4",
                "Content-Length": str(file_size),
            }

            upload_res = await client.put(upload_url, headers=upload_headers, content=video_data, timeout=600.0)
            if upload_res.status_code not in [200, 201]:
                raise ValueError(f"Lỗi tải video lên YouTube: {upload_res.text}")

            result_data = upload_res.json()
            vid_id = str(result_data.get("id", ""))
            shorts_url = f"https://www.youtube.com/shorts/{vid_id}"
            watch_url = f"https://www.youtube.com/watch?v={vid_id}"

            return {
                "video_id": vid_id,
                "shorts_url": shorts_url,
                "watch_url": watch_url,
                "video_url": shorts_url if is_shorts else watch_url,
                "video_type": "shorts" if is_shorts else "video",
                "title": clean_title,
                "status": privacy_status,
            }

    @staticmethod
    async def get_channel_videos(
        access_token: str, channel_id: Optional[str] = None, max_results: int = 25
    ) -> List[Dict[str, Any]]:
        """Lấy danh sách video/Shorts của kênh qua playlist Uploads (tiết kiệm 98% quota)."""
        headers = {"Authorization": f"Bearer {access_token.strip()}"}
        uploads_id = None
        if channel_id and channel_id.startswith("UC"):
            uploads_id = "UU" + channel_id[2:]
        else:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(f"{API_BASE}/channels?part=contentDetails&mine=true", headers=headers)
                if res.status_code == 200:
                    items = res.json().get("items", [])
                    if items:
                        uploads_id = items[0].get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads")

        if not uploads_id:
            return []

        async with httpx.AsyncClient(timeout=20.0) as client:
            pl_url = f"{API_BASE}/playlistItems?part=snippet,contentDetails&playlistId={uploads_id}&maxResults={max_results}"
            pl_res = await client.get(pl_url, headers=headers)
            if pl_res.status_code != 200:
                logger.warning(f"Lỗi lấy playlist uploads YouTube: {pl_res.text}")
                return []

            pl_items = pl_res.json().get("items", [])
            vid_ids = [it.get("contentDetails", {}).get("videoId") for it in pl_items if it.get("contentDetails", {}).get("videoId")]
            if not vid_ids:
                return []

            v_url = f"{API_BASE}/videos?part=snippet,statistics,contentDetails&id={','.join(vid_ids)}"
            v_res = await client.get(v_url, headers=headers)
            stats_map = {}
            if v_res.status_code == 200:
                for v in v_res.json().get("items", []):
                    stats_map[v.get("id")] = v

            results = []
            for it in pl_items:
                vid_id = it.get("contentDetails", {}).get("videoId")
                if not vid_id:
                    continue
                snippet = it.get("snippet", {})
                v_detail = stats_map.get(vid_id, {})
                v_stats = v_detail.get("statistics", {})
                thumbs = snippet.get("thumbnails", {})
                thumb_url = thumbs.get("high", {}).get("url") or thumbs.get("medium", {}).get("url") or thumbs.get("default", {}).get("url")

                results.append({
                    "id": vid_id,
                    "title": snippet.get("title", "Video"),
                    "description": snippet.get("description", ""),
                    "thumbnail": thumb_url,
                    "published_at": snippet.get("publishedAt"),
                    "views": int(v_stats.get("viewCount", 0)),
                    "likes": int(v_stats.get("likeCount", 0)),
                    "comments": int(v_stats.get("commentCount", 0)),
                    "duration": v_detail.get("contentDetails", {}).get("duration", ""),
                    "shorts_url": f"https://www.youtube.com/shorts/{vid_id}",
                    "watch_url": f"https://www.youtube.com/watch?v={vid_id}",
                })
            return results

