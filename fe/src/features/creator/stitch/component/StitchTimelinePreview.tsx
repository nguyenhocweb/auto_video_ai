"use client";

import React from "react";
import { FaCut, FaPlay, FaRandom, FaMagic } from "react-icons/fa";

interface StitchTimelinePreviewProps {
  hookDuration: number;
  bodySkipStart: number;
  transitionDuration?: number;
}

export const StitchTimelinePreview: React.FC<StitchTimelinePreviewProps> = ({
  hookDuration,
  bodySkipStart,
  transitionDuration = 1.2,
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-pink-50/40 rounded-xl border border-blue-100">
      <div className="text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <FaMagic className="text-blue-600" /> Mô Phỏng Cấu Trúc Video Sau Khi Ghép:
        </span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
          Chuyển cảnh xfade (Mờ dần chậm {transitionDuration}s)
        </span>
      </div>
      <div className="flex h-10 rounded-lg overflow-hidden border border-gray-300 font-bold text-xs text-white">
        <div
          style={{ width: `${Math.min(35, Math.max(15, hookDuration * 6))}%` }}
          className="bg-blue-600 flex items-center justify-center gap-1.5 px-2 truncate transition-all shadow-inner"
        >
          <FaCut className="text-[10px]" /> [Nguồn 1] 0s → {hookDuration}s
        </div>
        <div className="w-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
          <FaRandom className="text-[9px] animate-pulse" />
        </div>
        <div className="flex-1 bg-purple-600 flex items-center justify-center gap-1.5 px-2 truncate transition-all shadow-inner">
          <FaPlay className="text-[10px]" /> [Nguồn 2] Bỏ {bodySkipStart}s đầu → Đến Hết Video
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-gray-500 mt-1.5 px-0.5">
        <span>Khởi đầu (0s)</span>
        <span className="text-indigo-600 font-bold">
          Chuyển cảnh mờ dần chậm rãi {transitionDuration}s (êm dịu &amp; mượt mà)
        </span>
        <span>Kết thúc</span>
      </div>
    </div>
  );
};
