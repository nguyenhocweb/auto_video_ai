export interface AudioRecordingItem {
  id: string;
  input_text: string;
  voice_name: string;
  voice_profile_id?: string;
  speed: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  audio_url?: string;
  duration_seconds?: number;
  process_time_seconds?: number;
  error_message?: string;
  created_at: string;
  is_owner: boolean;
}

export interface AudioRecordingsResponse {
  items: AudioRecordingItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AsyncSynthesizeResponse {
  success: boolean;
  generation_id: string;
  status: "PENDING" | "PROCESSING";
  queue_position: number;
  message: string;
}

