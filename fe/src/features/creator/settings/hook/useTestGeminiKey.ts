"use client";

import { useMutation } from "@tanstack/react-query";
import { geminiKeyService } from "../service/gemini-key.service";
import { GeminiKeyTestPayload, GeminiKeyTestResponse } from "../type/gemini-key.type";

export const useTestGeminiKey = () => {
  return useMutation<GeminiKeyTestResponse, Error, GeminiKeyTestPayload>({
    mutationFn: (payload: GeminiKeyTestPayload) => geminiKeyService.testKey(payload),
  });
};

