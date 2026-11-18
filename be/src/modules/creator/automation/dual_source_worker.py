import os
import uuid
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, Optional

from src.core.config import settings
from src.core.engines.stitch.video_stitcher import VideoStitcher
from src.core.engines.douyin.extractor import DouyinExtractor
from src.modules.creator.automation.hook_pool_repo import HookPoolMongoRepository
from src.modules.creator.automation.executor import AutomationExecutor
from src.modules.creator.automation.executor_helpers import ExecutorHelpers

logger = logging.getLogger("dual_source_worker")


class DualSourceWorker:
    """Worker chuyên trách thu hoạch Kênh Hook (Nguồn 1) và ghép nối vào Kênh Body (Nguồn 2)."""

    def __init__(self, hook_repo: Optional[HookPoolMongoRepository] = None):
        self.hook_repo = hook_repo or HookPoolMongoRepository()

    async def harvest_hook_channel(self, campaign: Dict[str, Any]) -> int:
        """Quét Kênh 1 (Kênh Hook), tải video mới nhất, cắt đoạn đầu và nạp vào kho đệm."""
        dual_cfg = campaign.get("dual_source") or {}
        if not dual_cfg.get("enabled"):
            return 0

        hook_url = dual_cfg.get("hook_channel_url")
        if not hook_url:
            return 0

        campaign_id = str(campaign["id"])
        user_id = str(campaign.get("user_id", "default_user"))
        hook_duration = float(dual_cfg.get("hook_duration_sec") or 3.5)
        hook_channel_name = dual_cfg.get("hook_channel_name") or "Kênh Hook"

        logger.info(f"[{campaign.get('name')}] Đang quét Kênh Hook [{hook_channel_name}]...")
        try:
            crawled = await AutomationExecutor.crawl_channel_videos(hook_url, limit=8)
        except Exception as ex:
            logger.warning(f"Không thể cào Kênh Hook {hook_channel_name}: {ex}")
            return 0

        if not crawled:
            return 0

        crawled.sort(key=lambda x: x.get("created_timestamp", 0), reverse=True)
        harvested_count = 0

        for v in crawled:
            item_id = str(v.get("item_id", ""))
            if not item_id:
                continue

            already_saved = await self.hook_repo.is_hook_already_saved(campaign_id, item_id)
            if already_saved:
                continue

            video_url = v.get("video_url") or f"https://www.douyin.com/video/{item_id}"
            stream_url = v.get("clean_stream_url")
            if not stream_url:
                try:
                    info = await DouyinExtractor.extract_no_watermark_video(video_url)
                    stream_url = info.get("video_url")
                except Exception as ex:
                    logger.warning(f"Lỗi extract hook video {item_id}: {ex}")
                    continue

            if not stream_url:
                continue

            temp_hooks_dir = settings.TEMP_DIR / "hook_pool"
            temp_hooks_dir.mkdir(parents=True, exist_ok=True)
            raw_tmp_path = temp_hooks_dir / f"raw_hook_{item_id}_{uuid.uuid4().hex[:6]}.mp4"
            clipped_hook_path = temp_hooks_dir / f"hook_{campaign_id}_{item_id}.mp4"

            try:
                await asyncio.to_thread(ExecutorHelpers.download_stream_to_file, stream_url, str(raw_tmp_path))
                if not raw_tmp_path.exists() or raw_tmp_path.stat().st_size == 0:
                    continue

                await asyncio.to_thread(
                    VideoStitcher.extract_hook_clip,
                    raw_video_path=str(raw_tmp_path),
                    duration=hook_duration,
                    out_path=str(clipped_hook_path),
                    aspect_ratio=dual_cfg.get("aspect_ratio") or "9:16",
                )

                await self.hook_repo.save_hook({
                    "campaign_id": campaign_id,
                    "user_id": user_id,
                    "item_id": item_id,
                    "video_url": video_url,
                    "title": v.get("title") or f"Hook {item_id}",
                    "hook_path": str(clipped_hook_path),
                    "duration": hook_duration,
                })
                harvested_count += 1
                logger.info(f"Đã nạp thành công Hook [{item_id}] ({hook_duration}s) vào kho!")
                break
            except Exception as ex:
                logger.error(f"Lỗi xử lý cắt Hook clip {item_id}: {ex}")
            finally:
                if raw_tmp_path.exists():
                    try:
                        raw_tmp_path.unlink()
                    except Exception:
                        pass

        return harvested_count

    async def prepare_stitched_video(
        self,
        campaign: Dict[str, Any],
        body_video_path: str,
        body_item_id: str,
        bgm_file_path: Optional[str] = None,
    ) -> Optional[str]:
        """
        Lấy Hook từ kho đệm và ghép vào đầu video thân bài (Kênh 2).
        Trả về đường dẫn file đã ghép hoàn chỉnh, hoặc None nếu không thể ghép.
        """
        dual_cfg = campaign.get("dual_source") or {}
        if not dual_cfg.get("enabled"):
            return body_video_path

        campaign_id = str(campaign["id"])
        skip_sec = float(dual_cfg.get("body_skip_start_sec") or 3.0)
        audio_mode = dual_cfg.get("audio_mode") or "sequential"
        fallback_policy = dual_cfg.get("fallback_policy") or "reuse_oldest"

        hook_doc = await self.hook_repo.get_available_hook(campaign_id)
        if not hook_doc:
            logger.warning(
                f"[{campaign.get('name')}] Kho Hook hiện tại chưa có video mới! "
                f"Đang kích hoạt fallback: {fallback_policy}..."
            )
            hook_doc = await self.hook_repo.get_fallback_hook(campaign_id, policy=fallback_policy)

        if not hook_doc:
            if fallback_policy == "bypass":
                logger.info("Chính sách fallback là 'bypass': Tiến hành đăng video thân bài gốc.")
                return body_video_path
            logger.warning(f"Chính sách '{fallback_policy}': Không có Hook hợp lệ để ghép. Tạm hoãn video {body_item_id}.")
            return None

        hook_path = str(hook_doc.get("hook_path") or "")
        if not hook_path or not os.path.exists(hook_path):
            logger.warning(f"File Hook {hook_path} không tồn tại trên đĩa.")
            return body_video_path

        out_dir = settings.TEMP_DIR / "stitched_videos"
        out_dir.mkdir(parents=True, exist_ok=True)
        stitched_out = str(out_dir / f"stitched_{campaign_id}_{body_item_id}_{uuid.uuid4().hex[:6]}.mp4")

        try:
            logger.info(
                f"Tiến hành ghép: Hook [{hook_doc.get('item_id')}] + "
                f"Body [{body_item_id}] (Bỏ {skip_sec}s đầu) | Audio: {audio_mode}"
            )
            stitched_file = await asyncio.to_thread(
                VideoStitcher.stitch_hook_and_body,
                hook_path=hook_path,
                body_path=str(body_video_path),
                body_skip_sec=skip_sec,
                out_path=stitched_out,
                audio_mode=audio_mode,
                bgm_path=bgm_file_path,
                aspect_ratio=dual_cfg.get("aspect_ratio") or "9:16",
            )

            hook_id = str(hook_doc.get("id") or "")
            await self.hook_repo.mark_hook_used(hook_id, body_item_id)
            return stitched_file
        except Exception as ex:
            logger.error(f"Lỗi trong quá trình ghép nối video: {ex}")
            return body_video_path
