import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { youtubeService } from "../service/youtube.service";

export const useDisconnectYouTubeChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) => youtubeService.disconnectChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-channels"] });
      queryClient.invalidateQueries({ queryKey: ["youtube-channel"] });
      toast.success("Đã hủy liên kết Kênh YouTube thành công.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể hủy liên kết Kênh YouTube.";
      toast.error(msg);
    },
  });
};

