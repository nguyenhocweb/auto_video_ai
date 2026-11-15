"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearCampaignErrorService } from "../service/automation.service";

export const useClearCampaignError = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (campaignId: string) => clearCampaignErrorService(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
      toast.success("Đã xóa cảnh báo lỗi.");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Lỗi khi xóa cảnh báo lỗi";
      toast.error(msg);
    },
  });
};

