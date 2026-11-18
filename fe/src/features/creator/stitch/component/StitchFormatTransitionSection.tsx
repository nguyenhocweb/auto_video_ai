"use client";

import React from "react";
import { FaMobileAlt, FaTv, FaRandom } from "react-icons/fa";

interface StitchFormatTransitionSectionProps {
  aspectRatio: "9:16" | "16:9";
  onChangeAspectRatio: (ratio: "9:16" | "16:9") => void;
  transitionDuration: number;
  onChangeTransitionDuration: (sec: number) => void;
  disabled?: boolean;
}

export const StitchFormatTransitionSection: React.FC<StitchFormatTransitionSectionProps> = ({
  aspectRatio,
  onChangeAspectRatio,
  transitionDuration,
  onChangeTransitionDuration,
  disabled = false,
}) => {
  return (
    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80 space-y-3.5">
      {/* 1. Tỷ lệ khung hình */}
      <div>
        <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-1.5">
          <FaMobileAlt className="text-indigo-600" />
          <span>4. Tỷ lệ khung hình video xuất bản:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChangeAspectRatio("9:16")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              aspectRatio === "9:16"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                aspectRatio === "9:16" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaMobileAlt />
            </div>
            <div>
              <div className="text-xs font-bold">9:16 (Video Dọc 1080x1920)</div>
              <div
                className={`text-[10px] mt-0.5 leading-tight ${
                  aspectRatio === "9:16" ? "text-indigo-100" : "text-gray-400"
                }`}
              >
                Chuẩn Shorts, TikTok, Facebook Reels. Tự động lót nền mờ (Blurred BG) nếu video nguồn 16:9.
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onChangeAspectRatio("16:9")}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
              aspectRatio === "16:9"
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                aspectRatio === "16:9" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaTv />
            </div>
            <div>
              <div className="text-xs font-bold">16:9 (Video Ngang 1920x1080)</div>
              <div
                className={`text-[10px] mt-0.5 leading-tight ${
                  aspectRatio === "16:9" ? "text-purple-100" : "text-gray-400"
                }`}
              >
                Chuẩn YouTube Video dài, Facebook Feed. Tự động lót nền mờ (Blurred BG) nếu video nguồn 9:16.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Tốc độ chuyển cảnh xfade */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/80 space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-gray-800">
          <span className="flex items-center gap-1.5 text-indigo-700">
            <FaRandom className="text-[11px]" /> Tốc độ chuyển cảnh xfade (Mờ dần Video 1 → Hiện Video 2):
          </span>
          <span className="text-indigo-600 font-black text-xs">
            {transitionDuration}s ({transitionDuration >= 1.2 ? "Chậm & Mượt" : "Nhanh"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[0.8, 1.2, 1.6, 2.0].map((sec) => (
            <button
              key={sec}
              type="button"
              disabled={disabled}
              onClick={() => onChangeTransitionDuration(sec)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                transitionDuration === sec
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {sec}s {sec === 1.2 && "(Chuẩn)"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400">
          💡 Tốc độ 1.2s giúp đoạn Hook mờ dần chậm rãi và video chính hiện lên êm dịu, không gây cảm giác giật hình.
        </p>
      </div>
    </div>
  );
};
