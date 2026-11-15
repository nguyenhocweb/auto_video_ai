import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectorService } from "../service/inspector.service";
import { TextPolicyInspectResponse } from "../type/inspector.type";

export const useInspectText = () => {
  const queryClient = useQueryClient();

  return useMutation<TextPolicyInspectResponse, Error, string>({
    mutationFn: (text: string) => inspectorService.analyzeTextPolicy(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspector_history"] });
    },
  });
};

