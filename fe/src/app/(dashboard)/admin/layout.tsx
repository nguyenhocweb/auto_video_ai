"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/src/core/components/auth/AuthGuard";
import { FaShieldAlt, FaChartLine, FaUsers, FaDatabase, FaLayerGroup } from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: "Tổng Quan Thống Kê", href: "/admin", icon: FaChartLine, exact: true },
    { label: "Quản Lý Người Dùng", href: "/admin/users", icon: FaUsers },
    { label: "Quản Trị Models Giọng AI", href: "/admin/voices", icon: FaDatabase },
    { label: "Cấu Hình Hàng Đợi & RAM", href: "/admin/concurrency", icon: FaLayerGroup },
  ];

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="space-y-6">
        {/* Banner Admin Top */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
              <FaShieldAlt />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight">
                  Super Admin Management Portal
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  Toàn Quyền
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Quản lý người dùng, phân quyền truy cập, giám sát tiến trình huấn luyện và toàn bộ models giọng nói AI.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className={isActive ? "text-amber-400" : "text-gray-400"} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        <div>{children}</div>
      </div>
    </AuthGuard>
  );
}

