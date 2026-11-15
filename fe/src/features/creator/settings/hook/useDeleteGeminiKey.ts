import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { geminiKeyService } from "../service/gemini-key.service";

export const useDeleteGeminiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => geminiKeyService.deleteKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gemini-api-keys"] });
      toast.success("Đã xóa Gemini API Key khỏi hệ thống.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể xóa API Key.";
      toast.error(msg);
    },
  });
};

