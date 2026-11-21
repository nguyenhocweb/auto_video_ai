"use client";

import React from "react";
import { FaHashtag, FaListOl, FaLanguage, FaEye } from "react-icons/fa";

interface HashtagConfigSectionProps {
  titleMode?: "auto_number" | "original_title";
  onChangeTitleMode?: (val: "auto_number" | "original_title") => void;
  titlePrefix?: string;
  onChangeTitlePrefix?: (val: string) => void;
  autoAddTag: boolean;
  onChangeAutoAdd: (val: boolean) => void;
  hashtags: string;
  onChangeHashtags: (val: string) => void;
}

export const HashtagConfigSection: React.FC<HashtagConfigSectionProps> = ({
  titleMode = "auto_number",
  onChangeTitleMode,
  titlePrefix = "Bài đăng",
  onChangeTitlePrefix,
  autoAddTag,
  onChangeAutoAdd,
  hashtags,
  onChangeHashtags,
}) => {
  const isAutoNumber = titleMode === "auto_number";
  const cleanPrefix = (titlePrefix || "Bài đăng").trim();
  const sampleTitle = isAutoNumber
    ? `${cleanPrefix} 1 ${hashtags}`.trim()
    : `Tên video dịch ${hashtags}`.trim();

  return (
    <div className="space-y-2">
      <label className="block font-bold text-gray-800 text-xs">
        Tiêu đề bài đăng &amp; Hashtags:
      </label>
      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
        {/* Chọn kiểu đặt tiêu đề */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
            Quy cách đặt tiêu đề bài đăng (YouTube Shorts &amp; Facebook Reels):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeTitleMode?.("auto_number")}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                isAutoNumber
                  ? "border-blue-500 bg-blue-50/50 text-blue-900 ring-1 ring-blue-500/20"
                  : "border-gray-200 bg-white hover:bg-gray-100/80 text-gray-700"
              }`}
            >
              <FaListOl className={`text-xs mt-0.5 shrink-0 ${isAutoNumber ? "text-blue-600" : "text-gray-400"}`} />
              <div>
                <p className="font-bold text-[11px]">Đánh số bài đăng (Khuyên dùng)</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Ghi rõ Bài đăng 1, Bài đăng 2... Không lấy tên Douyin rác tránh trùng lặp
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChangeTitleMode?.("original_title")}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                !isAutoNumber
                  ? "border-blue-500 bg-blue-50/50 text-blue-900 ring-1 ring-blue-500/20"
                  : "border-gray-200 bg-white hover:bg-gray-100/80 text-gray-700"
              }`}
            >
              <FaLanguage className={`text-xs mt-0.5 shrink-0 ${!isAutoNumber ? "text-blue-600" : "text-gray-400"}`} />
              <div>
                <p className="font-bold text-[11px]">Dịch tên video Douyin</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Lấy tiêu đề gốc tiếng Trung sau khi dịch tự động sang tiếng Việt
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Tiền tố tiêu đề khi dùng auto_number */}
        {isAutoNumber ? (
          <div>
            <label className="block text-[11px] text-gray-600 mb-1">
              Tiền tố bài đăng (sẽ tự động tăng số: {cleanPrefix} 1, {cleanPrefix} 2...):
            </label>
            <input
              type="text"
              value={titlePrefix}
              onChange={(e) => onChangeTitlePrefix?.(e.target.value)}
              placeholder="Bài đăng"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg outline-none text-xs font-medium"
            />
          </div>
        ) : (
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={autoAddTag}
              onChange={(e) => onChangeAutoAdd(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1">
              <FaHashtag className="text-blue-500" /> Tự động thêm hashtag theo tên video đã dịch (vd: #Tap7NgayTanThe)
            </span>
          </label>
        )}

        {/* Hashtags bổ sung */}
        <div>
          <label className="block text-[11px] text-gray-600 mb-1">
            Hashtags bổ sung (hiển thị trực tiếp vào tiêu đề YouTube Shorts &amp; bài đăng):
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => onChangeHashtags(e.target.value)}
            placeholder="#Shorts #Reels #Viral #Douyin"
            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg outline-none text-xs font-medium"
          />
        </div>

        {/* Live Preview */}
        <div className="pt-2 border-t border-gray-200/80">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
            <FaEye className="text-gray-400" />
            <span>Xem trước tiêu đề hiển thị trên YouTube Shorts:</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-900 font-bold text-xs truncate">
            {sampleTitle || "Bài đăng 1 #Shorts #Reels #Viral #Douyin"}
          </div>
        </div>
      </div>
    </div>
  );
};

