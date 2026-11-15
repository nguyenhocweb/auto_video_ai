"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDownloadedVideoService } from "../service/video.download.service";

export const useDeleteDownloadedVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (id: string) => deleteDownloadedVideoService(id),
    onSuccess: () => {
      toast.success("Đã xóa video khỏi thư viện!");
      queryClient.invalidateQueries({ queryKey: ["creator-downloaded-videos"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || "Không thể xóa video!";
      toast.error(msg);
    },
  });
};

