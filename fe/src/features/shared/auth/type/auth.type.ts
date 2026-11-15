export type UserRole = "ADMIN" | "USER" | "CREATOR";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserProfile;
}

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  label: string;
  description: string;
}
