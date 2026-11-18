import axiosClient from "@/src/core/api/axios-instance";
import {
  TikTokAuthUrlResponse,
  TikTokChannelListResponse,
  PublishTikTokRequest,
  PublishTikTokResponse,
  TikTokVideoListResponse,
} from "../type/tiktok.type";

export const tiktokService = {
  getAuthUrl: async (scope?: string): Promise<TikTokAuthUrlResponse> => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const params: Record<string, string> = {};
    if (scope) params.scope = scope;
    if (origin) params.fe_origin = origin;
    const res = await axiosClient.get<TikTokAuthUrlResponse>(
      "/api/v1/creator/tiktok/auth-url",
      { params }
    );
    return res.data;
  },

  getChannels: async (): Promise<TikTokChannelListResponse> => {
    const res = await axiosClient.get<TikTokChannelListResponse>(
      "/api/v1/creator/tiktok/channels"
    );
    return res.data;
  },

  getChannelVideos: async (
    channelId: string
  ): Promise<TikTokVideoListResponse> => {
    const res = await axiosClient.get<TikTokVideoListResponse>(
      `/api/v1/creator/tiktok/channels/${channelId}/videos`
    );
    return res.data;
  },

  disconnectChannel: async (
    channelId: string
  ): Promise<{ status: string; message: string }> => {
    const res = await axiosClient.delete<{ status: string; message: string }>(
      `/api/v1/creator/tiktok/channels/${channelId}`
    );
    return res.data;
  },

  publishVideo: async (
    req: PublishTikTokRequest
  ): Promise<PublishTikTokResponse> => {
    const formData = new FormData();
    formData.append("channel_id", req.channel_id);
    formData.append("title", req.title);
    if (req.privacy_level) {
      formData.append("privacy_level", req.privacy_level);
    }
    formData.append("disable_duet", String(Boolean(req.disable_duet)));
    formData.append("disable_comment", String(Boolean(req.disable_comment)));
    formData.append("disable_stitch", String(Boolean(req.disable_stitch)));
    if (req.video_cover_timestamp_ms) {
      formData.append(
        "video_cover_timestamp_ms",
        String(req.video_cover_timestamp_ms)
      );
    }
    if (req.video_url) {
      formData.append("video_url", req.video_url);
    }
    if (req.file) {
      formData.append("file", req.file);
    }

    const res = await axiosClient.post<PublishTikTokResponse>(
      "/api/v1/creator/tiktok/publish",
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
