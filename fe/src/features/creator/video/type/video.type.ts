export interface VideoAuthorInfo {
  nickname: string;
  avatar?: string | null;
  uid?: string | null;
}

export interface VideoMetadataResponse {
  item_id: string;
  title: string;
  duration: number;
  video_url: string;
  cover_url?: string | null;
  music_url?: string | null;
  author: VideoAuthorInfo;
  source_platform: string;
}

export interface VideoExtractPayload {
  url: string;
}

export interface VideoSavePayload {
  item_id: string;
  title: string;
  duration: number;
  video_url: string;
  cover_url?: string | null;
  music_url?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
}

export interface VideoRecordItem {
  id: string;
  user_id: string;
  item_id: string;
  title: string;
  duration: number;
  video_url: string;
  cover_url?: string | null;
  music_url?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  cloudinary_url?: string | null;
  created_at: string;
}

export interface VideoPaginationResponse {
  items: VideoRecordItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface VideoHistoryParams {
  page?: number;
  limit?: number;
}

export interface ChannelCrawlPayload {
  url: string;
  limit?: number;
}

export interface ChannelVideoItem {
  item_id: string;
  title: string;
  video_url: string;
  cover_url?: string | null;
  is_today: boolean;
  crawled_date: string;
  publish_time?: string | null;
  created_timestamp?: number | null;
  likes_count?: number | null;
}

export interface ChannelTodayVideosResponse {
  creator_name: string;
  translated_name?: string | null;
  creator_avatar?: string | null;
  channel_url: string;
  total_works: number;
  today_count: number;
  videos: ChannelVideoItem[];
}

export interface SavedChannel {
  id: string;
  user_id: string;
  name: string;
  original_name?: string;
  channel_url: string;
  avatar_url?: string | null;
  total_works?: number;
  created_at: string;
  updated_at: string;
}

export interface SavedChannelCreatePayload {
  name: string;
  original_name?: string;
  channel_url: string;
  avatar_url?: string | null;
  total_works?: number;
}

export interface SavedChannelUpdatePayload {
  name: string;
}

export interface SavedChannelListResponse {
  channels: SavedChannel[];
  total: number;
}


