"use client";

import React from "react";
import { FaHashtag } from "react-icons/fa";

interface HashtagConfigSectionProps {
  autoAddTag: boolean;
  onChangeAutoAdd: (val: boolean) => void;
  hashtags: string;
  onChangeHashtags: (val: string) => void;
}

export const HashtagConfigSection: React.FC<HashtagConfigSectionProps> = ({
  autoAddTag,
  onChangeAutoAdd,
  hashtags,
  onChangeHashtags,
}) => {
  return (
    <div className="space-y-2">
      <label className="block font-bold text-gray-800 text-xs">
        Tiêu đề bài đăng & Hashtags:
      </label>
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
        <div className="text-gray-500 text-[11px]">
          Mặc định tiêu đề bài đăng sẽ tự động lấy <strong>tên video sau khi dịch sang tiếng Việt</strong>.
        </div>

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

        <div>
          <label className="block text-[11px] text-gray-600 mb-1">
            Hashtags bổ sung thêm vào cuối bài:
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => onChangeHashtags(e.target.value)}
            placeholder="#Douyin #Reels #Shorts #Viral"
            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg outline-none text-xs"
          />
        </div>
      </div>
    </div>
  );
};

