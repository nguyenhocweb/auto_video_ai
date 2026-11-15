import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groqKeyService } from "../service/groq-key.service";
import { CreateGroqKeyPayload } from "../type/groq-key.type";

export const useAddGroqKey = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroqKeyPayload) => groqKeyService.addKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groq-api-keys"] });
      toast.success("Đã thêm Groq API Key vào hệ thống thành công!");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể thêm Groq API Key.";
      toast.error(msg);
    },
  });
};

