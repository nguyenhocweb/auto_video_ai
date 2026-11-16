"use client";

import React from "react";
import Image from "next/image";
import { FaCheck, FaFacebook, FaFlag, FaVideo, FaFileAlt } from "react-icons/fa";
import { useFacebookPages } from "@/src/features/creator/facebook/hook/useFacebookPages";
import { TargetPageConfig } from "../type/automation.type";

interface TargetPageSelectorProps {
  selectedPages: TargetPageConfig[];
  onChange: (pages: TargetPageConfig[]) => void;
  postType?: "reel" | "feed";
  onChangePostType?: (val: "reel" | "feed") => void;
}

export const TargetPageSelector: React.FC<TargetPageSelectorProps> = ({
  selectedPages,
  onChange,
  postType = "reel",
  onChangePostType,
}) => {
  const { data: pages = [], isLoading } = useFacebookPages();

  const isSelected = (pageId: string) => selectedPages.some((p) => p.page_id === pageId);

  const toggleSelect = (p: { id: string; name: string; access_token?: string }) => {
    if (isSelected(p.id)) {
      onChange(selectedPages.filter((page) => page.page_id !== p.id));
    } else {
      onChange([
        ...selectedPages,
        {
          page_id: p.id,
          page_name: p.name,
          access_token: p.access_token,
        },
      ]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <FaFacebook className="text-blue-600" /> Chọn Fanpage Facebook đăng tự động:
        </label>
        <span className="text-[11px] font-semibold text-blue-600">
          Đã chọn: {selectedPages.length} trang
        </span>
      </div>

      {/* Tùy chọn đăng Thước phim (Reels) vs Bài viết (Feed) */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100/90 rounded-xl border border-gray-200/60">
          <button
            type="button"
            onClick={() => onChangePostType?.("reel")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              postType === "reel"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <FaVideo className="text-[10px]" />
            Thước phim (Reels)
          </button>
          <button
            type="button"
            onClick={() => onChangePostType?.("feed")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              postType === "feed"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <FaFileAlt className="text-[10px]" />
            Bài viết (Feed)
          </button>
        </div>
        <p className="text-[10px] text-gray-400 italic px-1">
          {postType === "feed"
            ? "*Bài viết (Feed): Đăng video lên bảng tin trang Fanpage."
            : "*Thước phim (Reels): Đăng video vào mục Facebook Reels tự động."}
        </p>
      </div>

      {isLoading ? (
        <div className="text-xs text-gray-400 py-2">Đang tải danh sách Fanpage...</div>
      ) : pages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 border border-gray-200 rounded-xl">
          {pages.map((p) => {
            const active = isSelected(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleSelect(p)}
                className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                  active
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 relative">
                  {p.picture_url ? (
                    <Image
                      src={p.picture_url}
                      alt={p.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 text-xs">
                      <FaFlag />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">
                    ID: {p.id} • {p.category || "Fanpage"}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 ${
                    active ? "bg-blue-600 text-white" : "border border-gray-300 text-transparent"
                  }`}
                >
                  <FaCheck className="text-[9px]" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-gray-500 bg-amber-50 p-3 rounded-xl border border-amber-200">
          Chưa tìm thấy Fanpage nào. Vui lòng vào trang <strong>Facebook Reels Studio</strong> để kết nối Facebook User Access Token trước!
        </div>
      )}
    </div>
  );
};

