import json
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any
from src.core.config import settings

logger = logging.getLogger("video_aspect_converter")


class VideoAspectConverter:
    """Tiện ích kiểm tra và chuyển đổi video dọc (9:16) sang chuẩn 16:9 ngang cho YouTube Video dài."""

    @staticmethod
    def get_video_dimensions(video_path: str) -> Dict[str, Any]:
        """Lấy kích thước và thời lượng video bằng ffprobe."""
        try:
            cmd = [
                "ffprobe", "-v", "error", "-select_streams", "v:0",
                "-show_entries", "stream=width,height,duration",
                "-of", "json", video_path,
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            if res.returncode == 0:
                data = json.loads(res.stdout)
                streams = data.get("streams", [])
                if streams:
                    w = int(streams[0].get("width") or 0)
                    h = int(streams[0].get("height") or 0)
                    dur = float(streams[0].get("duration") or 0.0)
                    return {"width": w, "height": h, "duration": dur, "is_vertical": (w <= h)}
        except Exception as ex:
            logger.warning(f"Lỗi đọc metadata video bằng ffprobe: {ex}")
        return {"width": 0, "height": 0, "duration": 0.0, "is_vertical": False}

    @classmethod
    def ensure_horizontal_16_9(cls, video_path: str) -> str:
        """
        Nếu video là video dọc hoặc vuông (width <= height), chuyển đổi sang khung hình 16:9 (1920x1080)
        với hiệu ứng nền mờ (Blurred Background) điện ảnh 2 bên.
        Điều này đảm bảo 100% YouTube nhận diện là Video Dài/Thường, không bị biến thành Shorts.
        """
        p = Path(video_path)
        if not p.exists():
            return video_path

        info = cls.get_video_dimensions(video_path)
        w, h = info["width"], info["height"]

        # Nếu đã là video ngang chuẩn (chiều rộng lớn hơn chiều cao rõ rệt), giữ nguyên
        if w > 0 and h > 0 and (w / h) >= 1.4:
            logger.info(f"Video {p.name} đã là video ngang ({w}x{h}). Không cần chuyển đổi.")
            return video_path

        temp_dir = settings.TEMP_DIR / "youtube_converted"
        temp_dir.mkdir(parents=True, exist_ok=True)
        output_path = temp_dir / f"h169_{p.stem}.mp4"

        logger.info(f"Đang chuyển đổi video dọc {p.name} ({w}x{h}) sang 16:9 ngang (1920x1080)...")
        cmd = [
            "ffmpeg", "-y", "-i", str(p),
            "-filter_complex",
            "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=25:25[bg];"
            "[0:v]scale=-1:1080[fg];"
            "[bg][fg]overlay=(W-w)/2:(H-h)/2[v]",
            "-map", "[v]", "-map", "0:a?",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-c:a", "copy",
            str(output_path),
        ]

        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            if res.returncode == 0 and output_path.exists() and output_path.stat().st_size > 0:
                logger.info(f"Chuyển đổi 16:9 thành công: {output_path.name}")
                return str(output_path)
            logger.warning(f"FFmpeg chuyển 16:9 thất bại: {res.stderr[:300]}. Sử dụng file gốc.")
        except Exception as ex:
            logger.error(f"Lỗi khi thực thi FFmpeg chuyển 16:9: {ex}")

        return video_path
