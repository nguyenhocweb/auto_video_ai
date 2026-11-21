import axiosClient from "@/src/core/api/axios-instance";
import {
  YouTubeChannelListResponse,
  YouTubeChannelResponse,
  YouTubeAuthUrlResponse,
  YouTubeVideoListResponse,
  AvailableVideo,
  PublishShortsRequest,
  PublishShortsResponse,
  DeleteYouTubeVideoResponse,
} from "../type/youtube.type";

export const youtubeService = {
  async getAuthUrl(): Promise<YouTubeAuthUrlResponse> {
    const res = await axiosClient.get<YouTubeAuthUrlResponse>(
      "/api/v1/creator/youtube/auth-url"
    );
    return res.data;
  },

  async getChannels(): Promise<YouTubeChannelListResponse> {
    const res = await axiosClient.get<YouTubeChannelListResponse>(
      "/api/v1/creator/youtube/channels"
    );
    return res.data;
  },

  async getChannelVideos(channelId: string, limit: number = 25): Promise<YouTubeVideoListResponse> {
    const res = await axiosClient.get<YouTubeVideoListResponse>(
      `/api/v1/creator/youtube/channels/${channelId}/videos?limit=${limit}`
    );
    return res.data;
  },

  async getAvailableVideos(): Promise<AvailableVideo[]> {
    const res = await axiosClient.get<AvailableVideo[]>(
      "/api/v1/creator/youtube/available-videos"
    );
    return res.data;
  },

  async getChannelStatus(): Promise<YouTubeChannelResponse> {
    const res = await axiosClient.get<YouTubeChannelResponse>(
      "/api/v1/creator/youtube/channel"
    );
    return res.data;
  },

  async disconnectChannel(channelId: string): Promise<{ success: boolean; message: string }> {
    const res = await axiosClient.delete<{ success: boolean; message: string }>(
      `/api/v1/creator/youtube/channels/${channelId}`
    );
    return res.data;
  },

  async deleteVideo(
    channelId: string,
    videoId: string
  ): Promise<DeleteYouTubeVideoResponse> {
    const res = await axiosClient.delete<DeleteYouTubeVideoResponse>(
      `/api/v1/creator/youtube/channels/${channelId}/videos/${videoId}`
    );
    return res.data;
  },

  async disconnectAll(): Promise<{ success: boolean; message: string }> {
    const res = await axiosClient.delete<{ success: boolean; message: string }>(
      "/api/v1/creator/youtube/disconnect"
    );
    return res.data;
  },

  async publishShorts(payload: PublishShortsRequest): Promise<PublishShortsResponse> {
    const res = await axiosClient.post<PublishShortsResponse>(
      "/api/v1/creator/youtube/publish",
      payload
    );
    return res.data;
  },

  async uploadAndPublishShorts(formData: FormData): Promise<PublishShortsResponse> {
    const res = await axiosClient.post<PublishShortsResponse>(
      "/api/v1/creator/youtube/upload-and-publish",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },
};
