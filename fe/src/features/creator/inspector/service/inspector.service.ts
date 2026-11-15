import axiosClient from "@/src/core/api/axios-instance";
import {
  ImageInspectResponse,
  TextPolicyInspectResponse,
  VideoInspectResponse,
  InspectorRecord,
} from "../type/inspector.type";

export const inspectorService = {
  /**
   * Upload file ảnh từ máy hoặc từ Clipboard để phân tích Viral & Vi phạm.
   */
  async uploadAndAnalyzeImage(file: File): Promise<ImageInspectResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosClient.post<ImageInspectResponse>(
      "/api/v1/creator/inspector/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  /**
   * Phân tích ảnh qua Base64 hoặc Image URL.
   */
  async analyzeImagePayload(payload: {
    image_base64?: string;
    image_url?: string;
  }): Promise<ImageInspectResponse> {
    const res = await axiosClient.post<ImageInspectResponse>(
      "/api/v1/creator/inspector/analyze-image",
      payload
    );
    return res.data;
  },

  /**
   * Kiểm tra từ cấm và vi phạm chính sách trong kịch bản / phụ đề.
   */
  async analyzeTextPolicy(text: string): Promise<TextPolicyInspectResponse> {
    const res = await axiosClient.post<TextPolicyInspectResponse>(
      "/api/v1/creator/inspector/analyze-text",
      { text }
    );
    return res.data;
  },

  /**
   * Phân tích nhịp độ cắt cảnh & hook 3s giữ chân của video.
   */
  async analyzeVideoPacing(payload: {
    video_url?: string;
    job_id?: string;
  }): Promise<VideoInspectResponse> {
    const res = await axiosClient.post<VideoInspectResponse>(
      "/api/v1/creator/inspector/analyze-video",
      payload
    );
    return res.data;
  },

  /**
   * Lấy lịch sử các lần thẩm định của người dùng.
   */
  async getHistory(limit: number = 20): Promise<InspectorRecord[]> {
    const res = await axiosClient.get<InspectorRecord[]>(
      `/api/v1/creator/inspector/history?limit=${limit}`
    );
    return res.data;
  },
};

