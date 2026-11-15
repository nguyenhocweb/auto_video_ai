"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/features/shared/auth/hook/useAuth";
import { FaLock, FaSpinner, FaShieldAlt } from "react-icons/fa";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "USER";
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <FaSpinner className="animate-spin text-3xl text-blue-600" />
          <p className="text-xs font-bold text-gray-500">Đang xác thực thông tin tài khoản...</p>
          {isTimedOut && (
            <div className="mt-3 space-y-2 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xs">
              <p className="text-[11px] text-gray-500">
                Phiên đăng nhập chưa được xác thực hoặc máy chủ phản hồi chậm.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Đến trang Đăng Nhập
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mx-auto">
            <FaLock />
          </div>
          <h3 className="text-base font-bold text-gray-900">Bắt buộc phải đăng nhập</h3>
          <p className="text-xs text-gray-500">
            Hệ thống yêu cầu đăng nhập tài khoản Người Dùng hoặc Admin để tiếp tục sử dụng.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
          >
            Đến trang Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole === "ADMIN" && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto">
            <FaShieldAlt />
          </div>
          <h3 className="text-base font-bold text-gray-900">Truy cập bị từ chối (403 Forbidden)</h3>
          <p className="text-xs text-gray-500">
            Bạn đang đăng nhập với vai trò <strong>{user?.role}</strong>. Trang này chỉ dành riêng cho <strong>Quản Trị Viên (Super Admin)</strong>.
          </p>
          <button
            type="button"
            onClick={() => router.push("/creator/voice")}
            className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs"
          >
            Quay lại Không gian Creator
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

