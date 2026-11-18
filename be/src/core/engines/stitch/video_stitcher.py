import os
import subprocess
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger("video_stitcher")


class VideoStitcher:
    """Engine lõi xử lý cắt ghép 2 nguồn video (Hook + Body), hỗ trợ 9:16 / 16:9 và chuyển cảnh mượt mà xfade."""

    @staticmethod
    def get_media_duration(file_path: str) -> float:
        """Lấy tổng thời lượng (giây) của file media qua ffprobe."""
        try:
            cmd = [
                "ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "default=nw=1:nk=1", str(file_path),
            ]
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=10)
            return max(0.0, float(res.stdout.decode().strip()))
        except Exception as ex:
            logger.warning(f"Không thể lấy thời lượng file {file_path}: {ex}")
            return 0.0

    @staticmethod
    def has_audio_stream(file_path: str) -> bool:
        """Kiểm tra file video có track âm thanh hợp lệ hay không."""
        try:
            cmd = [
                "ffprobe", "-v", "error", "-select_streams", "a:0",
                "-show_entries", "stream=codec_type", "-of", "default=nw=1:nk=1", str(file_path),
            ]
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=8)
            return "audio" in res.stdout.decode().lower()
        except Exception:
            return True

    @staticmethod
    def extract_hook_clip(
        raw_video_path: str,
        duration: float,
        out_path: str,
        aspect_ratio: str = "9:16",
    ) -> str:
        """Cắt đoạn đầu (0 -> duration giây) và chuẩn hóa về tỷ lệ 9:16 (1080x1920) hoặc 16:9 (1920x1080)."""
        p_in = Path(raw_video_path)
        p_out = Path(out_path)
        p_out.parent.mkdir(parents=True, exist_ok=True)

        if not p_in.exists():
            raise FileNotFoundError(f"Không tìm thấy video nguồn Hook: {raw_video_path}")

        tw, th = (1920, 1080) if aspect_ratio == "16:9" else (1080, 1920)
        has_audio = VideoStitcher.has_audio_stream(raw_video_path)
        vf_filter = (
            f"scale={tw}:{th}:force_original_aspect_ratio=decrease,"
            f"pad={tw}:{th}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,fps=30"
        )

        cmd = ["ffmpeg", "-y", "-ss", "0", "-t", str(duration), "-i", str(p_in), "-vf", vf_filter]
        if has_audio:
            cmd.extend(["-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2"])
        else:
            cmd.extend(["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100", "-shortest"])

        cmd.extend([
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
            "-pix_fmt", "yuv420p", str(p_out),
        ])

        logger.info(f"Đang cắt Hook clip ({duration}s, {aspect_ratio}) sang: {out_path}")
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
        if res.returncode != 0:
            err_msg = res.stderr.decode("utf-8", errors="ignore")
            logger.error(f"FFmpeg extract hook failed: {err_msg}")
            raise RuntimeError(f"Lỗi cắt Hook clip: {err_msg[:250]}")

        return str(p_out)

    @staticmethod
    def stitch_hook_and_body(
        hook_path: str,
        body_path: str,
        body_skip_sec: float,
        out_path: str,
        audio_mode: str = "sequential",
        bgm_path: Optional[str] = None,
        bgm_volume: float = 0.9,
        aspect_ratio: str = "9:16",
        transition_duration: float = 0.45,
    ) -> str:
        """
        Ghép nối Hook (Đầu) và Body (Đuôi) bằng FFmpeg xfade (mờ dần video 1, hiện dần video 2).
        Hỗ trợ chuẩn 9:16 (1080x1920) hoặc 16:9 (1920x1080).
        """
        p_hook = Path(hook_path)
        p_body = Path(body_path)
        p_out = Path(out_path)
        p_out.parent.mkdir(parents=True, exist_ok=True)

        if not p_hook.exists():
            raise FileNotFoundError(f"Không tìm thấy file Hook: {hook_path}")
        if not p_body.exists():
            raise FileNotFoundError(f"Không tìm thấy file Body: {body_path}")

        tw, th = (1920, 1080) if aspect_ratio == "16:9" else (1080, 1920)
        hook_dur = VideoStitcher.get_media_duration(hook_path)
        has_hook_a = VideoStitcher.has_audio_stream(hook_path)
        has_body_a = VideoStitcher.has_audio_stream(body_path)

        # Tính toán offset chuyển cảnh: video 1 mờ dần và video 2 hiện lên
        trans_dur = min(transition_duration, max(0.2, hook_dur * 0.25))
        offset = max(0.1, round(hook_dur - trans_dur, 2))

        # 1. Chuẩn hóa 2 luồng video về cùng kích thước & fps
        vf_hook = (
            f"[0:v]fps=30,scale={tw}:{th}:force_original_aspect_ratio=decrease,"
            f"pad={tw}:{th}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1[v0];"
        )
        vf_body = (
            f"[1:v]trim=start={body_skip_sec},setpts=PTS-STARTPTS,fps=30,"
            f"scale={tw}:{th}:force_original_aspect_ratio=decrease,"
            f"pad={tw}:{th}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1[v1];"
        )
        # Chuyển cảnh xfade mượt mà: transition=fade (Crossfade / Dissolve)
        vf_transition = f"[v0][v1]xfade=transition=fade:duration={trans_dur}:offset={offset}[vout]"
        filter_parts = [vf_hook, vf_body, vf_transition]

        # 2. Xử lý các kịch bản Âm thanh
        inputs = ["-i", str(p_hook), "-i", str(p_body)]

        if audio_mode == "bgm_override" and bgm_path and Path(bgm_path).exists():
            inputs.extend(["-i", str(bgm_path)])
            af = (
                f";[2:a]aformat=channel_layouts=stereo:sample_rates=44100,"
                f"volume={bgm_volume},aloop=loop=-1:size=2e+09[aout]"
            )
            filter_parts.append(af)
        elif audio_mode == "body_audio" and has_body_a:
            af = ";[1:a]aformat=channel_layouts=stereo:sample_rates=44100[aout]"
            filter_parts.append(af)
        elif audio_mode == "hook_audio" and has_hook_a:
            af = ";[0:a]aformat=channel_layouts=stereo:sample_rates=44100,aloop=loop=-1:size=2e+09[aout]"
            filter_parts.append(af)
        else:
            # Chế độ sequential (Nối tiếp tự nhiên có hòa âm mềm acrossfade)
            if has_hook_a and has_body_a:
                af = (
                    f";[0:a]aformat=channel_layouts=stereo:sample_rates=44100[a0];"
                    f"[1:a]atrim=start={body_skip_sec},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo:sample_rates=44100[a1];"
                    f"[a0][a1]acrossfade=d={trans_dur}:curve1=exp:curve2=exp[aout]"
                )
            elif has_body_a:
                af = f";[1:a]atrim=start={body_skip_sec},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo:sample_rates=44100[aout]"
            elif has_hook_a:
                af = ";[0:a]aformat=channel_layouts=stereo:sample_rates=44100[aout]"
            else:
                af = ";anullsrc=channel_layout=stereo:sample_rate=44100[aout]"
            filter_parts.append(af)

        full_filter = "".join(filter_parts)

        cmd = [
            "ffmpeg", "-y", *inputs,
            "-filter_complex", full_filter,
            "-map", "[vout]", "-map", "[aout]",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
            "-shortest", str(p_out),
        ]

        logger.info(
            f"Đang render ghép xfade ({aspect_ratio}, trans={trans_dur}s @ {offset}s): "
            f"Hook [{p_hook.name}] + Body [{p_body.name}] -> [{p_out.name}]"
        )
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=240)
        if res.returncode != 0:
            err_msg = res.stderr.decode("utf-8", errors="ignore")
            logger.error(f"FFmpeg stitch failed: {err_msg}")
            raise RuntimeError(f"Lỗi ghép nối video: {err_msg[:250]}")

        return str(p_out)
