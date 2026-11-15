"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/shared/auth/hook/useAuth";
import {
  FaMicrophone,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6 text-white">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mx-auto ring-4 ring-white/10">
            <FaMicrophone className="text-2xl" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Video AI Studio</h1>
          <p className="text-xs text-slate-400">
            Hệ thống Voice AI &amp; Video Automation — Đăng nhập chung nền tảng
          </p>
        </div>

        {/* Form Đăng Nhập Chung Duy Nhất (Single Unified Login) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl space-y-5">
          <div className="text-left pb-1">
            <h2 className="text-base font-extrabold text-gray-900">Đăng Nhập Tài Khoản</h2>
            <p className="text-xs text-gray-500 mt-1">
              Nhập email và mật khẩu của bạn để truy cập hệ thống
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Địa Chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@videoai.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Input Mật Khẩu */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mật Khẩu
                </label>
                <span className="text-[11px] text-gray-400 hover:text-blue-600 cursor-pointer">
                  Quên mật khẩu?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Nút Submit Đăng Nhập */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed pt-3"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Đang xác thực thông tin...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>

          {/* Cơ chế bảo mật JWT & Phân quyền ngầm */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5 text-slate-600">
              <FaShieldAlt className="text-blue-600" />
              <span>Bảo mật JWT &amp; Refresh Token</span>
            </span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
              Tự nhận diện vai trò
            </span>
          </div>

          {/* Gợi ý tài khoản demo dạng văn bản nhỏ hỗ trợ điền nhanh */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">
              Tài khoản thử nghiệm (Bấm để điền nhanh):
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillDemo("admin@videoai.com", "admin123456")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 font-semibold transition-all shadow-2xs"
              >
                🛡️ Admin: admin@videoai.com
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("user@videoai.com", "user123456")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 font-semibold transition-all shadow-2xs"
              >
                👤 User: user@videoai.com
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500">
          Video AI Studio © 2026 • Nền tảng tổng hợp giọng nói &amp; video tự động
        </p>
      </div>
    </div>
  );
}
