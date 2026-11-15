"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveChannelService } from "../service/channel.saved.service";
import { SavedChannel, SavedChannelCreatePayload } from "../type/video.type";

export const useSaveChannel = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedChannel, Error, SavedChannelCreatePayload>({
    mutationFn: saveChannelService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creator", "saved-channels"] });
      toast.success(`Đã lưu kênh "${data.name}" vào Database cá nhân thành công!`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể lưu kênh vào database";
      toast.error(msg);
    },
  });
};

