export interface PublishedDestination {
  platform: "facebook" | "youtube" | "tiktok" | string;
  target_name: string;
  target_id?: string;
  post_url?: string;
  status: "success" | "failed";
  published_at?: string;
}

export interface NotificationMetadata {
  campaign_id?: string;
  campaign_name?: string;
  channel_name?: string;
  channel_url?: string;
  channel_avatar?: string;
  video_item_id?: string;
  video_url?: string;
  video_title?: string;
  translated_title?: string;
  cover_url?: string;
  current_step?: string;
  progress_percent?: number;
  published_destinations?: PublishedDestination[];
  error_detail?: string;
  job_id?: string;
  can_retry?: boolean;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  target_role: "ALL" | "ADMIN" | "CREATOR" | string;
  type: string;
  title: string;
  message: string;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  metadata?: NotificationMetadata;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationListResponse {
  total: number;
  unread_count: number;
  notifications: NotificationItem[];
}

export interface UnreadCountResponse {
  unread_count: number;
}

