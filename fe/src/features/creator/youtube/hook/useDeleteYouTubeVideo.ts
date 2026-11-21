"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { youtubeService } from "../service/youtube.service";
import { toast } from "sonner";

interface DeleteVideoParams {
  channelId: string;
  videoId: string;
  videoTitle?: string;
}

export const useDeleteYouTubeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, videoId }: DeleteVideoParams) =>
      youtubeService.deleteVideo(channelId, videoId),
    onSuccess: (data, variables) => {
      toast.success(
        `Đã xóa video "${variables.videoTitle || variables.videoId}" khỏi YouTube thành công! Dữ liệu đã được lưu vết chống cào lại.`
      );
      // Invalidate danh sách video của kênh để cập nhật giao diện
      queryClient.invalidateQueries({
        queryKey: ["youtube_videos", variables.channelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["youtube_channels"],
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Lỗi khi xóa video khỏi YouTube!";
      toast.error(msg);
    },
  });
};
