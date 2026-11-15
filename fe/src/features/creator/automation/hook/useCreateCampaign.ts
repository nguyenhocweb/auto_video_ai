"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCampaignService } from "../service/automation.service";
import { AutomationCampaign, AutomationCampaignCreatePayload } from "../type/automation.type";

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<AutomationCampaign, Error, AutomationCampaignCreatePayload>({
    mutationFn: createCampaignService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
      toast.success(`Đã thiết lập chiến dịch Automation "${data.name}" thành công!`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể tạo chiến dịch";
      toast.error(msg);
    },
  });
};

