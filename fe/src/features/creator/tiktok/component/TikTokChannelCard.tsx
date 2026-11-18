"use client";

import React from "react";
import { SiTiktok } from "react-icons/si";
import { FaTrash, FaPlus, FaCheckCircle, FaUsers, FaHeart } from "react-icons/fa";
import { TikTokChannelItem } from "../type/tiktok.type";

interface TikTokChannelCardProps {
  channel: TikTokChannelItem;
  isSelected: boolean;
  onSelect: (channel: TikTokChannelItem) => void;
  onOpenPublish: (channel: TikTokChannelItem) => void;
  onOpenDisconnectConfirm: (channel: TikTokChannelItem) => void;
  isDisconnecting?: boolean;
}

export const TikTokChannelCard: React.FC<TikTokChannelCardProps> = ({
  channel,
  isSelected,
  onSelect,
  onOpenPublish,
  onOpenDisconnectConfirm,
  isDisconnecting = false,
}) => {
  return (
    <div
      onClick={() => onSelect(channel)}
      className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? "border-black dark:border-rose-500 bg-gray-50/70 dark:bg-gray-800/40 shadow-sm ring-2 ring-black/10 dark:ring-rose-500/20"
          : "border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50/40 dark:hover:bg-gray-800/20 hover:shadow-sm"
      }`}
    >
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center">
            {channel.avatar_url ? (
              <img
                src={channel.avatar_url}
                alt={channel.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-black font-bold">
                <SiTiktok />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-rose-600 transition-colors">
                {channel.display_name}
              </h3>
              {isSelected && (
                <FaCheckCircle className="text-black dark:text-rose-500 text-sm shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-gray-400 truncate">
                {channel.username ? `@${channel.username}` : `ID: ${channel.channel_id.slice(0, 10)}...`}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Đang kết nối
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 font-medium bg-gray-100/80 dark:bg-gray-800 px-2 py-0.5 rounded-md text-[11px]">
                <FaUsers className="text-gray-400 text-[10px]" />
                {(channel.follower_count || 0).toLocaleString("vi-VN")}
              </span>
              <span className="inline-flex items-center gap-1 font-medium bg-gray-100/80 dark:bg-gray-800 px-2 py-0.5 rounded-md text-[11px]">
                <FaHeart className="text-rose-500 text-[10px]" />
                {(channel.likes_count || 0).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPublish(channel);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FaPlus className="text-[10px]" />
          Đăng Video
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDisconnectConfirm(channel);
          }}
          disabled={isDisconnecting}
          title="Hủy liên kết kênh này"
          className="p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FaTrash className="text-[11px]" />
        </button>
      </div>
    </div>
  );
};
