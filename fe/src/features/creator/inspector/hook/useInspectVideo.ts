import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectorService } from "../service/inspector.service";
import { VideoInspectResponse } from "../type/inspector.type";

export const useInspectVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<VideoInspectResponse, Error, { video_url?: string; job_id?: string }>({
    mutationFn: (payload) => inspectorService.analyzeVideoPacing(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_history"] });
    },
  });
};

