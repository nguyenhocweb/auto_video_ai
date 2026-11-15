import { useQuery } from "@tanstack/react-query";
import { youtubeService } from "../service/youtube.service";

export const useChannelVideos = (channelId: string | null | undefined, limit: number = 25) => {
  return useQuery({
    queryKey: ["youtube-channel-videos", channelId, limit],
    queryFn: () => {
      if (!channelId) return { total: 0, videos: [] };
      return youtubeService.getChannelVideos(channelId, limit);
    },
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
