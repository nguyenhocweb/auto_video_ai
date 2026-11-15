import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectorService } from "../service/inspector.service";
import { ImageInspectResponse } from "../type/inspector.type";

export const useInspectImage = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation<ImageInspectResponse, Error, File>({
    mutationFn: (file: File) => inspectorService.uploadAndAnalyzeImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_history"] });
    },
  });

  const payloadMutation = useMutation<
    ImageInspectResponse,
    Error,
    { image_base64?: string; image_url?: string }
  >({
    mutationFn: (payload) => inspectorService.analyzeImagePayload(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_history"] });
    },
  });

  return {
    uploadImage: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    analyzePayload: payloadMutation.mutateAsync,
    isAnalyzingPayload: payloadMutation.isPending,
    payloadError: payloadMutation.error,
    isLoading: uploadMutation.isPending || payloadMutation.isPending,
  };
};

