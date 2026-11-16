"use client";

import React from "react";
import { FaUsers, FaThumbsUp, FaExternalLinkAlt, FaPlus, FaVideo } from "react-icons/fa";
import { FacebookPage } from "../type/facebook.type";

interface PageStatsOverviewProps {
  page: FacebookPage | null;
  onOpenPublishModal: () => void;
  videoCount: number;
  postCount: number;
  isTokenValid?: boolean;
}

export const PageStatsOverview: React.FC<PageStatsOverviewProps> = ({
  page,
  onOpenPublishModal,
  videoCount,
  postCount,
  isTokenValid = true,
}) => {
  if (!page) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/10 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 border-2 border-white/40 shadow-inner shrink-0">
            {page.picture_url ? (
              <img
                src={page.picture_url}
                alt={page.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {page.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{page.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-blue-100 backdrop-blur-sm">
                {page.category || "Phim & Giải trí"}
              </span>
              {isTokenValid ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  Đang kết nối
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/30 text-rose-100 border border-rose-400/40 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-rose-400 inline-block"></span>
                  Token hết hạn
                </span>
              )}
            </div>
            <p className="text-xs text-blue-100/80 mt-1">
              Page ID: <code className="font-mono bg-black/20 px-1.5 py-0.5 rounded text-white">{page.id}</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full sm:w-auto">
          <a
            href={`https://www.facebook.com/${page.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors border border-white/20"
          >
            <FaExternalLinkAlt className="text-[11px] shrink-0" />
            <span className="truncate">Mở Facebook</span>
          </a>

          <button
            type="button"
            onClick={onOpenPublishModal}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-blue-600 hover:bg-blue-50 shadow-md shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaPlus className="text-xs shrink-0" />
            <span className="truncate">1-Click Đăng Reels</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-blue-200 text-xs">
            <FaUsers className="text-sm" />
            <span>Người theo dõi</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {page.followers_count.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-blue-200 text-xs">
            <FaThumbsUp className="text-sm" />
            <span>Lượt thích Trang</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {page.fan_count.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-blue-200 text-xs">
            <FaVideo className="text-sm" />
            <span>Video & Reels</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {videoCount.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-blue-200 text-xs">
            <span>Tổng bài viết</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {postCount.toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
};

