"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { SiTiktok } from "react-icons/si";
import { FaCheckCircle, FaExclamationCircle, FaPlus, FaSyncAlt, FaVideo } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useTikTokChannels } from "../hook/useTikTokChannels";
import { useTikTokChannelVideos } from "../hook/useTikTokChannelVideos";
import { useConnectTikTok } from "../hook/useConnectTikTok";
import { useDisconnectTikTokChannel } from "../hook/useDisconnectTikTokChannel";
import { TikTokStatsOverview } from "./TikTokStatsOverview";
import { TikTokChannelCardsList } from "./TikTokChannelCardsList";
import { TikTokPublishModal } from "./TikTokPublishModal";
import { TikTokVideosTable } from "./TikTokVideosTable";
import { TikTokChannelItem } from "../type/tiktok.type";

export const TikTokStudioView: React.FC = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [selectedChannel, setSelectedChannel] = useState<TikTokChannelItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [channelToDisconnect, setChannelToDisconnect] = useState<TikTokChannelItem | null>(null);
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data, isLoading: isLoadingChannels, isFetching: isFetchingChannels, refetch: refetchChannels } = useTikTokChannels();
  const { connect, isLoading: isConnecting } = useConnectTikTok();
  const disconnectMutation = useDisconnectTikTokChannel();

  const channels = data?.channels || [];

  // Tự động chọn kênh đầu tiên khi có danh sách
  useEffect(() => {
    if (channels.length > 0) {
      if (!selectedChannel || !channels.some((c) => c.channel_id === selectedChannel.channel_id)) {
        setSelectedChannel(channels[0]);
      }
    } else {
      setSelectedChannel(null);
    }
  }, [channels, selectedChannel]);

  // Lấy video của kênh đang chọn
  const { data: videoData, refetch: refetchVideos } = useTikTokChannelVideos(selectedChannel?.channel_id);
  const videos = videoData?.videos || [];

  useEffect(() => {
    if (searchParams?.get("tiktok_connected") === "true") {
      setBannerAlert({
        type: "success",
        text: "Chúc mừng! Kênh TikTok đã được liên kết thành công vào Studio.",
      });
      refetchChannels();
    } else if (searchParams?.get("tiktok_error")) {
      setBannerAlert({
        type: "error",
        text: `Liên kết kênh TikTok thất bại: ${searchParams.get("tiktok_error")}`,
      });
    }
  }, [searchParams, refetchChannels]);

  const handleRefreshAll = async () => {
    setIsForceRefreshing(true);
    try {
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["tiktok-channels"] }),
        queryClient.invalidateQueries({ queryKey: ["tiktok-channel-videos"] }),
      ]);
      await refetchChannels();
      if (selectedChannel?.channel_id) {
        await refetchVideos();
      }
    } finally {
      setIsForceRefreshing(false);
    }
  };

  const handleOpenPublish = (channel: TikTokChannelItem) => {
    setSelectedChannel(channel);
    setIsPublishModalOpen(true);
  };

  const handleOpenDisconnectConfirm = (channel: TikTokChannelItem) => {
    setChannelToDisconnect(channel);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDisconnect = async () => {
    if (!channelToDisconnect) return;
    try {
      await disconnectMutation.mutateAsync(channelToDisconnect.channel_id);
      setBannerAlert({
        type: "success",
        text: `Đã hủy liên kết kênh "${channelToDisconnect.display_name}" thành công.`,
      });
      setIsConfirmModalOpen(false);
      setChannelToDisconnect(null);
      await refetchChannels();
    } catch {
      setBannerAlert({
        type: "error",
        text: "Không thể hủy liên kết kênh, vui lòng thử lại.",
      });
    }
  };

  const isSyncing = isForceRefreshing || isFetchingChannels;

  return (
    <FadeIn duration={400}>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-xl shadow-md shadow-black/20 shrink-0 mt-0.5">
              <SiTiktok />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  TikTok Creator &amp; Video Studio
                </h1>
                {channels.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Đang kết nối: {channels.length} kênh hoạt động
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={connect}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-xs hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    Chưa kết nối kênh (Bấm để thêm kênh)
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Quản lý đa kênh TikTok, xem thống kê tương tác (views, likes) tức thì và xuất bản video 1-Click
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={connect}
                disabled={isConnecting}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200/80 dark:border-gray-700 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <FaPlus className="text-xs shrink-0" />
                <span className="truncate">{isConnecting ? "Đang mở..." : "Thêm kênh mới"}</span>
              </button>

              <button
                type="button"
                onClick={handleRefreshAll}
                disabled={isSyncing}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <FaSyncAlt className={`text-xs text-gray-500 shrink-0 ${isSyncing ? "animate-spin text-rose-500" : ""}`} />
                <span className="truncate">{isSyncing ? "Đang quét..." : "Đồng bộ"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              disabled={!selectedChannel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-bold text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              <FaPlus className="text-xs shrink-0 text-rose-500" />
              <span>Đăng Video TikTok</span>
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        {bannerAlert && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs border ${
              bannerAlert.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {bannerAlert.type === "success" ? (
                <FaCheckCircle className="text-base text-emerald-600 dark:text-emerald-400" />
              ) : (
                <FaExclamationCircle className="text-base text-rose-600 dark:text-rose-400" />
              )}
              <span className="font-medium">{bannerAlert.text}</span>
            </div>
            <button
              onClick={() => setBannerAlert(null)}
              className="font-bold hover:opacity-75 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Danh sách các Kênh TikTok */}
        <TikTokChannelCardsList
          channels={channels}
          selectedChannel={selectedChannel}
          onSelectChannel={(ch) => setSelectedChannel(ch)}
          isLoading={isLoadingChannels}
          isFetching={isSyncing}
          onRefresh={handleRefreshAll}
          onConnect={connect}
          isConnecting={isConnecting}
          onOpenPublish={handleOpenPublish}
          onOpenDisconnectConfirm={handleOpenDisconnectConfirm}
          isDisconnecting={disconnectMutation.isPending}
        />

        {/* Thống kê Kênh đang chọn */}
        {selectedChannel && (
          <TikTokStatsOverview
            channel={selectedChannel}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            videoCount={videos.length}
          />
        )}

        {/* Tabs: Video trên kênh */}
        {selectedChannel && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-black text-white dark:bg-white dark:text-black shadow-sm"
                >
                  <FaVideo />
                  Thước phim &amp; Video ({videos.length})
                </button>
              </div>

              <span className="text-xs text-gray-400 hidden sm:inline">
                Dữ liệu đồng bộ trực tiếp từ TikTok Open API v2
              </span>
            </div>

            <TikTokVideosTable
              channel={selectedChannel}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
            />
          </div>
        )}

        {/* Modal Đăng Video TikTok */}
        <TikTokPublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          selectedChannel={selectedChannel}
          channels={channels}
        />

        {/* Modal Xác nhận Hủy Liên Kết Kênh */}
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Xác nhận hủy liên kết kênh TikTok"
          message={`Bạn có chắc chắn muốn hủy liên kết kênh "${channelToDisconnect?.display_name}"? Toàn bộ token xác thực của kênh này sẽ bị xóa khỏi hệ thống.`}
          confirmText="Hủy liên kết ngay"
          cancelText="Quay lại"
          isDangerous={true}
          isLoading={disconnectMutation.isPending}
          onConfirm={handleConfirmDisconnect}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setChannelToDisconnect(null);
          }}
        />
      </div>
    </FadeIn>
  );
};
