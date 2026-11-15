import { useQuery } from "@tanstack/react-query";
import { douyinSessionService } from "../service/douyin-session.service";
import { DouyinSessionStatus } from "../type/douyin-session.type";

export const useDouyinStatus = () => {
  return useQuery<DouyinSessionStatus>({
    queryKey: ["douyin-status"],
    queryFn: () => douyinSessionService.getStatus(),
    staleTime: 60 * 1000,
  });
};

