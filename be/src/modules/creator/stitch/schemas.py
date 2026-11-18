from typing import List, Optional
from pydantic import BaseModel, Field


class ManualStitchRequest(BaseModel):
    hook_source: str = Field(..., min_length=2, description="Link Douyin/TikTok hoặc file cục bộ cho Nguồn 1 (Hook)")
    hook_duration: float = Field(default=3.5, ge=1.0, le=30.0, description="Số giây cắt ở đầu Nguồn 1 (0 -> hook_duration)")
    body_source: str = Field(..., min_length=2, description="Link Douyin/TikTok hoặc file cục bộ cho Nguồn 2 (Body)")
    body_skip_start: float = Field(default=3.0, ge=0.0, le=60.0, description="Số giây cắt bỏ ở đầu Nguồn 2")
    audio_mode: str = Field(default="sequential", description="Chế độ âm thanh: sequential | body_audio | hook_audio | bgm_override")
    aspect_ratio: str = Field(default="9:16", description="Tỷ lệ khung hình: '9:16' (Dọc) hoặc '16:9' (Ngang)")
    bgm_id: Optional[str] = Field(None, description="ID bài nhạc nền nếu chọn bgm_override")


class ManualStitchResponse(BaseModel):
    success: bool
    video_path: str
    filename: str
    preview_url: str
    duration: float
    hook_duration: float
    body_skip_sec: float
    audio_mode: str
    aspect_ratio: str = "9:16"
    message: str


class HookItemResponse(BaseModel):
    id: str
    campaign_id: str
    item_id: str
    video_url: str
    title: str
    hook_path: str
    duration: float
    status: str
    used_count: int
    created_at: str


class HookListResponse(BaseModel):
    total: int
    available_count: int
    used_count: int
    hooks: List[HookItemResponse]
