import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { groqKeyService } from "../service/groq-key.service";

interface UpdateModelParams {
  keyId: string;
  model: string;
}

export const useUpdateGroqKeyModel = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ keyId, model }: UpdateModelParams) =>
      groqKeyService.updateKeyModel(keyId, model),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groq-api-keys"] });
      toast.success(`Đã cập nhật model [${data.model}] cho Key thành công!`);
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể cập nhật model.";
      toast.error(msg);
    },
  });
};

