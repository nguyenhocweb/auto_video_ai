import { useMutation } from "@tanstack/react-query";
import { groqKeyService } from "../service/groq-key.service";
import { GroqKeyTestPayload } from "../type/groq-key.type";

export const useTestGroqKey = () => {
  return useMutation({
    mutationFn: (payload: GroqKeyTestPayload) => groqKeyService.testKey(payload),
  });
};

