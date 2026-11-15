"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleCampaignActiveService } from "../service/automation.service";
import { AutomationCampaign } from "../type/automation.type";

interface ToggleParams {
  campaignId: string;
  isActive: boolean;
}

export const useToggleCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<AutomationCampaign, Error, ToggleParams>({
    mutationFn: ({ campaignId, isActive }) =>
      toggleCampaignActiveService(campaignId, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
      if (data.is_active) {
        toast.success(`Đã BẬT tự động hóa cho "${data.name}"`);
      } else {
        toast.info(`Đã TẠM DỪNG tự động hóa cho "${data.name}"`);
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể chuyển trạng thái";
      toast.error(msg);
    },
  });
};

