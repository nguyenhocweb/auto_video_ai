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
};
