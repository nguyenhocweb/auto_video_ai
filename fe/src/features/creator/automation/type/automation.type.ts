export interface SourceChannelConfig {
  channel_url: string;
  name: string;
  original_name?: string | null;
  avatar_url?: string | null;
}

export interface TargetPageConfig {
  page_id: string;
  page_name: string;
  access_token?: string;
  post_type?: "reel" | "feed";
}

export interface TargetYouTubeChannelConfig {
  channel_id: string;
  channel_title: string;
  avatar_url?: string | null;
  video_type?: "video" | "shorts";
}

export type ProcessingMode = "both" | "vietsub" | "dubbing" | "download_only";

export interface AutomationCampaign {
  id: string;
  user_id: string;
  name: string;
  source_channels: SourceChannelConfig[];
  target_pages: TargetPageConfig[];
  target_youtube_channels?: TargetYouTubeChannelConfig[];
  caption_template: string;
  hashtags?: string;
  auto_add_title_tag: boolean;
  crawl_interval_minutes: number;
  only_today: boolean;
  max_video_age_hours?: number;
  only_new_unprocessed: boolean;
  max_videos_per_crawl: number;
  processing_mode: ProcessingMode;
  voice_source?: "preset" | "profile";
  voice_preset?: string;
  voice_profile_id?: string;
  voice_name?: string;
  remove_subtitles: boolean;
  selected_bgm_ids?: string[];
  keep_original_audio?: boolean;
  bgm_volume?: number;
  publish_to_youtube?: boolean;
  youtube_video_type?: "video" | "shorts";
  fb_post_type?: "reel" | "feed";
  is_active: boolean;
  status: "idle" | "running" | "paused" | "error";
  last_run_at?: string;
  next_run_at?: string;
  total_posted: number;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

export interface AutomationCampaignCreatePayload {
  name: string;
  source_channels: SourceChannelConfig[];
  target_pages: TargetPageConfig[];
  target_youtube_channels?: TargetYouTubeChannelConfig[];
  caption_template?: string;
  hashtags?: string;
  auto_add_title_tag?: boolean;
  crawl_interval_minutes?: number;
  only_today?: boolean;
  max_video_age_hours?: number;
  only_new_unprocessed?: boolean;
  max_videos_per_crawl?: number;
  processing_mode?: ProcessingMode;
  voice_source?: "preset" | "profile";
  voice_preset?: string;
  voice_profile_id?: string;
  voice_name?: string;
  remove_subtitles?: boolean;
  selected_bgm_ids?: string[];
  keep_original_audio?: boolean;
  bgm_volume?: number;
  publish_to_youtube?: boolean;
  youtube_video_type?: "video" | "shorts";
  fb_post_type?: "reel" | "feed";
  is_active?: boolean;
}

export interface AutomationCampaignUpdatePayload {
  name?: string;
  source_channels?: SourceChannelConfig[];
  target_pages?: TargetPageConfig[];
  target_youtube_channels?: TargetYouTubeChannelConfig[];
  caption_template?: string;
  hashtags?: string;
  auto_add_title_tag?: boolean;
  crawl_interval_minutes?: number;
  only_today?: boolean;
  max_video_age_hours?: number;
  only_new_unprocessed?: boolean;
  max_videos_per_crawl?: number;
  processing_mode?: ProcessingMode;
  voice_source?: "preset" | "profile";
  voice_preset?: string;
  voice_profile_id?: string;
  voice_name?: string;
  remove_subtitles?: boolean;
  selected_bgm_ids?: string[];
  keep_original_audio?: boolean;
  bgm_volume?: number;
  publish_to_youtube?: boolean;
  youtube_video_type?: "video" | "shorts";
  fb_post_type?: "reel" | "feed";
  is_active?: boolean;
}

export interface AutomationCampaignListResponse {
  total: number;
  campaigns: AutomationCampaign[];
}

export interface PublishedPageResult {
  page_id: string;
  page_name: string;
  success: boolean;
  video_id?: string;
  reel_url?: string;
  error?: string;
}

export interface PublishedYouTubeResult {
  channel_id?: string;
  channel_title?: string;
  success: boolean;
  video_id?: string;
  shorts_url?: string;
  error?: string;
}

export interface AutomationLog {
  id: string;
  campaign_id: string;
  campaign_name: string;
  user_id: string;
  source_channel_name: string;
  video_item_id: string;
  video_url?: string;
  video_original_title: string;
  video_translated_title: string;
  processing_mode: ProcessingMode;
  caption: string;
  status: "success" | "partial" | "failed" | "processing";
  published_pages: PublishedPageResult[];
  published_youtube?: PublishedYouTubeResult | null;
  published_youtube_channels?: PublishedYouTubeResult[];
  error?: string;
  created_at: string;
}

export interface AutomationLogListResponse {
  total: number;
  logs: AutomationLog[];
}

export interface PostedVideo {
  id: string;
  user_id: string;
  campaign_id: string;
  campaign_name: string;
  video_item_id: string;
  video_url: string;
  channel_name: string;
  title_original: string;
  title_translated: string;
  processing_mode: ProcessingMode;
  published_pages: PublishedPageResult[];
  published_youtube?: PublishedYouTubeResult | null;
  published_youtube_channels?: PublishedYouTubeResult[];
  published_date: string;
  created_at: string;
}

export interface PostedVideoListResponse {
  total: number;
  posted_videos: PostedVideo[];
}
