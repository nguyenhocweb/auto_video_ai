import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { geminiKeyService } from "../service/gemini-key.service";
import { CreateGeminiKeyPayload } from "../type/gemini-key.type";

export const useAddGeminiKey = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGeminiKeyPayload) => geminiKeyService.addKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gemini-api-keys"] });
      toast.success("Đã thêm Gemini API Key vào hệ thống thành công!");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể thêm Gemini API Key.";
      toast.error(msg);
    },
  });
};

