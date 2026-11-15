export interface SlotRequirement {
  id: string;
  type: "image" | "video";
  duration?: number;
  description?: string;
}

export interface SliceVideoToTemplatePayload {
  video_url?: string;
  video_path?: string;
  slots: SlotRequirement[];
}

export interface SlicedAsset {
  slot_id: string;
  index: number;
  type: "image" | "video";
  file_name: string;
  download_url: string;
  timestamp: number;
  duration?: number;
}

export interface SliceVideoToTemplateResponse {
  success: boolean;
  job_id: string;
  video_info: {
    duration: number;
    fps: number;
    total_frames: number;
    width: number;
    height: number;
  };
  detected_scenes_count: number;
  total_slots: number;
  assets: SlicedAsset[];
  zip_download_url: string;
  message: string;
}

