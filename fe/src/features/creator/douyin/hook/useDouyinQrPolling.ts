import { useQuery } from "@tanstack/react-query";
import { douyinSessionService } from "../service/douyin-session.service";
import { DouyinQrStatusResponse } from "../type/douyin-session.type";

interface UseDouyinQrPollingProps {
  sessionId: string | null;
  enabled: boolean;
  onConfirmed?: (data: DouyinQrStatusResponse) => void;
  onNeedVerify?: (data: DouyinQrStatusResponse) => void;
}

export const useDouyinQrPolling = ({
  sessionId,
  enabled,
  onConfirmed,
  onNeedVerify,
}: UseDouyinQrPollingProps) => {
  return useQuery<DouyinQrStatusResponse>({
    queryKey: ["douyin-qr-status", sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error("No session id");
      }
      const data = await douyinSessionService.getQrStatus(sessionId);
      if (data.status === "CONFIRMED" && onConfirmed) {
        onConfirmed(data);
      } else if (data.status === "NEED_VERIFY" && onNeedVerify) {
        onNeedVerify(data);
      }
      return data;
    },
    enabled: Boolean(sessionId && enabled),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "CONFIRMED" || status === "EXPIRED" || status === "FAILED" || status === "CANCELLED") {
        return false;
      }
      return 2000;
    },
    staleTime: 0,
  });
};
