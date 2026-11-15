import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";

export const useDeleteDubbingJob = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (jobId: string) => dubbingService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dubbing_history"] });
    },
  });
};

