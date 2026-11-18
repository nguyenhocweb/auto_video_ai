import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stitchService } from "../service/stitch.service";
import { ManualStitchPayload, ManualStitchResult } from "../type/stitch.type";

export const useManualStitch = () => {
  const queryClient = useQueryClient();

  return useMutation<ManualStitchResult, any, ManualStitchPayload>({
    mutationFn: async (payload: ManualStitchPayload) => {
      return await stitchService.manualStitch(payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Ghép nối video thành công!");
      queryClient.invalidateQueries({ queryKey: ["hook_inventory"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Lỗi ghép nối video. Vui lòng kiểm tra lại link nguồn!";
      toast.error(msg);
    },
  });
};
