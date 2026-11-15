import axiosClient from "@/src/core/api/axios-instance";
import {
  GroqKeyListResponse,
  GroqKeyItem,
  CreateGroqKeyPayload,
  ToggleGroqKeyResponse,
  GroqKeyTestPayload,
  GroqKeyTestResponse,
} from "../type/groq-key.type";

export const groqKeyService = {
  async getKeys(): Promise<GroqKeyListResponse> {
    const res = await axiosClient.get<GroqKeyListResponse>(
      "/api/v1/creator/dubbing/groq-keys"
    );
    return res.data;
  },

  async addKey(payload: CreateGroqKeyPayload): Promise<GroqKeyItem> {
    const res = await axiosClient.post<GroqKeyItem>(
      "/api/v1/creator/dubbing/groq-keys",
      payload
    );
    return res.data;
  },

  async testKey(payload: GroqKeyTestPayload): Promise<GroqKeyTestResponse> {
    const res = await axiosClient.post<GroqKeyTestResponse>(
      "/api/v1/creator/dubbing/groq-keys/test",
      payload
    );
    return res.data;
  },

  async updateKeyModel(keyId: string, model: string): Promise<GroqKeyItem> {
    const res = await axiosClient.patch<GroqKeyItem>(
      `/api/v1/creator/dubbing/groq-keys/${keyId}/model`,
      { model }
    );
    return res.data;
  },

  async deleteKey(keyId: string): Promise<{ success: boolean; message: string }> {
    const res = await axiosClient.delete<{ success: boolean; message: string }>(
      `/api/v1/creator/dubbing/groq-keys/${keyId}`
    );
    return res.data;
  },

  async toggleKey(keyId: string): Promise<ToggleGroqKeyResponse> {
    const res = await axiosClient.patch<ToggleGroqKeyResponse>(
      `/api/v1/creator/dubbing/groq-keys/${keyId}/toggle`
    );
    return res.data;
  },
};

