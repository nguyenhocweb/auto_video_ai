import axiosClient from "@/src/core/api/axios-instance";
import { VoiceSynthesizePayload, AudioGenerationResponse } from "../type/voice.type";

export const synthesizeVoiceService = async (
  payload: VoiceSynthesizePayload
): Promise<AudioGenerationResponse> => {
  const response = await axiosClient.post<AudioGenerationResponse>(
    "/api/v1/creator/voice/synthesize",
    payload
  );
  return response.data;
};

