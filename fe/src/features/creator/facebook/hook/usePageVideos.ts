import { useQuery } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { FacebookVideo } from "../type/facebook.type";

export const usePageVideos = (
  pageId: string | null,
  limit: number = 30,
  forceRefresh: boolean = false
) => {
  return useQuery<FacebookVideo[], Error>({
    queryKey: ["facebook_page_videos", pageId, limit, forceRefresh],
    queryFn: () => {
      if (!pageId) return Promise.resolve([]);
      return facebookService.getPageVideos(pageId, limit, forceRefresh);
    },
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
