"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsReadService } from "../service/notification.service";

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (notificationId: string) => markAsReadService(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

