"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaMicrophoneAlt,
  FaVideo,
  FaFolderOpen,
  FaSlidersH,
  FaRobot,
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaShieldAlt,
  FaLayerGroup,
  FaCloudDownloadAlt,
  FaFacebook,
  FaYoutube,
  FaMusic,
  FaFilm,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useAuth } from "@/src/features/shared/auth/hook/useAuth";

export const PublicSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const creatorNavItems = [
    {
      label: "AI Voice Studio",
      href: "/creator/voice",
      icon: FaMicrophoneAlt,
      badge: "OmniVoice",
    },
    {
      label: "AI Kể Chuyện & Phim",
      href: "/creator/storyboard",
      icon: FaFilm,
      disabled: false,
      badge: "Storyboard",
    },
    {
      label: "Auto Tải Video",
      href: "/creator/video",
      icon: FaCloudDownloadAlt,
      disabled: false,
      badge: "Douyin / TikTok",
    },
    {
      label: "Soi Policy & Viral",
      href: "/creator/inspector",
      icon: FaShieldAlt,
      disabled: false,
      badge: "AI Inspector",
    },
    {
      label: "Facebook Reels Studio",
      href: "/creator/facebook",
      icon: FaFacebook,
      disabled: false,
      badge: "Pages & Reels",
    },
    {
      label: "YouTube Shorts Studio",
      href: "/creator/youtube",
      icon: FaYoutube,
      disabled: false,
      badge: "Channels & Shorts",
    },
    {
      label: "Cấu hình Douyin",
      href: "/creator/douyin",
      icon: SiTiktok,
      disabled: false,
      badge: "QR Session",
    },
    {
      label: "Auto Cào & Đăng Bài",
      href: "/creator/automation",
      icon: FaRobot,
      disabled: false,
      badge: "Automation",
    },
    {
      label: "Kho Nhạc Nền (BGM)",
      href: "/creator/bgm",
      icon: FaMusic,
      disabled: false,
      badge: "No-Copyright",
    },
    {
      label: "Kho File & Audio",
      href: "/creator/storage",
      icon: FaFolderOpen,
      disabled: true,
    },
    {
      label: "Cấu hình AI & GPU",
      href: "/creator/settings",
      icon: FaSlidersH,
      disabled: false,
      badge: "Gemini",
    },
  ];

  const adminNavItems = [
    {
      label: "Thống Kê Tổng Quan",
      href: "/admin",
      icon: FaChartLine,
      exact: true,
    },
    {
      label: "Quản Lý Người Dùng",
      href: "/admin/users",
      icon: FaUsers,
    },
    {
      label: "Quản Trị Models Giọng",
      href: "/admin/voices",
      icon: FaDatabase,
    },
    {
      label: "Hàng Đợi & RAM Simulator",
      href: "/admin/concurrency",
      icon: FaLayerGroup,
    },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r border-gray-200/80 bg-white flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Nhóm Creator */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Không gian Creator
          </p>
          <nav className="space-y-1">
            {creatorNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              if (item.disabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-sm" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`text-base ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-700 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Nhóm Quản Trị Viên (Chỉ hiển thị cho ADMIN) */}
        {isAdmin && (
          <div className="pt-2 border-t border-gray-100 animate-fadeIn">
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <FaShieldAlt className="text-xs" />
                <span>Quản Trị Hệ Thống</span>
              </p>
              <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                Admin
              </span>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-900 font-bold border border-amber-200/60 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`text-sm ${isActive ? "text-amber-600" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Engine status banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-950/10">
          <div className="flex items-center gap-2 mb-2">
            <FaRobot className="text-blue-400 text-base" />
            <span className="text-xs font-bold text-white">Engine: OmniVoice</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            K2-FSA Diffusion-LM 600+ ngôn ngữ. Tối ưu chạy trực tiếp trên GPU máy bạn.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/60 pt-2">
            <span>Hardware Target:</span>
            <span className="font-semibold text-emerald-400">CUDA GPU</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-gray-400 text-center py-2 border-t border-gray-100">
        Video AI Platform v1.0.0
      </div>
    </aside>
  );
};
