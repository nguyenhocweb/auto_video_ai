import axiosClient from "@/src/core/api/axios-instance";
import {
  SavedChannel,
  SavedChannelCreatePayload,
  SavedChannelUpdatePayload,
  SavedChannelListResponse,
} from "../type/video.type";

export const getSavedChannelsService = async (): Promise<SavedChannelListResponse> => {
  const response = await axiosClient.get<SavedChannelListResponse>(
    "/api/v1/creator/video/channel/saved"
  );
  return response.data;
};

export const saveChannelService = async (
  payload: SavedChannelCreatePayload
): Promise<SavedChannel> => {
  const response = await axiosClient.post<SavedChannel>(
    "/api/v1/creator/video/channel/saved",
    payload
  );
  return response.data;
};

export const updateSavedChannelNameService = async (
  channelId: string,
  payload: SavedChannelUpdatePayload
): Promise<SavedChannel> => {
  const response = await axiosClient.patch<SavedChannel>(
    `/api/v1/creator/video/channel/saved/${channelId}`,
    payload
  );
  return response.data;
};

export const deleteSavedChannelService = async (
  channelId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/creator/video/channel/saved/${channelId}`
  );
  return response.data;
};

