export type AudioMode = "sequential" | "body_audio" | "hook_audio" | "bgm_override";

export interface ManualStitchPayload {
  hook_source: string;
  hook_duration: number;
  body_source: string;
  body_skip_start: number;
  audio_mode: AudioMode;
  aspect_ratio?: "9:16" | "16:9";
  bgm_id?: string | null;
}

export interface ManualStitchResult {
  success: boolean;
  video_path: string;
  filename: string;
  preview_url: string;
  duration: number;
  hook_duration: number;
  body_skip_sec: number;
  audio_mode: AudioMode;
  aspect_ratio: "9:16" | "16:9";
  message: string;
}

export interface HookInventoryItem {
  id: string;
  campaign_id: string;
  item_id: string;
  video_url: string;
  title: string;
  hook_path: string;
  duration: number;
  status: "available" | "used" | "missing";
  used_count: number;
  created_at: string;
}

export interface HookInventoryResponse {
  total: number;
  available_count: number;
  used_count: number;
  hooks: HookInventoryItem[];
}
