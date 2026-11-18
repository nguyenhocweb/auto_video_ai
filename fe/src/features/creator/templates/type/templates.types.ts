export interface SlotItem {
  slot_id: number;
  slot_type: "video" | "image" | "audio";
  title: string;
  description: string;
  start_time: number;
  duration: number;
  required: boolean;
}

export interface TemplateItem {
  template_id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  total_duration: number;
  width: number;
  height: number;
  fps: number;
  slots: SlotItem[];
  default_bgm?: string | null;
}

export interface TemplateListResponse {
  total: number;
  items: TemplateItem[];
}

export interface TemplateRenderResponse {
  success: boolean;
  template_id: string;
  filename: string;
  stream_url: string;
  download_url: string;
  duration: number;
  file_size_mb: number;
  elapsed_seconds: number;
  fps_rendered: number;
  encoder_used: string;
  beat_count: number;
  message: string;
}

export interface TemplateRenderPayload {
  template_id: string;
  video_file?: File | null;
  image_file?: File | null;
  audio_file?: File | null;
  slot_files?: Record<number, File | null>;
}

export interface ParsedSlotItem {
  slot_id: number;
  slot_type: "image" | "video";
  start_time: number;
  end_time: number;
  duration: number;
  description: string;
  is_replaceable: boolean;
  video_width?: number | null;
  video_height?: number | null;
}

export interface ParsedTemplateResult {
  success: boolean;
  template_id: string;
  title: string;
  author_name?: string;
  total_duration: number;
  total_slots: number;
  image_slots_count: number;
  video_slots_count: number;
  slots: ParsedSlotItem[];
  has_audio: boolean;
  music_title?: string | null;
  cover_url?: string | null;
  video_url?: string | null;
  template_url?: string | null;
  source_url?: string | null;
  is_saved_in_db?: boolean;
  message: string;
}

export interface SavedTemplateDbItem {
  id?: string;
  template_id: string;
  title: string;
  author_name: string;
  total_duration: number;
  total_slots: number;
  image_slots_count: number;
  video_slots_count: number;
  slots: ParsedSlotItem[];
  cover_url?: string | null;
  video_url?: string | null;
  template_url?: string | null;
  music_title?: string | null;
  source_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SavedTemplateDbListResponse {
  total: number;
  items: SavedTemplateDbItem[];
}

export interface CreateCapCutDesktopResponse {
  success: boolean;
  template_id: string;
  project_name: string;
  project_path: string;
  total_duration: number;
  slots_count: number;
  message: string;
}

export interface LaunchCapCutResponse {
  success: boolean;
  message: string;
}

