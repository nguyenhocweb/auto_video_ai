"use client";

import React from "react";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { YouTubeChannelItem } from "@/src/features/creator/youtube/type/youtube.type";
import { FacebookPage } from "@/src/features/creator/facebook/type/facebook.type";

interface PublishChannelSelectorProps {
  platform: "youtube" | "facebook" | "tiktok";
  onSelectPlatform: (platform: "youtube" | "facebook" | "tiktok") => void;
  selectedChannelId: string;
  onSelectChannel: (channelId: string) => void;
  ytChannels: YouTubeChannelItem[];
  isLoadingYt: boolean;
  fbPages: FacebookPage[];
  isLoadingFb: boolean;
}

export const PublishChannelSelector: React.FC<PublishChannelSelectorProps> = ({
  platform,
  onSelectPlatform,
  selectedChannelId,
  onSelectChannel,
  ytChannels,
  isLoadingYt,
  fbPages,
  isLoadingFb,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Chọn Nền Tảng */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">1. Chọn Nền Tảng:</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onSelectPlatform("youtube")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
              platform === "youtube"
                ? "bg-red-50 border-red-500 text-red-600 shadow-xs"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaYoutube className="text-base" /> YouTube
          </button>

          <button
            type="button"
            onClick={() => onSelectPlatform("facebook")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
              platform === "facebook"
                ? "bg-blue-50 border-blue-500 text-blue-600 shadow-xs"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaFacebook className="text-base" /> Facebook
          </button>

          <button
            type="button"
            onClick={() => onSelectPlatform("tiktok")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
              platform === "tiktok"
                ? "bg-gray-900 border-gray-900 text-white shadow-xs"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <SiTiktok className="text-sm" /> TikTok
          </button>
        </div>
      </div>

      {/* 2. Chọn Kênh / Trang */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700">2. Chọn Kênh / Trang Đích:</label>
        {platform === "youtube" && (
          isLoadingYt ? (
            <div className="text-xs text-gray-400 py-2">Đang tải Kênh YouTube...</div>
          ) : ytChannels.length > 0 ? (
            <select
              value={selectedChannelId}
              onChange={(e) => onSelectChannel(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
            >
              {ytChannels.map((c) => (
                <option key={c.channel_id} value={c.channel_id}>
                  {c.channel_title} ({c.subscriber_count.toLocaleString()} subscribers)
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              Chưa có Kênh YouTube liên kết. Vui lòng kết nối tài khoản tại mục YouTube Shorts Studio.
            </div>
          )
        )}

        {platform === "facebook" && (
          isLoadingFb ? (
            <div className="text-xs text-gray-400 py-2">Đang tải Fanpage Facebook...</div>
          ) : fbPages.length > 0 ? (
            <select
              value={selectedChannelId}
              onChange={(e) => onSelectChannel(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              {fbPages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category || "Trang"})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              Chưa có Fanpage Facebook liên kết. Vui lòng cập nhật token tại Facebook Reels Studio.
            </div>
          )
        )}

        {platform === "tiktok" && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 flex items-center gap-2">
            <SiTiktok className="text-gray-900" /> Kênh TikTok mặc định của dự án
          </div>
        )}
      </div>
    </div>
  );
};
