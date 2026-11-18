"use client";

import React from "react";
import { SiTiktok } from "react-icons/si";
import { FaPlus, FaSyncAlt } from "react-icons/fa";
import { TikTokChannelItem } from "../type/tiktok.type";
import { TikTokChannelCard } from "./TikTokChannelCard";

interface TikTokChannelCardsListProps {
  channels: TikTokChannelItem[];
  selectedChannel: TikTokChannelItem | null;
  onSelectChannel: (channel: TikTokChannelItem) => void;
  isLoading: boolean;
  isFetching?: boolean;
  onRefresh: () => void;
  onConnect: () => void;
  isConnecting: boolean;
  onOpenPublish: (channel: TikTokChannelItem) => void;
  onOpenDisconnectConfirm: (channel: TikTokChannelItem) => void;
  isDisconnecting?: boolean;
}

export const TikTokChannelCardsList: React.FC<TikTokChannelCardsListProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  isLoading,
  isFetching = false,
  onRefresh,
  onConnect,
  isConnecting,
  onOpenPublish,
  onOpenDisconnectConfirm,
  isDisconnecting = false,
}) => {
  const loadingActive = isLoading || isFetching;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
            <SiTiktok />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Danh sách Kênh TikTok quản lý ({channels.length})
              </h2>
              {loadingActive && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
                  <FaSyncAlt className="animate-spin text-[10px]" />
                  Đang đồng bộ...
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nhấp vào một Kênh để xem chi tiết video, thông số tương tác và xuất bản video
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onConnect}
            disabled={isConnecting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FaPlus className="text-xs shrink-0" />
            <span>{isConnecting ? "Đang mở TikTok..." : "Thêm kênh TikTok mới"}</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loadingActive}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50 border border-gray-200/80 dark:border-gray-700"
          >
            <FaSyncAlt className={`text-xs ${loadingActive ? "animate-spin text-rose-500" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && channels.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/30">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold shadow-md shadow-black/10">
            <SiTiktok />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Chưa có kênh TikTok nào được liên kết</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Bấm &quot;Thêm kênh TikTok mới&quot; để kết nối tài khoản TikTok Open API của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {channels.map((ch) => (
            <TikTokChannelCard
              key={ch.channel_id}
              channel={ch}
              isSelected={selectedChannel?.channel_id === ch.channel_id}
              onSelect={onSelectChannel}
              onOpenPublish={onOpenPublish}
              onOpenDisconnectConfirm={onOpenDisconnectConfirm}
              isDisconnecting={isDisconnecting}
            />
          ))}
        </div>
      )}
    </div>
  );
};
