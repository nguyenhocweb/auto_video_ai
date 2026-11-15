"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/src/core/api/axios-instance";
import { UserProfile, AuthResponse } from "../type/auth.type";
import { toast } from "sonner";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  quickLoginAs: (role: "ADMIN" | "USER") => Promise<void>;
  logout: () => void;
  refreshTokenFunc: () => Promise<string | null>;
}

const isJwtExpired = (jwtToken: string | null): boolean => {
  if (!jwtToken) return true;
  try {
    const parts = jwtToken.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !payload.exp || payload.exp * 1000 <= Date.now() + 10000;
  } catch {
    return true;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshTokenVal, setRefreshTokenVal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAuthToken = async (): Promise<string | null> => {
    const rf = localStorage.getItem("refresh_token") || refreshTokenVal;
    if (!rf) return null;
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
      const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: rf }),
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        if (data.refresh_token) setRefreshTokenVal(data.refresh_token);
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
        return data.access_token as string;
      }
    } catch {
      // Refresh token failed
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedAccessToken = localStorage.getItem("access_token");
        const savedRefreshToken = localStorage.getItem("refresh_token");
        const savedUserStr = localStorage.getItem("user_profile");

        if (savedAccessToken && savedUserStr) {
          const parsedUser = JSON.parse(savedUserStr);
          setUser(parsedUser);

          if (isJwtExpired(savedAccessToken) && savedRefreshToken) {
            const newTok = await refreshAuthToken();
            if (!newTok) {
              setToken(savedAccessToken);
            }
          } else {
            setToken(savedAccessToken);
            setRefreshTokenVal(savedRefreshToken);
            axiosClient.defaults.headers.common["Authorization"] = `Bearer ${savedAccessToken}`;
          }
        }
      } catch {
        // Bỏ qua lỗi parse
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.access_token);
    setRefreshTokenVal(data.refresh_token);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("user_profile", JSON.stringify(data.user));

    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await axiosClient.post<AuthResponse>("/api/v1/auth/login", {
        email,
        password: pass,
      });

      handleAuthSuccess(res.data);
      toast.success(`Đăng nhập thành công! Vai trò: ${res.data.user.role === "ADMIN" ? "Quản Trị Viên" : "Người Dùng"}`);

      // Tự động phân luồng theo vai trò được mã hóa trong Access Token
      if (res.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/creator/voice");
      }
      return true;
    } catch (err: any) {
      if (!err?.response) {
        toast.error("Không thể kết nối đến máy chủ Backend (Port 8001)! Vui lòng kiểm tra lại dịch vụ.");
      } else {
        toast.error(err.response.data?.detail || "Email hoặc mật khẩu không chính xác!");
      }
      return false;
    }
  };

  const quickLoginAs = async (role: "ADMIN" | "USER") => {
    const creds =
      role === "ADMIN"
        ? { email: "admin@videoai.com", pass: "admin123456" }
        : { email: "user@videoai.com", pass: "user123456" };

    await login(creds.email, creds.pass);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshTokenVal(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");

    delete axiosClient.defaults.headers.common["Authorization"];
    toast.info("Đã đăng xuất tài khoản");
    router.push("/login");
  };

  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken: refreshTokenVal,
        isLoading,
        isAdmin,
        isAuthenticated,
        login,
        quickLoginAs,
        logout,
        refreshTokenFunc: refreshAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
