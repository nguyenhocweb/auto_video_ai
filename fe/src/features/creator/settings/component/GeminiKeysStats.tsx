"use client";

import React from "react";
import { FaKey, FaCheckCircle, FaExchangeAlt, FaExclamationTriangle } from "react-icons/fa";
import { GeminiKeyItem } from "../type/gemini-key.type";

interface GeminiKeysStatsProps {
  keys: GeminiKeyItem[];
}

export const GeminiKeysStats: React.FC<GeminiKeysStatsProps> = ({ keys }) => {
  const total = keys.length;
  const activeCount = keys.filter((k) => k.is_active).length;
  const totalUsage = keys.reduce((acc, k) => acc + (k.usage_count || 0), 0);
  const totalErrors = keys.reduce((acc, k) => acc + (k.error_count || 0), 0);

  const stats = [
    {
      title: "Tổng số Gemini Keys",
      value: total,
      subtext: "Lưu trữ bảo mật trong Database",
      icon: FaKey,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Keys Đang Kích Hoạt",
      value: activeCount,
      subtext: activeCount > 0 ? "Xoay tua tự động khi dịch" : "Cần ít nhất 1 Key",
      icon: FaCheckCircle,
      color: activeCount > 0 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Lượt Dịch Phim Hoàn Tất",
      value: totalUsage,
      subtext: "Số lần dịch kịch bản thành công",
      icon: FaExchangeAlt,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Giới Hạn 429 Được Cứu",
      value: totalErrors,
      subtext: "Đã tự động đổi sang Key khác",
      icon: FaExclamationTriangle,
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {item.title}
              </p>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{item.value}</h3>
              <p className="text-xs text-gray-500">{item.subtext}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color}`}>
              <Icon className="text-lg" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

