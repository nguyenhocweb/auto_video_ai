import { useQuery } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { FacebookTokenStatus } from "../type/facebook.type";

export const useTokenStatus = () => {
  return useQuery<FacebookTokenStatus, Error>({
    queryKey: ["facebook_token_status"],
    queryFn: () => facebookService.getTokenStatus(),
    staleTime: 60 * 1000,
  });
};

