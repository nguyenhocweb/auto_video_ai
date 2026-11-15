import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { youtubeService } from "../service/youtube.service";

export const useUploadAndPublishShorts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => youtubeService.uploadAndPublishShorts(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(`Đã tải lên và xuất bản Shorts thành công: ${res.title || "Video mới"}`);
        queryClient.invalidateQueries({ queryKey: ["youtube-channel-videos"] });
        queryClient.invalidateQueries({ queryKey: ["youtube-channels"] });
      } else {
        toast.error(`Xuất bản thất bại: ${res.error || "Lỗi không xác định"}`);
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Lỗi tải video lên YouTube Shorts.";
      toast.error(msg);
    },
  });
};
