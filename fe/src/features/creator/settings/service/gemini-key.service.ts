import axiosClient from "@/src/core/api/axios-instance";
import {
  GeminiKeyListResponse,
  GeminiKeyItem,
  CreateGeminiKeyPayload,
  ToggleGeminiKeyResponse,
  GeminiKeyTestPayload,
  GeminiKeyTestResponse,
} from "../type/gemini-key.type";

export const geminiKeyService = {
  async getKeys(): Promise<GeminiKeyListResponse> {
    const res = await axiosClient.get<GeminiKeyListResponse>(
      "/api/v1/creator/dubbing/gemini-keys"
    );
    return res.data;
  },

  async addKey(payload: CreateGeminiKeyPayload): Promise<GeminiKeyItem> {
    const res = await axiosClient.post<GeminiKeyItem>(
      "/api/v1/creator/dubbing/gemini-keys",
      payload
    );
    return res.data;
  },

  async testKey(payload: GeminiKeyTestPayload): Promise<GeminiKeyTestResponse> {
    const res = await axiosClient.post<GeminiKeyTestResponse>(
      "/api/v1/creator/dubbing/gemini-keys/test",
      payload
    );
    return res.data;
  },

  async updateKeyModel(keyId: string, model: string): Promise<GeminiKeyItem> {
    const res = await axiosClient.patch<GeminiKeyItem>(
      `/api/v1/creator/dubbing/gemini-keys/${keyId}/model`,
      { model }
    );
    return res.data;
  },

  async deleteKey(keyId: string): Promise<{ success: boolean; message: string }> {
    const res = await axiosClient.delete<{ success: boolean; message: string }>(
      `/api/v1/creator/dubbing/gemini-keys/${keyId}`
    );
    return res.data;
  },

  async toggleKey(keyId: string): Promise<ToggleGeminiKeyResponse> {
    const res = await axiosClient.patch<ToggleGeminiKeyResponse>(
      `/api/v1/creator/dubbing/gemini-keys/${keyId}/toggle`
    );
    return res.data;
  },
};
