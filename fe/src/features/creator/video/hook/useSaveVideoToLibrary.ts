"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveVideoToLibraryService } from "../service/video.download.service";
import { VideoSavePayload, VideoRecordItem } from "../type/video.type";

export const useSaveVideoToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation<VideoRecordItem, Error, VideoSavePayload>({
    mutationFn: (payload: VideoSavePayload) => saveVideoToLibraryService(payload),
    onSuccess: () => {
      toast.success("Đã lưu video vào thư viện thành công!");
      queryClient.invalidateQueries({ queryKey: ["creator-downloaded-videos"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || "Không thể lưu video vào thư viện!";
      toast.error(msg);
    },
  });
};

