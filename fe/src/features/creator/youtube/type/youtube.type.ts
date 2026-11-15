export interface YouTubeChannelItem {
  id?: string;
  channel_id: string;
  channel_title: string;
  custom_url?: string;
  avatar_url?: string;
  subscriber_count: number;
  video_count: number;
  has_refresh_token: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface YouTubeChannelListResponse {
  total: number;
  channels: YouTubeChannelItem[];
}

export interface YouTubeChannelResponse {
  is_connected: boolean;
  channel_id?: string;
  channel_title?: string;
  custom_url?: string;
  avatar_url?: string;
  subscriber_count: number;
  video_count: number;
  has_refresh_token: boolean;
  error?: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  published_at?: string;
  views: number;
  likes: number;
  comments: number;
  duration?: string;
  shorts_url: string;
  watch_url: string;
}

export interface YouTubeVideoListResponse {
  total: number;
  videos: YouTubeVideoItem[];
}

export interface AvailableVideo {
  filename: string;
  path: string;
  title: string;
  size_mb: number;
  created_at: string;
  source_type: string;
}

export interface YouTubeAuthUrlResponse {
  auth_url: string;
}

export interface PublishShortsRequest {
  channel_id?: string;
  video_path?: string;
  video_url?: string;
  title: string;
  description?: string;
  tags?: string[];
  privacy_status?: "public" | "unlisted" | "private";
  video_type?: "video" | "shorts";
}

export interface PublishShortsResponse {
  success: boolean;
  channel_id?: string;
  video_id?: string;
  shorts_url?: string;
  watch_url?: string;
  video_url?: string;
  video_type?: "video" | "shorts";
  title?: string;
  error?: string;
}
