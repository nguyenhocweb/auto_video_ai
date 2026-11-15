"use client";

import { useQuery } from "@tanstack/react-query";
import { getCampaignsService } from "../service/automation.service";
import { AutomationCampaignListResponse } from "../type/automation.type";

export const useGetCampaigns = () => {
  return useQuery<AutomationCampaignListResponse, Error>({
    queryKey: ["creator", "automation-campaigns"],
    queryFn: getCampaignsService,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000, // Tự động làm mới mỗi 30s để cập nhật trạng thái cào/đăng
  });
};

