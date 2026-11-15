"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../auth/hook/useAuth";

interface WsNotificationEvent {
  event: string;
  data: {
    generation_id?: string;
    job_id?: string;
    campaign_id?: string;
    video_title?: string;
    status?: string;
    voice_name?: string;
    audio_url?: string;
    video_url?: string;
    cloudinary_url?: string;
    step?: string;
    percent?: number;
    duration_seconds?: number;
    error?: string;
    message?: string;
  };
}

export const useNotificationSocket = () => {
  const { token, isAuthenticated, refreshTokenFunc } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  const isTokenExpired = (tok: string | null): boolean => {
    if (!tok) return true;
    try {
      const parts = tok.split(".");
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return !payload.exp || payload.exp * 1000 <= Date.now() + 10000;
    } catch {
      return true;
    }
  };

  const connect = useCallback(async () => {
    if (!isAuthenticated) return;
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    let activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
    if (isTokenExpired(activeToken)) {
      if (refreshTokenFunc) {
        const refreshed = await refreshTokenFunc();
        if (refreshed) {
          activeToken = refreshed;
          retryCountRef.current = 0;
        } else {
          return;
        }
      } else {
        return;
      }
    }

    if (!activeToken) return;

    try {
      const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
      const wsProtocol = isHttps ? "wss:" : "ws:";
      const host = process.env.NEXT_PUBLIC_WS_HOST || "127.0.0.1:8001";
      const wsUrl = `${wsProtocol}//${host}/api/v1/ws/notifications?token=${encodeURIComponent(activeToken)}`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        retryCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const payload: WsNotificationEvent = JSON.parse(event.data);
          if (payload.event === "AUTH_FAILED") {
            if (refreshTokenFunc) {
              refreshTokenFunc().then((newTok) => {
                if (newTok) connect();
              });
            }
            return;
          }
          if (payload.event === "AUDIO_GENERATION_PROCESSING") {
            toast.info(`Bắt đầu xử lý: ${payload.data.voice_name || "Bản thu âm"}`, {
              id: `ws-${payload.data.generation_id}`,
              duration: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ["my-audio-recordings"] });
          } else if (payload.event === "AUDIO_GENERATION_COMPLETED") {
            toast.success(
              `Đã tạo xong giọng nói "${payload.data.voice_name || "Thuyết minh"}" (${payload.data.duration_seconds?.toFixed(1) || "0"}s)!`,
              {
                id: `ws-${payload.data.generation_id}`,
                duration: 5000,
              }
            );
            queryClient.invalidateQueries({ queryKey: ["my-audio-recordings"] });
          } else if (payload.event === "AUDIO_GENERATION_FAILED") {
            toast.error(
              `Thất bại khi tạo giọng nói: ${payload.data.error || "Lỗi hệ thống"}`,
              {
                id: `ws-${payload.data.generation_id}`,
                duration: 6000,
              }
            );
            queryClient.invalidateQueries({ queryKey: ["my-audio-recordings"] });
          } else if (payload.event === "DUBBING_PROGRESS") {
            const { job_id, step, percent, status } = payload.data;
            queryClient.setQueriesData({ queryKey: ["dubbing_history"] }, (old: any) => {
              if (!old || !old.items) return old;
              return {
                ...old,
                items: old.items.map((item: any) =>
                  item.id === job_id
                    ? {
                        ...item,
                        status: status || item.status,
                        progress_step: step || item.progress_step,
                        progress_percent: percent !== undefined ? percent : item.progress_percent,
                      }
                    : item
                ),
              };
            });
          } else if (payload.event === "DUBBING_COMPLETED") {
            const { job_id, video_url, cloudinary_url } = payload.data;
            toast.success("Xử lý video hoàn tất 100%!", {
              id: `ws-dub-${job_id}`,
              duration: 5000,
            });
            queryClient.setQueriesData({ queryKey: ["dubbing_history"] }, (old: any) => {
              if (!old || !old.items) return old;
              return {
                ...old,
                items: old.items.map((item: any) =>
                  item.id === job_id
                    ? {
                        ...item,
                        status: "completed",
                        progress_step: "Hoàn thành xuất sắc 100%!",
                        progress_percent: 100,
                        output_video_url: video_url || item.output_video_url,
                        cloudinary_url: cloudinary_url || item.cloudinary_url,
                      }
                    : item
                ),
              };
            });
            queryClient.invalidateQueries({ queryKey: ["dubbing_history"] });
          } else if (payload.event === "AUTOMATION_CYCLE_STARTED") {
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
          } else if (payload.event === "AUTOMATION_POSTED_SUCCESS") {
            toast.success(
              `[Auto Reels] Đã tự động xuất bản video "${payload.data.video_title || "Mới"}" lên Facebook!`,
              { duration: 5000 }
            );
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-logs"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-posted-videos"] });
          } else if (payload.event === "AUTOMATION_CYCLE_COMPLETED") {
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-logs"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-posted-videos"] });
          } else if (payload.event === "DUBBING_FAILED") {
            const { job_id, error } = payload.data;
            toast.error(`Xử lý video thất bại: ${error || "Lỗi xử lý"}`, {
              id: `ws-dub-${job_id}`,
              duration: 6000,
            });
            queryClient.setQueriesData({ queryKey: ["dubbing_history"] }, (old: any) => {
              if (!old || !old.items) return old;
              return {
                ...old,
                items: old.items.map((item: any) =>
                  item.id === job_id
                    ? {
                        ...item,
                        status: "failed",
                        progress_step: `Thất bại: ${error || ""}`.slice(0, 120),
                        progress_percent: 0,
                        error_message: error,
                      }
                    : item
                ),
              };
            });
            queryClient.invalidateQueries({ queryKey: ["dubbing_history"] });
          } else if (payload.event === "AUTOMATION_CYCLE_STARTED") {
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
          } else if (payload.event === "AUTOMATION_POSTED_SUCCESS") {
            toast.success(
              `[Auto Reels] Đã tự động xuất bản video "${payload.data.video_title || "Mới"}" lên Facebook!`,
              { duration: 5000 }
            );
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-logs"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-posted-videos"] });
          } else if (payload.event === "AUTOMATION_CYCLE_COMPLETED") {
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-logs"] });
            queryClient.invalidateQueries({ queryKey: ["creator", "automation-posted-videos"] });
          }
        } catch {
          // ignore parsing error
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        socketRef.current = null;
        if (event.code === 4401 || event.code === 1008) {
          if (refreshTokenFunc) {
            refreshTokenFunc().then((newTok) => {
              if (newTok) connect();
            });
          }
          return;
        }

        retryCountRef.current += 1;
        const delay = Math.min(retryCountRef.current * 3000, 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // ignore
    }
  }, [token, isAuthenticated, refreshTokenFunc, queryClient]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return { isConnected };
};

