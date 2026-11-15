import { useQuery } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { FacebookPage } from "../type/facebook.type";

export const useFacebookPages = (forceRefresh: boolean = false) => {
  return useQuery<FacebookPage[], Error>({
    queryKey: ["facebook_pages", forceRefresh],
    queryFn: () => facebookService.getPages(forceRefresh),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
