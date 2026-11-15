"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConcurrencySettingsService,
  updateConcurrencySettingsService,
} from "../service/admin.concurrency.service";
import {
  ConcurrencySettingsResponse,
  UpdateConcurrencyPayload,
} from "../type/admin.concurrency.type";
import { toast } from "sonner";

export const useGetConcurrencySettings = () => {
  return useQuery<ConcurrencySettingsResponse>({
    queryKey: ["admin-concurrency-settings"],
    queryFn: getConcurrencySettingsService,
    staleTime: 60 * 1000,
    refetchInterval: 3000, // Cập nhật live số task đang chạy & chờ
  });
};

export const useUpdateConcurrencySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateConcurrencyPayload) =>
      updateConcurrencySettingsService(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Đã áp dụng cấu hình hàng đợi thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-concurrency-settings"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || "Không thể cập nhật cấu hình hàng đợi!";
      toast.error(msg);
    },
  });
};

