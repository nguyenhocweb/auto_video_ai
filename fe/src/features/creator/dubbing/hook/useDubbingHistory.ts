import { useQuery } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";
import { DubbingHistoryResponse } from "../type/dubbing.type";

export const useDubbingHistory = (page: number = 1, limit: number = 10) => {
  return useQuery<DubbingHistoryResponse, Error>({
    queryKey: ["dubbing_history", page, limit],
    queryFn: () => dubbingService.getDubbingHistory(page, limit),
    staleTime: 0,
    retry: 2,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasActiveJobs = data?.items?.some(
        (item) => item.status === "pending" || item.status === "processing"
      );
      return hasActiveJobs ? 2000 : 6000;
    },
  });
};
