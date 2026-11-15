/**
 * Chuẩn hóa URL âm thanh từ backend hoặc link ngoại vi, tránh lỗi NotSupportedError do relative path.
 */
export function resolveAudioUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${cleanBase}${cleanPath}`;
}

