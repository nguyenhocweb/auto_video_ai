export interface AdminDashboardStats {
  users: {
    total: number;
    admins: number;
    creators: number;
  };
  voices: {
    total: number;
  };
  training: {
    total_jobs: number;
    running: number;
    completed: number;
  };
  generations: {
    total: number;
  };
  system: {
    status: string;
    engine: string;
    database: string;
    cdn: string;
  };
}

export interface AdminUserItem {
  id: string;
  email: string;
  full_name?: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "BLOCKED";
  created_at?: string;
  updated_at?: string;
}

export interface AdminVoiceItem {
  id: string;
  name: string;
  gender: string;
  prompt_file_path?: string;
  provider: string;
  created_at?: string;
  is_preset?: boolean;
}
