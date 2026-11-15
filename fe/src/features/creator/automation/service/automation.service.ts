import axiosClient from "@/src/core/api/axios-instance";
import {
  AutomationCampaign,
  AutomationCampaignCreatePayload,
  AutomationCampaignUpdatePayload,
  AutomationCampaignListResponse,
  AutomationLogListResponse,
  PostedVideoListResponse,
} from "../type/automation.type";

export const getCampaignsService = async (): Promise<AutomationCampaignListResponse> => {
  const response = await axiosClient.get<AutomationCampaignListResponse>(
    "/api/v1/creator/automation/campaigns"
  );
  return response.data;
};

export const createCampaignService = async (
  payload: AutomationCampaignCreatePayload
): Promise<AutomationCampaign> => {
  const response = await axiosClient.post<AutomationCampaign>(
    "/api/v1/creator/automation/campaigns",
    payload
  );
  return response.data;
};

export const updateCampaignService = async (
  campaignId: string,
  payload: AutomationCampaignUpdatePayload
): Promise<AutomationCampaign> => {
  const response = await axiosClient.put<AutomationCampaign>(
    `/api/v1/creator/automation/campaigns/${campaignId}`,
    payload
  );
  return response.data;
};

export const deleteCampaignService = async (
  campaignId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/creator/automation/campaigns/${campaignId}`
  );
  return response.data;
};

export const toggleCampaignActiveService = async (
  campaignId: string,
  isActive: boolean
): Promise<AutomationCampaign> => {
  const response = await axiosClient.patch<AutomationCampaign>(
    `/api/v1/creator/automation/campaigns/${campaignId}/toggle?is_active=${isActive}`
  );
  return response.data;
};

export const runCampaignNowService = async (
  campaignId: string
): Promise<{ success: boolean; total_posted: number; next_run_at: string; error?: string }> => {
  const response = await axiosClient.post<{
    success: boolean;
    total_posted: number;
    next_run_at: string;
    error?: string;
  }>(`/api/v1/creator/automation/campaigns/${campaignId}/run-now`);
  return response.data;
};

export const getAutomationLogsService = async (
  campaignId?: string
): Promise<AutomationLogListResponse> => {
  const url = campaignId
    ? `/api/v1/creator/automation/logs?campaign_id=${campaignId}&limit=50`
    : `/api/v1/creator/automation/logs?limit=50`;
  const response = await axiosClient.get<AutomationLogListResponse>(url);
  return response.data;
};

export const getPostedVideosService = async (): Promise<PostedVideoListResponse> => {
  const response = await axiosClient.get<PostedVideoListResponse>(
    "/api/v1/creator/automation/posted-videos?limit=100"
  );
  return response.data;
};

export const clearCampaignErrorService = async (
  campaignId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosClient.post<{ success: boolean; message: string }>(
    `/api/v1/creator/automation/campaigns/${campaignId}/clear-error`
  );
  return response.data;
};

