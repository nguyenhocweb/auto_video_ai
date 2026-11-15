export interface VoiceClonePayload {
  text: string;
  ref_audio_path: string;
  ref_text?: string;
  speed?: number;
  num_step?: number;
  guidance_scale?: number;
}

export interface VoiceDesignPayload {
  text: string;
  instruct: string;
  speed?: number;
  num_step?: number;
  guidance_scale?: number;
}

export interface VoiceProfileCreatePayload {
  profile_name: string;
  ref_audio_path: string;
  ref_text?: string;
  description?: string;
  gender?: string;
}

export interface VoiceSynthesizePayload {
  profile_id_or_path: string;
  text: string;
  speed?: number;
  num_step?: number;
}

export interface AudioGenerationResponse {
  audio_path: string;
  audio_filename: string;
  duration_seconds: number;
  sample_rate: number;
  message: string;
  cloudinary_url?: string;
  mp3_stream_url?: string;
  process_time_seconds?: number;
}

export interface UploadSampleResponse {
  sample_path: string;
  sample_filename: string;
  sample_url: string;
  original_name: string;
  size_bytes: number;
}

export interface VoiceProfileItem {
  profile_id: string;
  profile_name: string;
  prompt_file_path?: string;
  created_at: string;
  gender?: string;
  usage_count?: number;
  is_preset?: boolean;
  is_owner?: boolean;
  owner_user_id?: string;
  cloudinary_url?: string;
  cloudinary_embedding_url?: string;
}

export interface VoiceProfilesListResponse {
  profiles: VoiceProfileItem[];
}

