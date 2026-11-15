import axiosClient from "@/src/core/api/axios-instance";
import { AdminDashboardStats } from "../type/admin.type";

export const getAdminStatsService = async (): Promise<AdminDashboardStats> => {
  const response = await axiosClient.get<AdminDashboardStats>("/api/v1/admin/dashboard/stats");
  return response.data;
};

