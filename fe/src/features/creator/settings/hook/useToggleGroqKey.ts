import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groqKeyService } from "../service/groq-key.service";

export const useToggleGroqKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => groqKeyService.toggleKey(keyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groq-api-keys"] });
      const statusLabel = data.is_active ? "Kích hoạt" : "Vô hiệu hóa";
      toast.success(`Đã ${statusLabel} Groq API Key.`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể cập nhật trạng thái Key.";
      toast.error(msg);
    },
  });
};

