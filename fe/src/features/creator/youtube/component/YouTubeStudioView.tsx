"use client";

import React, { useState, useEffect } from "react";
import { FaYoutube, FaVideo, FaPlus, FaSyncAlt, FaCog } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { YouTubeChannelItem } from "../type/youtube.type";
import { useYouTubeChannels } from "../hook/useYouTubeChannels";
import { useChannelVideos } from "../hook/useChannelVideos";
import { YouTubeChannelCardsList } from "./YouTubeChannelCardsList";
import { YouTubeStatsOverview } from "./YouTubeStatsOverview";
import { YouTubeVideosTable } from "./YouTubeVideosTable";
import { PublishShortsModal } from "./PublishShortsModal";
import { YouTubeConfigModal } from "./YouTubeConfigModal";

export const YouTubeStudioView: React.FC = () => {
  const {
    data: channelsData,
    isLoading: isLoadingChannels,
    isFetching: isFetchingChannels,
    refetch: refetchChannels,
  } = useYouTubeChannels();

  const channels = channelsData?.channels || [];
  const [selectedChannel, setSelectedChannel] = useState<YouTubeChannelItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Tự động chọn Kênh đầu tiên khi có dữ liệu
  useEffect(() => {
    if (channels.length > 0) {
      if (!selectedChannel || !channels.some((c) => c.channel_id === selectedChannel.channel_id)) {
        setSelectedChannel(channels[0]);
      }
    } else {
      setSelectedChannel(null);
    }
  }, [channels, selectedChannel]);

  const selectedChannelId = selectedChannel ? selectedChannel.channel_id : null;
  const {
    data: videosData,
    isLoading: isLoadingVideos,
    refetch: refetchVideos,
  } = useChannelVideos(selectedChannelId);

  const videos = videosData?.videos || [];

  const handleRefreshAll = () => {
    refetchChannels();
    if (selectedChannelId) {
      refetchVideos();
    }
  };

  return (
    <FadeIn duration={400}>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center text-xl shadow-md shadow-red-500/20 shrink-0 mt-0.5">
              <FaYoutube />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  YouTube Channel &amp; Shorts Studio
                </h1>
                {channels.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Đã Kết Nối ({channels.length} Kênh)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    Chưa kết nối Kênh
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Quản lý các Kênh YouTube, xem thống kê video &amp; xuất bản Shorts 1-Click
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={handleRefreshAll}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <FaSyncAlt className={`text-xs ${isFetchingChannels ? "animate-spin" : ""}`} />
                <span>Đồng bộ</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfigModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <FaCog className="text-xs text-gray-500" />
                <span>Cấu hình API</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              disabled={channels.length === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
            >
              <FaPlus />
              <span>Đăng Shorts Mới</span>
            </button>
          </div>
        </div>

        {/* Danh sách các Kênh YouTube */}
        <YouTubeChannelCardsList
          channels={channels}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          isLoading={isLoadingChannels}
          isFetching={isFetchingChannels}
          onRefresh={handleRefreshAll}
        />

        {/* Banner thống kê Kênh đang chọn */}
        {selectedChannel && (
          <YouTubeStatsOverview
            channel={selectedChannel}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            videoCount={videos.length}
          />
        )}

        {/* Bảng danh sách video của Kênh đang chọn */}
        {selectedChannel && (
          <YouTubeVideosTable
            videos={videos}
            isLoading={isLoadingVideos}
            channelId={selectedChannel.channel_id}
          />
        )}

        {/* Modal Đăng Shorts */}
        <PublishShortsModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          defaultChannel={selectedChannel}
        />

        {/* Modal Cấu hình API */}
        <YouTubeConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />
      </div>
    </FadeIn>
  );
};

