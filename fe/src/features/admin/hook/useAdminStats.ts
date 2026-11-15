"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStatsService } from "../service/admin.stats.service";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStatsService(),
    staleTime: 60 * 1000,
  });
};

