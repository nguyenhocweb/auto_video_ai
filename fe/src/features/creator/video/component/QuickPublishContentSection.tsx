"use client";

import React from "react";
import { FaLanguage, FaMagic, FaSpinner, FaHashtag } from "react-icons/fa";

interface QuickPublishContentSectionProps {
  title: string;
  setTitle: (val: string) => void;
  caption: string;
  setCaption: (val: string) => void;
  isTranslating: boolean;
  onTranslateAll: () => void;
  onTranslateTitle: () => void;
  onTranslateCaption: () => void;
  onAddHashtag: (tag: string) => void;
}

const POPULAR_HASHTAGS = [
  "#reels",
  "#shorts",
  "#viral",
  "#xuhuong",
  "#phimhay",
  "#reviewphim",
  "#phimtrungquoc",
];

export const QuickPublishContentSection: React.FC<QuickPublishContentSectionProps> = ({
  title,
  setTitle,
  caption,
  setCaption,
  isTranslating,
  onTranslateAll,
  onTranslateTitle,
  onTranslateCaption,
  onAddHashtag,
}) => {
  return (
    <div className="space-y-3 pt-2 border-t border-gray-100">
      {/* Header bar cho phần Nội dung kèm nút Dịch AI toàn bộ */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Nội Dung Bài Đăng & Video
        </span>
        <button
          type="button"
          disabled={isTranslating}
          onClick={onTranslateAll}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Dịch tự động cả Tiêu đề và Mô tả sang tiếng Việt"
        >
          {isTranslating ? (
            <>
              <FaSpinner className="animate-spin text-[10px]" />
              <span>Đang dịch AI...</span>
            </>
          ) : (
            <>
              <FaLanguage className="text-xs text-indigo-600" />
              <span>✨ Dịch Sang Tiếng Việt</span>
            </>
          )}
        </button>
      </div>

      {/* Phần Tiêu Đề */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-700">
            Tiêu Đề Video (YouTube Shorts & Tiêu đề bài viết Facebook):
          </label>
          <button
            type="button"
            disabled={isTranslating || !title}
            onClick={onTranslateTitle}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 hover:underline disabled:opacity-40"
            title="Chỉ dịch tiêu đề này"
          >
            <FaMagic className="text-[9px]" /> Dịch tiêu đề
          </button>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề video..."
          className="w-full text-xs text-gray-900 bg-white border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* Phần Mô Tả & Hashtags */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-700">
            Nội Dung Mô Tả & Hashtags:
          </label>
          <button
            type="button"
            disabled={isTranslating || !caption}
            onClick={onTranslateCaption}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 hover:underline disabled:opacity-40"
            title="Chỉ dịch nội dung mô tả (giữ nguyên hashtags)"
          >
            <FaMagic className="text-[9px]" /> Dịch mô tả
          </button>
        </div>
        <textarea
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Mô tả nội dung, trích dẫn phim và gắn hashtags..."
          className="w-full text-xs text-gray-900 bg-white border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />

        {/* Danh sách Hashtags gợi ý */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <FaHashtag className="text-[10px]" /> Gợi ý:
          </span>
          {POPULAR_HASHTAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onAddHashtag(tag)}
              className="px-2 py-0.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[10px] text-gray-600 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
