export interface TikTokChannelItem {
  id?: string;
  channel_id: string;
  display_name: string;
  username?: string | null;
  avatar_url?: string | null;
  follower_count: number;
  likes_count: number;
  video_count: number;
  scope?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TikTokChannelListResponse {
  channels: TikTokChannelItem[];
  total: number;
}

export interface TikTokAuthUrlResponse {
  auth_url: string;
}

export interface PublishTikTokRequest {
  channel_id: string;
  title: string;
  privacy_level?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY";
  disable_duet?: boolean;
  disable_comment?: boolean;
  disable_stitch?: boolean;
  video_cover_timestamp_ms?: number;
  video_url?: string;
  file?: File;
}

export interface PublishTikTokResponse {
  publish_id: string;
  channel_id: string;
  status: string;
  title: string;
  uploaded_at: string;
  message?: string;
}

export interface TikTokVideoItem {
  id: string;
  title: string;
  cover_image_url?: string | null;
  share_url?: string | null;
  duration?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  create_time?: number | null;
}

export interface TikTokVideoListResponse {
  videos: TikTokVideoItem[];
  cursor?: number | null;
  has_more?: boolean;
}

