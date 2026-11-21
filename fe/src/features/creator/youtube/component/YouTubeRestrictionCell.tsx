"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaBan, FaGlobeAmericas } from "react-icons/fa";

interface YouTubeRestrictionCellProps {
  restriction?: string;
  detail?: string;
}

export const YouTubeRestrictionCell: React.FC<YouTubeRestrictionCellProps> = ({
  restriction = "none",
  detail,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isNone = !restriction || restriction === "none";
  const isCopyright = restriction === "copyright" || restriction === "claim";
  const isRegion = restriction === "region_blocked";
  const isRejected = restriction === "rejected";

  const title = isNone
    ? "Không có thông báo"
    : isCopyright
    ? "Khiếu nại về bản quyền"
    : isRegion
    ? "Hạn chế vùng phát sóng"
    : "Bị từ chối xuất bản";

  const description =
    detail ||
    (isNone
      ? "Video này đang tiếp cận người xem và kiếm tiền theo chế độ cài đặt của bạn"
      : isCopyright
      ? "Video bị hạn chế hiển thị hoặc chia sẻ doanh thu do Content ID/Bản quyền âm thanh."
      : isRegion
      ? "Video bị chặn phát tại một số quốc gia do bản quyền phân phối."
      : "Video bị từ chối phê duyệt trên YouTube.");

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="cursor-pointer py-1 px-1.5 rounded-md hover:bg-gray-100 flex items-center gap-1.5 transition-colors">
        {isNone ? (
          <span className="text-gray-400 font-bold text-xs select-none">—</span>
        ) : isCopyright ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
            <FaBan className="text-[9px]" /> Khiếu nại bản quyền
          </span>
        ) : isRegion ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <FaGlobeAmericas className="text-[9px]" /> Hạn chế vùng
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <FaExclamationCircle className="text-[9px]" /> Bị từ chối
          </span>
        )}
      </div>

      {/* Tooltip Card mô phỏng chính xác YouTube Studio */}
      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 z-50 w-72 p-3.5 bg-white rounded-xl shadow-xl border border-gray-200/90 text-xs text-gray-800 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5 mb-1">
            {isNone ? (
              <FaCheckCircle className="text-emerald-500 text-[11px]" />
            ) : isCopyright ? (
              <FaBan className="text-red-500 text-[11px]" />
            ) : (
              <FaExclamationCircle className="text-amber-500 text-[11px]" />
            )}
            <span>{title}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-600">
            {description}
          </p>
          <div className="absolute left-4 top-full w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
};
