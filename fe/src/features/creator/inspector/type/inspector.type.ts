export interface FaceAnalysis {
  face_count: number;
  face_ratio_percent: number;
  face_boxes: number[][];
  score: number;
}

export interface VisualAnalysis {
  brightness: number;
  saturation: number;
  contrast_std: number;
  sharpness: number;
  contrast_score: number;
  color_pop_score: number;
  is_sharp: boolean;
}

export interface TextAnalysis {
  has_text: boolean;
  detected_texts: string[];
  text_count?: number;
  text_ratio_percent: number;
  score: number;
}

export interface SkinSafety {
  is_safe: boolean;
  skin_ratio: number;
  skin_percent?: number;
  warning?: string;
}

export interface ImageInspectResponse {
  overall_viral_score: number;
  rating: string;
  face_analysis: FaceAnalysis;
  visual_analysis: VisualAnalysis;
  text_analysis: TextAnalysis;
  skin_safety: SkinSafety;
  actionable_advice: string[];
}

export interface TextPolicyViolation {
  word: string;
  category: string;
  level: "high" | "medium" | "warning" | string;
  start: number;
  end: number;
  replacement: string;
}

export interface TextPolicyInspectResponse {
  is_safe: boolean;
  safety_score: number;
  total_violations: number;
  violations: TextPolicyViolation[];
  rewritten_text: string;
  summary: string;
}

export interface VideoSceneCut {
  frame_index: number;
  timestamp_seconds: number;
  diff_score: number;
}

export interface VideoInspectResponse {
  pacing_score: number;
  pacing_rating: string;
  total_duration_sec: number;
  scene_cuts_count: number;
  avg_shot_length_sec: number;
  hook_3s_cuts: number;
  scene_cuts: VideoSceneCut[];
  advice: string[];
}

export interface InspectorRecord {
  id?: string;
  user_id: string;
  type: "image" | "text_policy" | "video_pacing";
  score: number;
  summary: string;
  details: any;
  created_at: string;
  updated_at: string;
}

export interface InspectorHistoryResponse {
  items: InspectorRecord[];
  total: number;
  page?: number;
  limit?: number;
}

