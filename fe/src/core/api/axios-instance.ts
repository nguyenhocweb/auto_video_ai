import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
export const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://127.0.0.1:8002";

// Danh sách các tiền tố endpoint thuộc cụm AI Engine & Media Worker (Port 8002)
const AI_ENDPOINT_PREFIXES = [
  "/api/v1/creator/voice",
  "/api/v1/creator/dubbing",
  "/api/v1/stitch",
  "/api/v1/creator/storyboard",
  "/api/v1/creator/template-video",
];

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 300000, // 300s (5 phút) cho AI model loading & generation
});

// Interceptor request: Tự động điều phối Port (8001 Core vs 8002 AI) và đính kèm Access Token
axiosClient.interceptors.request.use(
  (config) => {
    const isAiRequest = AI_ENDPOINT_PREFIXES.some((prefix) => config.url?.startsWith(prefix));
    config.baseURL = isAiRequest ? AI_BASE_URL : BASE_URL;

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Tự động dùng Refresh Token cấp mới Access Token khi token hết hạn (401)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const newAccessToken = res.data.access_token;
            const newRefreshToken = res.data.refresh_token;

            localStorage.setItem("access_token", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("refresh_token", newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosClient(originalRequest);
          } catch {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_profile");
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
