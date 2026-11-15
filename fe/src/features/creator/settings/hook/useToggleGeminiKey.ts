import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { geminiKeyService } from "../service/gemini-key.service";
import { ToggleGeminiKeyResponse } from "../type/gemini-key.type";

export const useToggleGeminiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => geminiKeyService.toggleKey(keyId),
    onSuccess: (data: ToggleGeminiKeyResponse) => {
      queryClient.invalidateQueries({ queryKey: ["gemini-api-keys"] });
      toast.success(data.message || "Cập nhật trạng thái Key thành công.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể cập nhật trạng thái Key.";
      toast.error(msg);
    },
  });
};

