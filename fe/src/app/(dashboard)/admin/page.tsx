"use client";

import React from "react";
import Link from "next/link";
import {
  FaUsers,
  FaDatabase,
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaServer,
  FaArrowRight,
} from "react-icons/fa";
import { useAdminStats } from "@/src/features/admin/hook/useAdminStats";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
          <p className="text-xs font-bold text-gray-500">Đang tải số liệu hệ thống...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng Người Dùng",
      value: stats?.users?.total ?? 0,
      subtext: `${stats?.users?.admins ?? 0} Admin • ${stats?.users?.creators ?? 0} Creator`,
      icon: FaUsers,
      color: "from-blue-600 to-indigo-600",
      link: "/admin/users",
    },
    {
      title: "Models Giọng AI",
      value: stats?.voices?.total ?? 0,
      subtext: "Hồ sơ embeddings & LoRA đã lưu",
      icon: FaDatabase,
      color: "from-emerald-600 to-teal-600",
      link: "/admin/voices",
    },
    {
      title: "Tiến Trình Huấn Luyện",
      value: stats?.training?.total_jobs ?? 0,
      subtext: `${stats?.training?.completed ?? 0} phiên hoàn tất • ${stats?.training?.running ?? 0} đang chạy`,
      icon: FaTasks,
      color: "from-purple-600 to-pink-600",
      link: "/creator/voice",
    },
    {
      title: "Hạ Tầng AI Local",
      value: stats?.system?.status ?? "OPERATIONAL",
      subtext: stats?.system?.engine ?? "OmniVoice Engine sẵn sàng",
      icon: FaServer,
      color: "from-amber-500 to-orange-600",
      link: "/creator/voice",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Cards Thống Kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center text-sm shadow-sm`}
                >
                  <Icon />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-gray-900 tracking-tight">
                  {card.value}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{card.subtext}</p>
              </div>

              <Link
                href={card.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <span>Xem chi tiết</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Thông tin bảo mật & phân quyền */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-emerald-500 text-lg" />
          <h3 className="text-sm font-extrabold text-gray-900">
            Cơ Chế Phân Quyền &amp; Bảo Mật RBAC Hoạt Động
          </h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Hệ thống đã kích hoạt xác thực JWT với PBKDF2 Password Hashing. Mọi endpoint nhạy cảm tại 
          <code className="mx-1 px-2 py-0.5 rounded bg-gray-100 text-slate-800 font-mono text-[11px]">/api/v1/admin/*</code> 
          đều bắt buộc token có vai trò <code className="mx-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">ADMIN</code>.
          Người dùng thường truy cập sẽ bị từ chối <strong>HTTP 403 Forbidden</strong>.
        </p>
      </div>
    </div>
  );
}
