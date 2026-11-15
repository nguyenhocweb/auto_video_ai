"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { geminiKeyService } from "../service/gemini-key.service";
import { GeminiKeyItem } from "../type/gemini-key.type";

interface UpdateModelParams {
  keyId: string;
  model: string;
}

export const useUpdateGeminiKeyModel = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<GeminiKeyItem, Error, UpdateModelParams>({
    mutationFn: ({ keyId, model }: UpdateModelParams) =>
      geminiKeyService.updateKeyModel(keyId, model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gemini_keys"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};

