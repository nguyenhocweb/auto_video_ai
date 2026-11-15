import axiosClient from "@/src/core/api/axios-instance";
import {
  DouyinSessionStatus,
  DouyinQrStartResponse,
  DouyinQrStatusResponse,
  DouyinSubmitCodePayload,
  DouyinSendCodePayload,
} from "../type/douyin-session.type";

export const douyinSessionService = {
  getStatus: async (): Promise<DouyinSessionStatus> => {
    const res = await axiosClient.get<DouyinSessionStatus>("/api/v1/creator/douyin/session/status");
    return res.data;
  },

  startQr: async (): Promise<DouyinQrStartResponse> => {
    const res = await axiosClient.post<DouyinQrStartResponse>("/api/v1/creator/douyin/session/qr/start");
    return res.data;
  },

  getQrStatus: async (sessionId: string): Promise<DouyinQrStatusResponse> => {
    const res = await axiosClient.get<DouyinQrStatusResponse>(
      `/api/v1/creator/douyin/session/qr/status/${sessionId}`
    );
    return res.data;
  },

  submitCode: async (payload: DouyinSubmitCodePayload): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.post<{ success: boolean; message: string }>(
      "/api/v1/creator/douyin/session/qr/submit-code",
      payload
    );
    return res.data;
  },

  resendCode: async (payload: DouyinSendCodePayload): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.post<{ success: boolean; message: string }>(
      "/api/v1/creator/douyin/session/qr/send-code",
      payload
    );
    return res.data;
  },

  cancelQr: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.post<{ success: boolean; message: string }>(
      `/api/v1/creator/douyin/session/qr/cancel/${sessionId}`
    );
    return res.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const res = await axiosClient.post<{ success: boolean; message: string }>(
      "/api/v1/creator/douyin/session/logout"
    );
    return res.data;
  },
};
