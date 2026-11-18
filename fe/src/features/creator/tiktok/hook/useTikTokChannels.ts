import { useQuery } from "@tanstack/react-query";
import { tiktokService } from "../service/tiktok.service";

export const useTikTokChannels = () => {
  return useQuery({
    queryKey: ["tiktok-channels"],
    queryFn: tiktokService.getChannels,
    staleTime: 60 * 1000,
  });
};
