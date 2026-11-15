"use client";

import { useQuery } from "@tanstack/react-query";
import { getAutomationLogsService } from "../service/automation.service";
import { AutomationLogListResponse } from "../type/automation.type";

export const useGetAutomationLogs = (campaignId?: string) => {
  return useQuery<AutomationLogListResponse, Error>({
    queryKey: ["creator", "automation-logs", campaignId],
    queryFn: () => getAutomationLogsService(campaignId),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};

