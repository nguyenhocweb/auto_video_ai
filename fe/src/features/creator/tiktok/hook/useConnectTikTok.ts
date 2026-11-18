import { useState } from "react";
import { tiktokService } from "../service/tiktok.service";

export const useConnectTikTok = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await tiktokService.getAuthUrl();
      if (res?.auth_url) {
        window.location.href = res.auth_url;
      } else {
        throw new Error("Không nhận được link ủy quyền từ máy chủ.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail || err?.message || "Lỗi tạo liên kết TikTok.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return { connect, isLoading, error };
};
