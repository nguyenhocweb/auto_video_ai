import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { youtubeService } from "../service/youtube.service";

export const useConnectYouTube = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await youtubeService.getAuthUrl();
      if (!res.auth_url) {
        throw new Error("Không nhận được URL ủy quyền từ máy chủ.");
      }
      return res.auth_url;
    },
    onSuccess: (authUrl) => {
      toast.info("Đang chuyển hướng sang Google để ủy quyền Kênh YouTube...");
      window.location.href = authUrl;
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Không thể khởi tạo phiên xác thực Google.";
      toast.error(msg);
    },
  });
};

