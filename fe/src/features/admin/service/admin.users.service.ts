import axiosClient from "@/src/core/api/axios-instance";
import { AdminUserItem } from "../type/admin.type";

export const getAdminUsersService = async (): Promise<AdminUserItem[]> => {
  const response = await axiosClient.get<{ users: AdminUserItem[] }>("/api/v1/admin/users");
  return response.data.users || [];
};

export const updateAdminUserRoleService = async (
  userId: string,
  role: "ADMIN" | "USER"
): Promise<{ message: string; role: string }> => {
  const response = await axiosClient.patch<{ message: string; role: string }>(
    `/api/v1/admin/users/${userId}/role`,
    { role }
  );
  return response.data;
};

export const updateAdminUserStatusService = async (
  userId: string,
  status: "ACTIVE" | "BLOCKED"
): Promise<{ message: string; status: string }> => {
  const response = await axiosClient.patch<{ message: string; status: string }>(
    `/api/v1/admin/users/${userId}/status`,
    { status }
  );
  return response.data;
};

