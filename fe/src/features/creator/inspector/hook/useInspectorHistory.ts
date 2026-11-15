import { useQuery } from "@tanstack/react-query";
import { inspectorService } from "../service/inspector.service";
import { InspectorRecord } from "../type/inspector.type";

export const useInspectorHistory = (limit: number = 20) => {
  return useQuery<InspectorRecord[], Error>({
    queryKey: ["inspector_history", limit],
    queryFn: () => inspectorService.getHistory(limit),
    staleTime: 60 * 1000,
  });
};

