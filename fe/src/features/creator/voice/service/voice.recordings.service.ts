import axiosClient from "@/src/core/api/axios-instance";
import { VoiceSynthesizePayload } from "../type/voice.type";
import {
  AudioRecordingsResponse,
  AsyncSynthesizeResponse,
} from "../type/voice.recording.type";

export const synthesizeVoiceAsyncService = async (
  payload: VoiceSynthesizePayload,
  voiceName?: string
): Promise<AsyncSynthesizeResponse> => {
  const queryParam = voiceName ? `?voice_name=${encodeURIComponent(voiceName)}` : "";
  const res = await axiosClient.post<AsyncSynthesizeResponse>(
    `/api/v1/creator/voice/synthesize/async${queryParam}`,
    payload
  );
  return res.data;
};

export const getUserRecordingsService = async (
  page: number = 1,
  pageSize: number = 10
): Promise<AudioRecordingsResponse> => {
  const res = await axiosClient.get<AudioRecordingsResponse>(
    `/api/v1/creator/voice/recordings?page=${page}&page_size=${pageSize}`
  );
  return res.data;
};

export const deleteUserRecordingService = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/creator/voice/recordings/${id}`
  );
  return res.data;
};

