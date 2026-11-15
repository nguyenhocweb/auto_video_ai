import axiosClient from "@/src/core/api/axios-instance";
import { AdminVoiceItem } from "../type/admin.type";

export const getAdminVoicesService = async (): Promise<AdminVoiceItem[]> => {
  const response = await axiosClient.get<{ voices: AdminVoiceItem[] }>("/api/v1/admin/voices");
  return response.data.voices || [];
};

export const deleteAdminVoiceService = async (voiceId: string): Promise<{ message: string }> => {
  const response = await axiosClient.delete<{ message: string }>(`/api/v1/admin/voices/${voiceId}`);
  return response.data;
};

