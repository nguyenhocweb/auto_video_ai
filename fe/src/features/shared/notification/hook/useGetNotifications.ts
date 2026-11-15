"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationsService } from "../service/notification.service";
import { NotificationListResponse } from "../type/notification.type";

export const useGetNotifications = (isRead?: boolean, limit: number = 40) => {
  return useQuery<NotificationListResponse, Error>({
    queryKey: ["notifications", isRead, limit],
    queryFn: () => getNotificationsService(isRead, limit),
    staleTime: 60 * 1000,
  });
};

