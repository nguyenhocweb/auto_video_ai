"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  FaRobot,
  FaCloudDownloadAlt,
  FaBars,
  FaTimes,
  FaMicrophoneAlt,
  FaFilm,
  FaShieldAlt,
  FaFacebook,
  FaYoutube,
  FaMusic,
  FaSlidersH,
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaLayerGroup,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useAuth } from "@/src/features/shared/auth/hook/useAuth";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Đóng bottom sheet mỗi khi chuyển trang
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const creatorItems = [
    { label: "AI Voice Studio", href: "/creator/voice", icon: FaMicrophoneAlt, badge: "OmniVoice" },
    { label: "AI Kể Chuyện & Phim", href: "/creator/storyboard", icon: FaFilm, badge: "Storyboard" },
    { label: "Auto Tải Video", href: "/creator/video", icon: FaCloudDownloadAlt, badge: "Douyin/TikTok" },
    { label: "Soi Policy & Viral", href: "/creator/inspector", icon: FaShieldAlt, badge: "Inspector" },
    { label: "Facebook Reels", href: "/creator/facebook", icon: FaFacebook, badge: "Pages & Reels" },
    { label: "YouTube Shorts", href: "/creator/youtube", icon: FaYoutube, badge: "Channels & Shorts" },
    { label: "Cấu hình Douyin", href: "/creator/douyin", icon: SiTiktok, badge: "QR Session" },
    { label: "Auto Cào & Đăng", href: "/creator/automation", icon: FaRobot, badge: "Automation" },
    { label: "Kho Nhạc Nền", href: "/creator/bgm", icon: FaMusic, badge: "BGM" },
    { label: "Cấu hình AI & GPU", href: "/creator/settings", icon: FaSlidersH, badge: "Settings" },
  ];

  const adminItems = [
    { label: "Thống Kê Tổng Quan", href: "/admin", icon: FaChartLine },
    { label: "Quản Lý Người Dùng", href: "/admin/users", icon: FaUsers },
    { label: "Quản Trị Models Giọng", href: "/admin/voices", icon: FaDatabase },
    { label: "Hàng Đợi & RAM Simulator", href: "/admin/concurrency", icon: FaLayerGroup },
  ];

  const isAutomationActive = pathname.startsWith("/creator/automation");
  const isVideoActive = pathname.startsWith("/creator/video");

  const bottomSheetContent = isOpen && mounted ? (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
      {/* Backdrop mờ phủ kín toàn màn hình */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Bottom Sheet trượt lên che một phần dưới điện thoại */}
      <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl max-h-[82vh] flex flex-col border-t border-slate-200 animate-in slide-in-from-bottom duration-250">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Danh Mục Chức Năng</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Chọn công cụ để tiếp tục thao tác</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* User Info Card */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <FaUserCircle className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.full_name || user?.email}
                </p>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  {isAdmin ? "Super Admin" : "Creator"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FaSignOutAlt className="text-xs" />
              <span>Thoát</span>
            </button>
          </div>

          {/* Nhóm Creator */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Không gian Creator
            </p>
            <div className="grid grid-cols-2 gap-2">
              {creatorItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <Icon className={`text-sm shrink-0 ${isActive ? "text-white" : "text-blue-600"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Nhóm Admin (nếu có quyền) */}
          {isAdmin && (
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                <FaShieldAlt className="text-[10px]" /> Quản Trị Hệ Thống
              </p>
              <div className="grid grid-cols-2 gap-2">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                      }`}
                    >
                      <Icon className={`text-sm shrink-0 ${isActive ? "text-white" : "text-amber-600"}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Thanh 3 nút cố định dưới đáy màn hình điện thoại */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-1.5">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto items-center">
          {/* Nút 1: Cào & Đăng */}
          <Link
            href="/creator/automation"
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              isAutomationActive
                ? "text-blue-600 bg-blue-50 font-bold"
                : "text-slate-600 hover:text-blue-600 font-medium"
            }`}
          >
            <FaRobot className="text-lg mb-0.5" />
            <span className="text-[11px] leading-tight">Cào &amp; Đăng</span>
          </Link>

          {/* Nút 2: Tải Video */}
          <Link
            href="/creator/video"
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              isVideoActive
                ? "text-blue-600 bg-blue-50 font-bold"
                : "text-slate-600 hover:text-blue-600 font-medium"
            }`}
          >
            <FaCloudDownloadAlt className="text-lg mb-0.5" />
            <span className="text-[11px] leading-tight">Tải Video</span>
          </Link>

          {/* Nút 3: Icon ba sọc (Mở Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              isOpen
                ? "text-blue-600 bg-blue-50 font-bold"
                : "text-slate-600 hover:text-blue-600 font-medium"
            }`}
          >
            <FaBars className="text-lg mb-0.5" />
            <span className="text-[11px] leading-tight">Tất Cả</span>
          </button>
        </div>
      </nav>

      {/* Render Bottom Sheet thông qua Portal ra document.body */}
      {mounted && createPortal(bottomSheetContent, document.body)}
    </>
  );
};
