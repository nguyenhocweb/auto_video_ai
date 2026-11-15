"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsersService,
  updateAdminUserRoleService,
  updateAdminUserStatusService,
} from "../service/admin.users.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsersService(),
    staleTime: 60 * 1000,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; role: "ADMIN" | "USER" }) =>
      updateAdminUserRoleService(data.userId, data.role),
    onSuccess: (_, vars) => {
      toast.success(`Đã cập nhật quyền thành: ${vars.role}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Không thể cập nhật quyền người dùng!"));
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; status: "ACTIVE" | "BLOCKED" }) =>
      updateAdminUserStatusService(data.userId, data.status),
    onSuccess: (_, vars) => {
      toast.success(`Đã cập nhật trạng thái: ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Không thể cập nhật trạng thái người dùng!"));
    },
  });
};

