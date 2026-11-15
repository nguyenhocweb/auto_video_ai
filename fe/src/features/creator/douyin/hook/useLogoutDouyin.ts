import { useMutation, useQueryClient } from "@tanstack/react-query";
import { douyinSessionService } from "../service/douyin-session.service";
import { toast } from "sonner";

export const useLogoutDouyin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => douyinSessionService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["douyin-status"] });
      toast.success("Đã hủy kết nối tài khoản Douyin thành công!");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Lỗi khi hủy kết nối";
      toast.error(msg);
    },
  });
};

