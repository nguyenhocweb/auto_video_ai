import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { UpdateTokenPayload, UpdateTokenResponse } from "../type/facebook.type";

export const useUpdateToken = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateTokenResponse, Error, UpdateTokenPayload>({
    mutationFn: (payload: UpdateTokenPayload) => facebookService.updateToken(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["facebook_pages"], data.pages);
      queryClient.invalidateQueries({ queryKey: ["facebook_token_status"] });
      queryClient.invalidateQueries({ queryKey: ["facebook_pages"] });
    },
  });
};

