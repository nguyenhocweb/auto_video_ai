import axiosClient from "@/src/core/api/axios-instance";
import { VoiceDesignPayload, AudioGenerationResponse } from "../type/voice.type";

export const designVoiceService = async (payload: VoiceDesignPayload): Promise<AudioGenerationResponse> => {
  const response = await axiosClient.post<AudioGenerationResponse>(
    "/api/v1/creator/voice/design",
    payload
  );
  return response.data;
};

