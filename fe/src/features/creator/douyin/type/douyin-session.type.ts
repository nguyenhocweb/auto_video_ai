export type DouyinQrLoginStatus =
  | "WAITING_FOR_SCAN"
  | "SCANNED"
  | "NEED_VERIFY"
  | "CONFIRMED"
  | "EXPIRED"
  | "FAILED"
  | "CANCELLED";

export interface DouyinAccountInfo {
  user_id?: string;
  uid?: string;
  sec_uid?: string;
  name?: string;
  screen_name?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

export interface DouyinSessionStatus {
  is_connected: boolean;
  nickname?: string | null;
  avatar_url?: string | null;
  uid?: string | null;
  sec_uid?: string | null;
  last_connected_at?: string | null;
  expires_at?: string | null;
}

export interface DouyinQrStartResponse {
  session_id: string;
  qr_code_url: string;
  expires_in: number;
  status: DouyinQrLoginStatus;
}

export interface DouyinQrStatusResponse {
  session_id: string;
  status: DouyinQrLoginStatus;
  message?: string | null;
  masked_mobile?: string | null;
  account_info?: DouyinAccountInfo | null;
}

export interface DouyinSubmitCodePayload {
  session_id: string;
  code: string;
}

export interface DouyinSendCodePayload {
  session_id: string;
}
