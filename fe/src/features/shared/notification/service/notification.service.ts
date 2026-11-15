import axiosClient from "@/src/core/api/axios-instance";
import {
  NotificationListResponse,
  UnreadCountResponse,
} from "../type/notification.type";

export const getNotificationsService = async (
  isRead?: boolean,
  limit: number = 40,
  skip: number = 0
): Promise<NotificationListResponse> => {
  const params = new URLSearchParams();
  if (isRead !== undefined) {
    params.append("is_read", String(isRead));
  }
  params.append("limit", String(limit));
  params.append("skip", String(skip));

  const response = await axiosClient.get<NotificationListResponse>(
    `/api/v1/notifications?${params.toString()}`
  );
  return response.data;
};

export const getUnreadCountService = async (): Promise<UnreadCountResponse> => {
  const response = await axiosClient.get<UnreadCountResponse>(
    "/api/v1/notifications/unread-count"
  );
  return response.data;
};

export const markAsReadService = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  const response = await axiosClient.patch<{ success: boolean }>(
    `/api/v1/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllAsReadService = async (): Promise<{
  success: boolean;
  marked_count: number;
}> => {
  const response = await axiosClient.post<{
    success: boolean;
    marked_count: number;
  }>("/api/v1/notifications/mark-all-read");
  return response.data;
};

export const deleteNotificationService = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/api/v1/notifications/${notificationId}`
  );
  return response.data;
};

