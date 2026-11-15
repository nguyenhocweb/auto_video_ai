"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSavedChannelNameService } from "../service/channel.saved.service";
import { SavedChannel, SavedChannelUpdatePayload } from "../type/video.type";

interface UpdateParams {
  channelId: string;
  payload: SavedChannelUpdatePayload;
}

export const useUpdateSavedChannel = () => {
  const queryClient = useQueryClient();

  return useMutation<SavedChannel, Error, UpdateParams>({
    mutationFn: ({ channelId, payload }) => updateSavedChannelNameService(channelId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creator", "saved-channels"] });
      toast.success(`Đã đổi tên kênh thành "${data.name}" thành công!`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || error?.message || "Không thể cập nhật tên kênh";
      toast.error(msg);
    },
  });
};

