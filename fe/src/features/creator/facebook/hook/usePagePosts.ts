import { useQuery } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { FacebookPost } from "../type/facebook.type";

export const usePagePosts = (
  pageId: string | null,
  limit: number = 30,
  forceRefresh: boolean = false
) => {
  return useQuery<FacebookPost[], Error>({
    queryKey: ["facebook_page_posts", pageId, limit, forceRefresh],
    queryFn: () => {
      if (!pageId) return Promise.resolve([]);
      return facebookService.getPagePosts(pageId, limit, forceRefresh);
    },
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
