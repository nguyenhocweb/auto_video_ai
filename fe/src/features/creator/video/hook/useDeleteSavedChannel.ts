"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSavedChannelService } from "../service/channel.saved.service";

export const useDeleteSavedChannel = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (channelId: string) => deleteSavedChannelService(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator", "saved-channels"] });
      toast.success("Đã xóa kênh khỏi danh sách cá nhân thành công!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể xóa kênh này";
      toast.error(msg);
    },
  });
};

