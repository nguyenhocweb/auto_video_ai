"use client";

import React from "react";
import Image from "next/image";
import { FaUsers, FaVideo, FaExternalLinkAlt, FaPlus, FaYoutube, FaEnvelope } from "react-icons/fa";
import { YouTubeChannelItem } from "../type/youtube.type";

interface YouTubeStatsOverviewProps {
  channel: YouTubeChannelItem | null;
  onOpenPublishModal: () => void;
  videoCount: number;
}

export const YouTubeStatsOverview: React.FC<YouTubeStatsOverviewProps> = ({
  channel,
  onOpenPublishModal,
  videoCount,
}) => {
  if (!channel) return null;

  const channelUrl = channel.custom_url
    ? `https://www.youtube.com/${channel.custom_url}`
    : `https://www.youtube.com/channel/${channel.channel_id}`;

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl p-6 text-white shadow-lg shadow-red-500/15 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Thông tin kênh */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/40 shadow-inner shrink-0 relative flex items-center justify-center">
            {channel.avatar_url ? (
              <Image
                src={channel.avatar_url}
                alt={channel.channel_title}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <FaYoutube className="text-3xl text-white" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">{channel.channel_title}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Liên Kết Vĩnh Viễn
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-red-100/90 mt-1">
              <span>
                Handle: <code className="font-mono bg-black/20 px-1.5 py-0.5 rounded text-white">{channel.custom_url || channel.channel_id}</code>
              </span>
              {channel.google_email && (
                <span className="inline-flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-white/95" title={`Tài khoản Google: ${channel.google_email}`}>
                  <FaEnvelope className="text-[10px] text-emerald-300" />
                  <span>{channel.google_email}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nút thao tác */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all shadow-xs"
          >
            <FaExternalLinkAlt className="text-[11px] shrink-0" />
            <span className="truncate">Mở Kênh YouTube</span>
          </a>

          <button
            type="button"
            onClick={onOpenPublishModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <FaPlus className="text-xs shrink-0" />
            <span className="truncate">Đăng Shorts Mới</span>
          </button>
        </div>
      </div>

      {/* Grid thống kê 3 thẻ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15">
        <div className="bg-black/15 backdrop-blur-xs rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-red-100 text-xs font-medium">
            <FaUsers className="text-sm opacity-80" />
            <span>Người Đăng Ký</span>
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            {channel.subscriber_count.toLocaleString()}
          </div>
        </div>

        <div className="bg-black/15 backdrop-blur-xs rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-red-100 text-xs font-medium">
            <FaVideo className="text-sm opacity-80" />
            <span>Video &amp; Shorts</span>
          </div>
          <div className="text-xl sm:text-2xl font-black mt-1">
            {videoCount > 0 ? videoCount : channel.video_count}
          </div>
        </div>

        <div className="bg-black/15 backdrop-blur-xs rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-red-100 text-xs font-medium">
            <FaYoutube className="text-sm opacity-80" />
            <span>Chế Độ Xuất Bản</span>
          </div>
          <div className="text-sm font-bold mt-1.5 text-emerald-200">
            Tự động gắn #shorts 100%
          </div>
        </div>
      </div>
    </div>
  );
};

