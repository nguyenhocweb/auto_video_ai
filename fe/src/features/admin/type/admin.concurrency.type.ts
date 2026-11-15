export interface RamPresetItem {
  ram_gb: number;
  optimal_concurrency: number;
  max_concurrency: number;
  status: "ENTRY" | "RECOMMENDED" | "HIGH_PERFORMANCE" | "ENTERPRISE";
  desc: string;
}

export interface ConcurrencySettingsResponse {
  max_concurrency: number;
  server_ram_gb: number;
  active_jobs: number;
  queued_jobs: number;
  estimated_ram_usage_gb: number;
  ram_presets: RamPresetItem[];
}

export interface UpdateConcurrencyPayload {
  max_concurrency: number;
  server_ram_gb?: number;
}

