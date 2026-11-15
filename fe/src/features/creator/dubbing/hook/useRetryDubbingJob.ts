import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";
import { DubbingJobResponse } from "../type/dubbing.type";

export const useRetryDubbingJob = () => {
  const queryClient = useQueryClient();

  return useMutation<DubbingJobResponse, Error, string>({
    mutationFn: (jobId: string) => dubbingService.retryJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dubbing_history"] });
    },
  });
};

