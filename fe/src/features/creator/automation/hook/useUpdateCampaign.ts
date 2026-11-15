"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCampaignService } from "../service/automation.service";
import { AutomationCampaign, AutomationCampaignUpdatePayload } from "../type/automation.type";

interface UpdateParams {
  campaignId: string;
  payload: AutomationCampaignUpdatePayload;
}

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<AutomationCampaign, Error, UpdateParams>({
    mutationFn: ({ campaignId, payload }) => updateCampaignService(campaignId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
      toast.success(`Đã cập nhật chiến dịch "${data.name}" thành công!`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể cập nhật chiến dịch";
      toast.error(msg);
    },
  });
};

