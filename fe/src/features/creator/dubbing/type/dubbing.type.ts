export type DubbingMode = "vietsub" | "dubbing" | "both" | "download_only";

export type VoiceSource = "preset" | "profile";

export interface SubtitleSegment {
  id: number;
  start: number;
  end: number;
  duration: number;
  text_origin: string;
  text_translated: string;
}

export interface DubbingTranscribePayload {
  video_url: string;
  language?: string;
  model_size?: string;
}

export interface DubbingTranscribeResponse {
  video_url: string;
  total_segments: number;
  duration_total: number;
  segments: SubtitleSegment[];
}

export interface DubbingTranslatePayload {
  segments: SubtitleSegment[];
  source_lang?: string;
  target_lang?: string;
}

export interface DubbingTranslateResponse {
  segments: SubtitleSegment[];
}

export interface DubbingRenderPayload {
  video_url: string;
  segments: SubtitleSegment[];
  mode: DubbingMode;
  voice_source: VoiceSource;
  voice_preset: string;
  voice_profile_id?: string;
  bgm_volume: number;
  voice_volume: number;
  remove_subtitles?: boolean;
  font_size?: number;
}

export interface AutoDubbingFromUrlPayload {
  url: string;
  mode?: DubbingMode;
  voice_source?: VoiceSource;
  voice_preset?: string;
  voice_profile_id?: string;
  voice_name?: string;
  remove_subtitles?: boolean;
  font_size?: number;
  bgm_volume?: number;
  voice_volume?: number;
}

export interface DubbingJobResponse {
  id: string;
  user_id: string;
  title?: string;
  cover_url?: string;
  source_url?: string;
  video_url?: string;
  mode: DubbingMode;
  status: "pending" | "processing" | "completed" | "failed";
  progress_step?: string;
  progress_percent?: number;
  voice_source?: VoiceSource;
  voice_preset?: string;
  voice_profile_id?: string;
  voice_name?: string;
  bgm_volume?: number;
  voice_volume?: number;
  segments_count?: number;
  output_video_url?: string;
  cloudinary_url?: string;
  subtitle_srt_url?: string;
  subtitle_ass_url?: string;
  error_message?: string;
  remove_subtitles?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface DubbingHistoryItem extends DubbingJobResponse {}

export interface DubbingHistoryResponse {
  items: DubbingHistoryItem[];
  total: number;
  page: number;
  limit: number;
}
