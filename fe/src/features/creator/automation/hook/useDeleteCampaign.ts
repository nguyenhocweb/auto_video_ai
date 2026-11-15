"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCampaignService } from "../service/automation.service";

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (campaignId: string) => deleteCampaignService(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
      toast.success("Đã xóa chiến dịch Automation thành công!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể xóa chiến dịch";
      toast.error(msg);
    },
  });
};

