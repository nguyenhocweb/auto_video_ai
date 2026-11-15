"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnreadCountService } from "../service/notification.service";
import { UnreadCountResponse } from "../type/notification.type";

export const useGetUnreadCount = () => {
  return useQuery<UnreadCountResponse, Error>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadCountService(),
    staleTime: 60 * 1000,
  });
};

