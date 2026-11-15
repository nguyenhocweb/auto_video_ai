import { useQuery } from "@tanstack/react-query";
import { youtubeService } from "../service/youtube.service";

export const useYouTubeChannels = () => {
  return useQuery({
    queryKey: ["youtube-channels"],
    queryFn: () => youtubeService.getChannels(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
