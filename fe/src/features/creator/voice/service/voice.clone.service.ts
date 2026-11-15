import axiosClient from "@/src/core/api/axios-instance";
import { VoiceClonePayload, AudioGenerationResponse } from "../type/voice.type";

export const cloneVoiceService = async (payload: VoiceClonePayload): Promise<AudioGenerationResponse> => {
  const response = await axiosClient.post<AudioGenerationResponse>(
    "/api/v1/creator/voice/clone",
    payload
  );
  return response.data;
};

