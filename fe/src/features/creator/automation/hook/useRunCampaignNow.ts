"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { runCampaignNowService } from "../service/automation.service";

export const useRunCampaignNow = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; total_posted: number; next_run_at: string; error?: string },
    Error,
    string
  >({
    mutationFn: (campaignId: string) => runCampaignNowService(campaignId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["creator", "automation-logs"] });
      if (res.success) {
        toast.success(
          `Đã hoàn thành lượt cào & đăng tự động! Số video đã đăng: ${res.total_posted}`
        );
      } else {
        toast.warning(res.error || "Lượt chạy hoàn tất nhưng có cảnh báo.");
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Lỗi khi kích hoạt chạy ngay";
      toast.error(msg);
    },
  });
};

