export interface BgmTrack {
  id: string;
  user_id?: string;
  title: string;
  mood: "chill" | "upbeat" | "funny" | "asmr" | "cinematic" | "general" | string;
  duration: number;
  audio_url: string;
  cloudinary_public_id?: string;
  file_path?: string;
  is_preset: boolean;
  sanitized?: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BgmListResponse {
  items: BgmTrack[];
  total: number;
  moods: string[];
}

export interface BgmUploadPayload {
  file: File;
  title?: string;
  mood?: string;
  tags?: string;
  start_time?: number;
  end_time?: number;
  sanitize_audio?: boolean;
}

export interface CopyrightCheckResult {
  has_copyright: boolean;
  risk_level: "safe" | "warning" | "danger" | string;
  matched_title?: string;
  matched_artist?: string;
  matched_label?: string;
  confidence: number;
  duration: number;
  is_sanitized: boolean;
  details: string;
  recommendation: string;
}
