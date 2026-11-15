export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture_url: string;
  fan_count: number;
  followers_count: number;
  access_token?: string;
}

export interface FacebookVideo {
  id: string;
  title: string;
  description: string;
  created_time: string;
  thumbnail: string;
  permalink_url: string;
  length: number;
  views: number;
  reactions_count: number;
  comments_count: number;
}

export interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
  thumbnail: string;
  permalink_url: string;
  shares_count: number;
  reactions_count: number;
  comments_count: number;
}

export interface AvailableVideo {
  id: string;
  name: string;
  path: string;
  size_mb: number;
  source: string;
  modified_time: string;
}

export interface PublishReelPayload {
  page_id?: string;
  video_path: string;
  caption: string;
  title?: string;
  post_type?: "reel" | "feed";
  access_token?: string;
}

export interface PublishReelResponse {
  success: boolean;
  video_id: string;
  page_id: string;
  page_name: string;
  caption: string;
  reel_url: string;
  post_type?: "reel" | "feed";
  message: string;
}

export interface FacebookTokenStatus {
  is_valid: boolean;
  has_token: boolean;
  error?: string | null;
  expires_at?: number | null;
  scopes: string[];
  expires_in_days?: number | null;
  expires_at_formatted?: string | null;
  token_type_label?: string | null;
  data_access_expires_at?: number | null;
}

export interface UpdateTokenPayload {
  user_token: string;
}

export interface UpdateTokenResponse {
  success: boolean;
  message: string;
  pages_count: number;
  pages: FacebookPage[];
}


