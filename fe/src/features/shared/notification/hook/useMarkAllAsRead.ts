"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsReadService } from "../service/notification.service";

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsReadService(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications_unread_count"] });
    },
  });
};
