import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stitchService } from "../service/stitch.service";
import { HookInventoryResponse } from "../type/stitch.type";

export const useHookInventory = (campaignId?: string) => {
  return useQuery<HookInventoryResponse>({
    queryKey: ["hook_inventory", campaignId || "all"],
    queryFn: async () => {
      return await stitchService.getHooks(campaignId);
    },
    staleTime: 60 * 1000,
  });
};

export const useDeleteHook = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, any, string>({
    mutationFn: async (hookId: string) => {
      return await stitchService.deleteHook(hookId);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Đã xóa Hook thành công!");
      queryClient.invalidateQueries({ queryKey: ["hook_inventory"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Xóa Hook thất bại";
      toast.error(msg);
    },
  });
};
