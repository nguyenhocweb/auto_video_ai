"use client";

import React from "react";
import { FaClock, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { DubbingHistoryItem } from "@/src/features/creator/dubbing/type/dubbing.type";

interface DubbingStatusBadgeProps {
  item: DubbingHistoryItem;
}

export const DubbingStatusBadge: React.FC<DubbingStatusBadgeProps> = ({ item }) => {
  if (item.status === "pending") {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold w-fit">
          <FaClock className="text-amber-500 animate-pulse text-[10px]" /> Đang Chờ Hàng Đợi
        </span>
        <span className="text-[10px] text-gray-500">{item.progress_step || "Đang xếp hàng..."}</span>
      </div>
    );
  }

  if (item.status === "processing") {
    return (
      <div className="flex flex-col gap-1 min-w-[170px]">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold w-fit">
          <FaSpinner className="animate-spin text-blue-600 text-[10px]" />
          Đang Xử Lý ({item.progress_percent || 0}%)
        </span>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${item.progress_percent || 15}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-600 truncate">{item.progress_step}</span>
      </div>
    );
  }

  if (item.status === "completed") {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold w-fit">
          <FaCheckCircle className="text-emerald-500 text-[10px]" /> Hoàn Thành 100%
        </span>
        <span className="text-[10px] text-emerald-600">Đã lưu Cloudinary CDN</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 max-w-[200px]">
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold w-fit">
        <FaExclamationCircle className="text-red-500 text-[10px]" /> Thất Bại
      </span>
      <span className="text-[10px] text-red-500 truncate" title={item.error_message}>
        {item.error_message || "Lỗi xử lý"}
      </span>
    </div>
  );
};

