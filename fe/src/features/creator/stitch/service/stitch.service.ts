import axiosClient from "@/src/core/api/axios-instance";
import {
  ManualStitchPayload,
  ManualStitchResult,
  HookInventoryResponse,
} from "../type/stitch.type";

export const stitchService = {
  async manualStitch(payload: ManualStitchPayload): Promise<ManualStitchResult> {
    const res = await axiosClient.post<ManualStitchResult>(
      "/api/v1/creator/stitch/manual",
      payload
    );
    return res.data;
  },

  async getHooks(campaignId?: string): Promise<HookInventoryResponse> {
    const res = await axiosClient.get<HookInventoryResponse>(
      "/api/v1/creator/stitch/hooks",
      {
        params: campaignId ? { campaign_id: campaignId } : {},
      }
    );
    return res.data;
  },

  async deleteHook(hookId: string): Promise<{ success: boolean; message: string }> {
    const res = await axiosClient.delete<{ success: boolean; message: string }>(
      `/api/v1/creator/stitch/hooks/${hookId}`
    );
    return res.data;
  },

  async uploadMedia(
    file: File
  ): Promise<{ success: boolean; file_path: string; filename: string; duration: number; size_mb: number }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosClient.post<{
      success: boolean;
      file_path: string;
      filename: string;
      duration: number;
      size_mb: number;
    }>("/api/v1/creator/stitch/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async getTestSamples(): Promise<{
    success: boolean;
    hook_sample: string;
    body_sample: string;
    hook_title: string;
    body_title: string;
  }> {
    const res = await axiosClient.get<{
      success: boolean;
      hook_sample: string;
      body_sample: string;
      hook_title: string;
      body_title: string;
    }>("/api/v1/creator/stitch/samples");
    return res.data;
  },
};
