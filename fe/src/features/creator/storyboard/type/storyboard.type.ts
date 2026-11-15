export interface SceneItem {
  scene_idx: number;
  narration: string;
  prompt_en: string;
  estimated_duration?: number;
  image_url?: string;
  image_path?: string;
  cleaned?: boolean;
}

export interface ScriptGeneratePayload {
  topic: string;
  art_style?: string;
  genre?: string;
  style?: string;
  scene_count: number;
}

export interface ScriptGenerateResponse {
  success: boolean;
  topic: string;
  art_style?: string;
  art_style_name?: string;
  genre?: string;
  genre_name?: string;
  style?: string;
  style_name?: string;
  scenes: SceneItem[];
  message: string;
}

export interface RenderStoryboardPayload {
  job_id?: string;
  topic: string;
  scenes: SceneItem[];
  voice_name?: string;
}

export interface RenderStoryboardResponse {
  success: boolean;
  job_id: string;
  video_url: string;
  video_path?: string;
  duration: number;
  scenes_count: number;
  message: string;
}

export interface PublishStoryboardPayload {
  job_id: string;
  platform: "youtube" | "facebook" | "tiktok";
  channel_id?: string;
  title: string;
  hashtags?: string;
  description?: string;
  privacy_status?: "public" | "unlisted" | "private";
}

export interface PublishStoryboardResponse {
  success: boolean;
  platform: string;
  channel_title?: string;
  post_url?: string;
  title: string;
  message: string;
}

export interface CleanWatermarkPayload {
  job_id: string;
  scene_idx: number;
  watermark_type?: string;
  custom_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface CleanWatermarkResponse {
  success: boolean;
  scene_idx: number;
  url: string;
  path: string;
  detected: boolean;
  message: string;
}

export interface BatchCleanPayload {
  job_id: string;
  scene_indices?: number[];
}

export interface BatchCleanResponse {
  success: boolean;
  cleaned_count: number;
  scenes: Array<{
    scene_idx: number;
    url: string;
    path: string;
    detected: boolean;
  }>;
  message: string;
}

export interface StoryboardVoiceOption {
  id: string;
  name: string;
  gender?: string;
  type: "preset" | "trained";
  is_finetuned?: boolean;
}

export interface StoryboardVoicesResponse {
  success: boolean;
  voices: StoryboardVoiceOption[];
}
