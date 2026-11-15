export interface GeminiModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
}

export const GEMINI_MODEL_OPTIONS: GeminiModelOption[] = [
  {
    id: "gemini-flash-latest",
    name: "Gemini Flash Latest",
    badge: "Chuẩn Mặc Định Google AI Studio",
    description: "Tự động trỏ đến bản Gemini Flash mới nhất và ổn định nhất của Google (Không bao giờ lỗi thời)",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    badge: "Khuyên dùng - Siêu tốc",
    description: "Model thế hệ mới nhất, tốc độ cực nhanh, dịch điện ảnh chuẩn xác",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    badge: "Thế hệ 2.0",
    description: "Tối ưu hóa đa ngữ cảnh, độ trễ cực thấp",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    badge: "Tiêu chuẩn ổn định",
    description: "Model phổ biến, hạn mức free dồi dào",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    badge: "Chuyên sâu",
    description: "Dành cho văn bản phức tạp, đối thoại kịch bản sâu sắc",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    badge: "Đỉnh cao",
    description: "Model mạnh nhất của Google cho suy luận phức tạp",
  },
];

export interface GeminiKeyItem {
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

export interface GeminiKeyListResponse {
  total: number;
  items: GeminiKeyItem[];
}

export interface CreateGeminiKeyPayload {
  key: string;
  note?: string;
  model?: string;
}

export interface ToggleGeminiKeyResponse {
  success: boolean;
  is_active: boolean;
  message: string;
}

export interface GeminiKeyTestPayload {
  key?: string;
  key_id?: string;
  model: string;
}

export interface GeminiKeyTestResponse {
  success: boolean;
  model: string;
  latency_ms: number;
  test_output?: string;
  error_code?: number;
  message: string;
}
