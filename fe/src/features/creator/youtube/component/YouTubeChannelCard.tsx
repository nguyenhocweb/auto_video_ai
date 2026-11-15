"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaYoutube, FaPlus, FaTrashAlt, FaSpinner, FaUsers, FaVideo } from "react-icons/fa";
import { useYouTubeChannels } from "../hook/useYouTubeChannels";
import { useConnectYouTube } from "../hook/useConnectYouTube";
import { useDisconnectYouTubeChannel } from "../hook/useDisconnectYouTubeChannel";
import { YouTubeChannelItem } from "../type/youtube.type";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

export const YouTubeChannelCard: React.FC = () => {
  const { data, isLoading } = useYouTubeChannels();
  const connectMutation = useConnectYouTube();
  const disconnectMutation = useDisconnectYouTubeChannel();
  const [selectedChannelToDelete, setSelectedChannelToDelete] = useState<YouTubeChannelItem | null>(null);

  const channels = data?.channels || [];

  const handleConfirmDelete = () => {
    if (!selectedChannelToDelete) return;
    disconnectMutation.mutate(selectedChannelToDelete.channel_id, {
      onSettled: () => setSelectedChannelToDelete(null),
    });
  };

  if (isLoading) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center gap-2 text-xs text-gray-500">
        <FaSpinner className="animate-spin text-red-600" />
        <span>Đang tải danh sách Kênh YouTube đã liên kết...</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-4">
        {/* Header: Tiêu đề + Nút Thêm Kênh */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl shadow-xs">
              <FaYoutube />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-gray-900">
                  Kênh YouTube Shorts Đã Liên Kết
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                  {channels.length} Kênh
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Quản lý các Kênh YouTube được ủy quyền tự động xuất bản Shorts từ Douyin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {connectMutation.isPending ? (
              <FaSpinner className="animate-spin text-xs" />
            ) : (
              <FaPlus className="text-xs" />
            )}
            <span>Thêm Kênh YouTube Mới</span>
          </button>
        </div>

        {/* Danh sách các Kênh */}
        {channels.length === 0 ? (
          <div className="py-6 px-4 text-center rounded-xl bg-gray-50/70 border border-dashed border-gray-200">
            <p className="text-xs font-semibold text-gray-700">Chưa có Kênh YouTube nào được liên kết</p>
            <p className="text-[11px] text-gray-400 mt-1 max-w-md mx-auto">
              Bấm nút &quot;Thêm Kênh YouTube Mới&quot; ở trên để ủy quyền qua Google. Bạn có thể liên kết nhiều kênh cùng lúc!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {channels.map((ch) => (
              <div
                key={ch.channel_id}
                className="p-3.5 rounded-xl border border-gray-200/90 hover:border-red-300 hover:bg-red-50/20 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
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
                    <h5 className="text-xs font-bold text-gray-900 truncate" title={ch.channel_title}>
                      {ch.channel_title}
                    </h5>
                    <p className="text-[10px] text-gray-400 truncate">
                      {ch.custom_url || ch.channel_id}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-[9px] text-blue-500" />
                        {ch.subscriber_count.toLocaleString()} sub
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
                  onClick={() => setSelectedChannelToDelete(ch)}
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0 cursor-pointer"
                  title="Hủy liên kết kênh này"
                >
                  <FaTrashAlt className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!selectedChannelToDelete}
        title="Hủy Liên Kết Kênh YouTube"
        message={`Bạn có chắc muốn ngắt kết nối Kênh "${selectedChannelToDelete?.channel_title}" khỏi hệ thống? Các chiến dịch automation sẽ không còn đăng bài lên kênh này.`}
        confirmText="Hủy liên kết ngay"
        cancelText="Giữ lại"
        isDangerous={true}
        isLoading={disconnectMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setSelectedChannelToDelete(null)}
      />
    </>
  );
};
