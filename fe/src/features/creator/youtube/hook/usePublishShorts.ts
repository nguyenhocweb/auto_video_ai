import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { youtubeService } from "../service/youtube.service";
import { PublishShortsRequest } from "../type/youtube.type";

export const usePublishShorts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublishShortsRequest) => youtubeService.publishShorts(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(`Đã xuất bản Shorts thành công: ${res.title || "Video mới"}`);
        queryClient.invalidateQueries({ queryKey: ["youtube-channel-videos"] });
        queryClient.invalidateQueries({ queryKey: ["youtube-channels"] });
      } else {
        toast.error(`Xuất bản thất bại: ${res.error || "Lỗi không xác định"}`);
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Lỗi kết nối khi tải lên YouTube Shorts.";
      toast.error(msg);
    },
  });
};

