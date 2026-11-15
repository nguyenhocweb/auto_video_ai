import { useQuery } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { AvailableVideo } from "../type/facebook.type";

export const useAvailableVideos = (enabled: boolean = true) => {
  return useQuery<AvailableVideo[], Error>({
    queryKey: ["facebook_available_videos"],
    queryFn: () => facebookService.getAvailableVideos(),
    enabled,
    staleTime: 60 * 1000,
  });
};

