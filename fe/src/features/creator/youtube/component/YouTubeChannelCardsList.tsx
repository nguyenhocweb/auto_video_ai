"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaYoutube,
  FaUsers,
  FaVideo,
  FaCheckCircle,
  FaSyncAlt,
  FaPlus,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaUserPlus,
  FaEnvelope,
} from "react-icons/fa";
import { YouTubeChannelItem } from "../type/youtube.type";
import { useConnectYouTube } from "../hook/useConnectYouTube";
import { useDisconnectYouTubeChannel } from "../hook/useDisconnectYouTubeChannel";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

interface YouTubeChannelCardsListProps {
  channels: YouTubeChannelItem[];
  selectedChannel: YouTubeChannelItem | null;
  onSelectChannel: (channel: YouTubeChannelItem) => void;
  isLoading: boolean;
  isFetching?: boolean;
  onRefresh: () => void;
}

export const YouTubeChannelCardsList: React.FC<YouTubeChannelCardsListProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  isLoading,
  isFetching = false,
  onRefresh,
}) => {
  const connectMutation = useConnectYouTube();
  const disconnectMutation = useDisconnectYouTubeChannel();
  const [channelToDelete, setChannelToDelete] = useState<YouTubeChannelItem | null>(null);

  const showSyncBadge = isLoading || (isFetching && channels.length > 0);
  const audienceUrl = "https://console.cloud.google.com/auth/audience?project=auto-video-514004";

  const handleConfirmDelete = () => {
    if (!channelToDelete) return;
    disconnectMutation.mutate(channelToDelete.channel_id, {
      onSettled: () => setChannelToDelete(null),
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg shadow-xs shrink-0 mt-0.5">
              <FaYoutube />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-gray-900">
                  Danh sách Kênh YouTube Shorts ({channels.length})
                </h2>
                {showSyncBadge && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
                    <FaSyncAlt className="animate-spin text-[10px]" />
                    Đang đồng bộ...
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Nhấp vào một Kênh để xem danh sách video, thống kê và đăng Shorts 1-Click
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading || isFetching}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <FaSyncAlt className={`text-xs ${isFetching ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
            <button
              type="button"
              onClick={() => connectMutation.mutate()}
              disabled={connectMutation.isPending}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FaPlus className="text-xs shrink-0" />
              <span className="truncate">Thêm Kênh Mới</span>
            </button>
          </div>
        </div>

        {/* Channels List */}
        {channels.length === 0 ? (
          <div className="text-center py-7 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl">
              <FaYoutube />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Chưa có Kênh YouTube nào được liên kết</p>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Bấm nút &quot;Thêm Kênh YouTube Mới&quot; ở trên để đăng nhập Google OAuth và cấp quyền cho kênh của bạn.
              </p>
            </div>

            {/* Banner hướng dẫn thêm Test User để tránh lỗi 403 */}
            <div className="max-w-xl mx-auto p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl text-left text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <FaUserPlus className="text-amber-600 shrink-0" />
                <span>Gặp lỗi 403: access_denied khi đăng nhập?</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Google yêu cầu thêm Gmail của bạn vào danh sách <strong>Test users</strong>. Nhấp vào liên kết bên dưới để thêm email của bạn chỉ trong 10 giây:
              </p>
              <div>
                <a
                  href={audienceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors"
                >
                  <span>Mở Google Cloud Audience để thêm Email Test</span>
                  <FaExternalLinkAlt className="text-[9px]" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {channels.map((ch) => {
              const isSelected = selectedChannel?.channel_id === ch.channel_id;
              return (
                <div
                  key={ch.channel_id}
                  onClick={() => onSelectChannel(ch)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                    isSelected
                      ? "border-red-500 bg-red-50/30 ring-2 ring-red-500/20 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-red-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center text-red-600">
                        {ch.avatar_url ? (
                          <Image
                            src={ch.avatar_url}
                            alt={ch.channel_title}
                            fill
                            sizes="44px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <FaYoutube className="text-xl" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-gray-900 truncate" title={ch.channel_title}>
                            {ch.channel_title}
                          </h4>
                          {isSelected && <FaCheckCircle className="text-red-600 text-xs flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {ch.custom_url || ch.channel_id}
                        </p>
                        {ch.google_email && (
                          <p className="text-[10px] text-emerald-600 font-medium truncate flex items-center gap-1 mt-0.5" title={`Tài khoản Google: ${ch.google_email}`}>
                            <FaEnvelope className="text-[9px] shrink-0" />
                            <span className="truncate">{ch.google_email}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <FaUsers className="text-[9px] text-blue-500" />
                            {ch.subscriber_count.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FaVideo className="text-[9px] text-red-500" />
                            {ch.video_count} video
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChannelToDelete(ch);
                      }}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0 cursor-pointer"
                      title="Hủy liên kết kênh này"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!channelToDelete}
        title="Hủy Liên Kết Kênh YouTube"
        message={`Bạn có chắc muốn ngắt kết nối Kênh "${channelToDelete?.channel_title}" khỏi hệ thống?`}
        confirmText="Hủy liên kết"
        cancelText="Giữ lại"
        isDangerous={true}
        isLoading={disconnectMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setChannelToDelete(null)}
      />
    </>
  );
};
