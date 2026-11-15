export interface TrainingPromptItem {
  id: number;
  category: string;
  text: string;
  phonetic_focus: string;
  target_duration_sec: number;
}

export interface TrainingPromptsResponse {
  prompts: TrainingPromptItem[];
}

export interface TrainingJobItem {
  _id: string;
  voice_name: string;
  gender: string;
  status: string;
  total_samples: number;
  total_duration_seconds: number;
  target_epochs: number;
  current_epoch: number;
  current_loss: number | null;
  progress_percent: number;
  estimated_remaining_sec: number | null;
  device_used: string;
  cloudinary_model_url?: string;
}

export interface TrainingJobDetailResponse {
  job: TrainingJobItem;
  samples: Array<{
    _id: string;
    prompt_id: number;
    prompt_text: string;
    duration_seconds: number;
    cloudinary_url: string;
  }>;
}

export interface AudioQualityReport {
  snr_db: number;
  quality_score: number;
  quality_label: "STUDIO" | "ACCEPTABLE" | "NOISY" | "CLIPPED" | "REJECT_NOISY";
  recommendation: "PROCEED" | "AUTO_DENOISE" | "RETRY_RECORDING";
  is_clean: boolean;
  is_clipped: boolean;
  clip_percentage: number;
  spectral_flatness: number;
  rms_dbfs: number;
  duration_seconds: number;
  issues: string[];
}

