import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";
import { AutoDubbingFromUrlPayload, DubbingJobResponse } from "../type/dubbing.type";

export const useAutoDubbing = () => {
  const queryClient = useQueryClient();

  return useMutation<DubbingJobResponse, Error, AutoDubbingFromUrlPayload>({
    mutationFn: (payload: AutoDubbingFromUrlPayload) => dubbingService.startAutoDubbing(payload),
    onSuccess: (newJob) => {
      // 1. Invalidate và ép buộc refetch lại dữ liệu từ Database ngay lập tức
      queryClient.invalidateQueries({ queryKey: ["dubbing_history"] });
      queryClient.refetchQueries({ queryKey: ["dubbing_history"] });

      // 2. Cập nhật trực tiếp vào cache để hiện dòng trạng thái ngay lập tức (0ms)
      queryClient.setQueriesData({ queryKey: ["dubbing_history"] }, (old: any) => {
        if (!old) return { items: [newJob], total: 1, page: 1, limit: 5 };
        const items = old.items || [];
        const exists = items.some((it: any) => it.id === newJob.id);
        if (exists) return old;
        return {
          ...old,
          total: (old.total || 0) + 1,
          items: [newJob, ...items],
        };
      });
    },
  });
};

