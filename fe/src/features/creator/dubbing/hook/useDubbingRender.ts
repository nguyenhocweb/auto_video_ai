import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";
import { DubbingRenderPayload, DubbingJobResponse } from "../type/dubbing.type";

export const useDubbingRender = () => {
  const queryClient = useQueryClient();

  return useMutation<DubbingJobResponse, Error, DubbingRenderPayload>({
    mutationFn: (payload: DubbingRenderPayload) => dubbingService.renderDubbingJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dubbing_history"] });
    },
  });
};

