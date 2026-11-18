import { useQuery } from "@tanstack/react-query";
import { tiktokService } from "../service/tiktok.service";

export const useTikTokChannelVideos = (channelId?: string) => {
  return useQuery({
    queryKey: ["tiktok-channel-videos", channelId],
    queryFn: () => {
      if (!channelId) {
        return Promise.resolve({ videos: [], has_more: false });
      }
      return tiktokService.getChannelVideos(channelId);
    },
    enabled: Boolean(channelId),
    staleTime: 60 * 1000,
  });
};
