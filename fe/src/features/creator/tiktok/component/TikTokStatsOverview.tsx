"use client";

import React from "react";
import { FaUsers, FaHeart, FaVideo, FaExternalLinkAlt, FaPlus, FaEye } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { TikTokChannelItem } from "../type/tiktok.type";

interface TikTokStatsOverviewProps {
  channel: TikTokChannelItem | null;
  onOpenPublishModal: () => void;
  videoCount: number;
}

export const TikTokStatsOverview: React.FC<TikTokStatsOverviewProps> = ({
  channel,
  onOpenPublishModal,
  videoCount,
}) => {
  if (!channel) return null;

  return (
    <div className="bg-gradient-to-r from-gray-950 via-neutral-900 to-black rounded-2xl p-6 text-white shadow-xl shadow-black/15 space-y-5 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 shadow-inner shrink-0 flex items-center justify-center">
            {channel.avatar_url ? (
              <img
                src={channel.avatar_url}
                alt={channel.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold bg-neutral-800">
                <SiTiktok />
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">{channel.display_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-gray-200 backdrop-blur-sm">
                {channel.username ? `@${channel.username}` : "Creator TikTok"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Đang kết nối
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Channel ID:{" "}
              <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-200">
                {channel.channel_id}
              </code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full sm:w-auto">
          {channel.username && (
            <a
              href={`https://www.tiktok.com/@${channel.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors border border-white/15"
            >
              <FaExternalLinkAlt className="text-[11px] shrink-0" />
              <span className="truncate">Mở TikTok</span>
            </a>
          )}

          <button
            type="button"
            onClick={onOpenPublishModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-100 shadow-md shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <FaPlus className="text-xs shrink-0 text-rose-500" />
            <span className="truncate">1-Click Đăng Video</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <FaUsers className="text-sm text-blue-400" />
            <span>Người theo dõi</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {(channel.follower_count || 0).toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <FaHeart className="text-sm text-rose-400" />
            <span>Lượt thích Kênh</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {(channel.likes_count || 0).toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <FaVideo className="text-sm text-emerald-400" />
            <span>Video trên kênh</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {(channel.video_count || 0).toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <FaEye className="text-sm text-amber-400" />
            <span>Video đã đồng bộ</span>
          </div>
          <p className="text-xl font-black mt-1 text-white">
            {videoCount.toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
};
