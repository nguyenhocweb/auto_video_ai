import axiosClient from "@/src/core/api/axios-instance";
import {
  FacebookPage,
  FacebookVideo,
  FacebookPost,
  AvailableVideo,
  PublishReelPayload,
  PublishReelResponse,
  FacebookTokenStatus,
  UpdateTokenPayload,
  UpdateTokenResponse,
} from "../type/facebook.type";

export const facebookService = {
  async getTokenStatus(): Promise<FacebookTokenStatus> {
    const res = await axiosClient.get<FacebookTokenStatus>("/api/v1/creator/facebook/token-status");
    return res.data;
  },

  async updateToken(payload: UpdateTokenPayload): Promise<UpdateTokenResponse> {
    const res = await axiosClient.post<UpdateTokenResponse>(
      "/api/v1/creator/facebook/token",
      payload
    );
    return res.data;
  },

  async getPages(forceRefresh: boolean = false): Promise<FacebookPage[]> {
    const res = await axiosClient.get<FacebookPage[]>("/api/v1/creator/facebook/pages", {
      params: { force_refresh: forceRefresh },
    });
    return res.data;
  },

  async getPageVideos(
    pageId: string,
    limit: number = 25,
    forceRefresh: boolean = false
  ): Promise<FacebookVideo[]> {
    const res = await axiosClient.get<FacebookVideo[]>(
      `/api/v1/creator/facebook/pages/${pageId}/videos`,
      {
        params: { limit, force_refresh: forceRefresh },
      }
    );
    return res.data;
  },

  async getPagePosts(
    pageId: string,
    limit: number = 25,
    forceRefresh: boolean = false
  ): Promise<FacebookPost[]> {
    const res = await axiosClient.get<FacebookPost[]>(
      `/api/v1/creator/facebook/pages/${pageId}/posts`,
      {
        params: { limit, force_refresh: forceRefresh },
      }
    );
    return res.data;
  },

  async getAvailableVideos(): Promise<AvailableVideo[]> {
    const res = await axiosClient.get<AvailableVideo[]>(
      "/api/v1/creator/facebook/available-videos"
    );
    return res.data;
  },

  async publishReel(payload: PublishReelPayload): Promise<PublishReelResponse> {
    const res = await axiosClient.post<PublishReelResponse>(
      "/api/v1/creator/facebook/publish-reel",
      payload
    );
    return res.data;
  },

  async uploadAndPublishReel(formData: FormData): Promise<PublishReelResponse> {
    const res = await axiosClient.post<PublishReelResponse>(
      "/api/v1/creator/facebook/upload-and-publish-reel",
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
