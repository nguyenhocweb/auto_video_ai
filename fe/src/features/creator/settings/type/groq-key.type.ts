export interface GroqModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
}

export const GROQ_MODEL_OPTIONS: GroqModelOption[] = [
  {
    id: "qwen/qwen3.8-27b",
    name: "Qwen 3.8 27B (Alibaba Cloud)",
    badge: "Khuyên Dùng - Tốt Nhất Cho Phim",
    description: "Mô hình dịch Trung -> Việt số 1 thế giới của Alibaba, siêu tốc ~0.5s trên Groq LPU",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "OpenAI GPT-OSS 120B",
    badge: "Model Siêu Lớn 120B",
    description: "Mô hình mã nguồn mở thế hệ mới 120B của OpenAI tăng tốc trên Groq",
  },
  {
    id: "openai/gpt-oss-20b",
    name: "OpenAI GPT-OSS 20B",
    badge: "Siêu Tốc ~500 tokens/s",
    description: "Mô hình 20B cực nhanh cho xử lý phụ đề số lượng lớn",
  },
  {
    id: "allam-2-7b",
    name: "Allam 2 7B",
    badge: "Gọn Nhẹ",
    description: "Mô hình 7B phản hồi tức thì, tiết kiệm tài nguyên",
  },
];

export interface GroqKeyItem {
  id: string;
  key_masked: string;
  note: string;
  model: string;
  is_active: boolean;
  usage_count: number;
  error_count: number;
  last_used_at: string | null;
  created_at: string;
}

export interface GroqKeyListResponse {
  total: number;
  items: GroqKeyItem[];
}

export interface CreateGroqKeyPayload {
  key: string;
  note?: string;
  model?: string;
}

export interface ToggleGroqKeyResponse {
  success: boolean;
  is_active: boolean;
  message: string;
}

export interface GroqKeyTestPayload {
  key?: string;
  key_id?: string;
  model: string;
}

export interface GroqKeyTestResponse {
  success: boolean;
  model: string;
  latency_ms: number;
  test_output?: string;
  error_code?: number;
  message: string;
}

