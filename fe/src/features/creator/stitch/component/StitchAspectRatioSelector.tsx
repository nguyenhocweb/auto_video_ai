"use client";

import React from "react";
import { FaMobileAlt, FaTv } from "react-icons/fa";

interface StitchAspectRatioSelectorProps {
  value: "9:16" | "16:9";
  onChange: (val: "9:16" | "16:9") => void;
  disabled?: boolean;
}

export const StitchAspectRatioSelector: React.FC<StitchAspectRatioSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
        Tỷ Lệ Khung Hình Video (Aspect Ratio)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("9:16")}
          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
            value === "9:16"
              ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-950 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${
              value === "9:16" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <FaMobileAlt />
          </div>
          <div>
            <div className="text-xs font-bold">9:16 (Video Dọc 1080x1920)</div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Chuẩn Shorts, TikTok, Facebook Reels. Tự động lót nền mờ (Blurred BG) nếu video nguồn 16:9, triệt tiêu viền đen.
            </div>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("16:9")}
          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
            value === "16:9"
              ? "border-purple-500 bg-purple-50/70 ring-2 ring-purple-500/20 text-purple-950 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm ${
              value === "16:9" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <FaTv />
          </div>
          <div>
            <div className="text-xs font-bold">16:9 (Video Ngang 1920x1080)</div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Chuẩn YouTube Video dài, Facebook Feed. Tự động lót nền mờ (Blurred BG) nếu video nguồn 9:16, triệt tiêu viền đen.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
