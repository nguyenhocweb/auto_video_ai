import axiosClient from "@/src/core/api/axios-instance";
import {
  VoiceProfileCreatePayload,
  VoiceProfilesListResponse,
} from "../type/voice.type";

export const createVoiceProfileService = async (payload: VoiceProfileCreatePayload) => {
  const response = await axiosClient.post("/api/v1/creator/voice/profile", payload);
  return response.data;
};

export const getVoiceProfilesService = async (): Promise<VoiceProfilesListResponse> => {
  const response = await axiosClient.get<VoiceProfilesListResponse>("/api/v1/creator/voice/profiles");
  return response.data;
};

export const deleteVoiceProfileService = async (profileId: string) => {
  const response = await axiosClient.delete(`/api/v1/creator/voice/profile/${profileId}`);
  return response.data;
};

