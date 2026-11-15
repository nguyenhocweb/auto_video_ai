import { useQuery } from "@tanstack/react-query";
import { youtubeService } from "../service/youtube.service";

export const useAvailableVideos = () => {
  return useQuery({
    queryKey: ["youtube-available-videos"],
    queryFn: () => youtubeService.getAvailableVideos(),
    staleTime: 60 * 1000,
  });
};

