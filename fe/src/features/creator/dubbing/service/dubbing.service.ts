import axiosClient from "@/src/core/api/axios-instance";
import {
  DubbingTranscribePayload,
  DubbingTranscribeResponse,
  DubbingTranslatePayload,
  DubbingTranslateResponse,
  DubbingRenderPayload,
  AutoDubbingFromUrlPayload,
  DubbingJobResponse,
  DubbingHistoryResponse,
} from "../type/dubbing.type";

export const dubbingService = {
  async startAutoDubbing(payload: AutoDubbingFromUrlPayload): Promise<DubbingJobResponse> {
    const res = await axiosClient.post<DubbingJobResponse>(
      "/api/v1/creator/dubbing/auto-from-url",
      payload
    );
    return res.data;
  },

  async transcribeVideo(payload: DubbingTranscribePayload): Promise<DubbingTranscribeResponse> {
    const res = await axiosClient.post<DubbingTranscribeResponse>(
      "/api/v1/creator/dubbing/transcribe",
      payload
    );
    return res.data;
  },

  async translateSegments(payload: DubbingTranslatePayload): Promise<DubbingTranslateResponse> {
    const res = await axiosClient.post<DubbingTranslateResponse>(
      "/api/v1/creator/dubbing/translate",
      payload
    );
    return res.data;
  },

  async renderDubbingJob(payload: DubbingRenderPayload): Promise<DubbingJobResponse> {
    const res = await axiosClient.post<DubbingJobResponse>(
      "/api/v1/creator/dubbing/render",
      payload
    );
    return res.data;
  },

  async getDubbingHistory(page: number = 1, limit: number = 10): Promise<DubbingHistoryResponse> {
    const res = await axiosClient.get<DubbingHistoryResponse>(
      `/api/v1/creator/dubbing/history?page=${page}&limit=${limit}`,
      { timeout: 30000 }
    );
    return res.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await axiosClient.delete(`/api/v1/creator/dubbing/jobs/${jobId}`);
  },

  async retryJob(jobId: string): Promise<DubbingJobResponse> {
    const res = await axiosClient.post<DubbingJobResponse>(
      `/api/v1/creator/dubbing/jobs/${jobId}/retry`
    );
    return res.data;
  },

  async getUserVoiceProfiles(): Promise<Array<{ profile_id?: string; id?: string; profile_name: string; gender?: string }>> {
    const res = await axiosClient.get<any>("/api/v1/creator/voice/profiles");
    if (res.data && Array.isArray(res.data.profiles)) {
      return res.data.profiles;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async translateContent(title: string, caption: string): Promise<{ title: string; caption: string }> {
    const res = await axiosClient.post<{ title: string; caption: string }>(
      "/api/v1/creator/dubbing/translate-content",
      { title, caption }
    );
    return res.data;
  },
};
