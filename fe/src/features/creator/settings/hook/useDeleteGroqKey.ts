import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groqKeyService } from "../service/groq-key.service";

export const useDeleteGroqKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => groqKeyService.deleteKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groq-api-keys"] });
      toast.success("Đã xóa Groq API Key khỏi hệ thống.");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể xóa API Key.";
      toast.error(msg);
    },
  });
};

