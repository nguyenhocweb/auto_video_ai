import { useQuery } from "@tanstack/react-query";
import { youtubeService } from "../service/youtube.service";

export const useYouTubeChannel = () => {
  return useQuery({
    queryKey: ["youtube-channel"],
    queryFn: () => youtubeService.getChannelStatus(),
    staleTime: 60 * 1000,
  });
};

