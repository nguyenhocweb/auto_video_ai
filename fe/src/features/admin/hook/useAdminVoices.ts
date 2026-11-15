"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminVoicesService, deleteAdminVoiceService } from "../service/admin.voices.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useAdminVoices = () => {
  return useQuery({
    queryKey: ["admin-voices"],
    queryFn: () => getAdminVoicesService(),
    staleTime: 60 * 1000,
  });
};

export const useAdminDeleteVoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (voiceId: string) => deleteAdminVoiceService(voiceId),
    onSuccess: () => {
      toast.success("Đã xóa model giọng nói khỏi hệ thống!");
      queryClient.invalidateQueries({ queryKey: ["admin-voices"] });
      queryClient.invalidateQueries({ queryKey: ["voice-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Không thể xóa model giọng nói!"));
    },
  });
};

