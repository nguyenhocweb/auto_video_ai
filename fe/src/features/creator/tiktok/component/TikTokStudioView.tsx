import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SiTiktok } from "react-icons/si";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { useTikTokChannels } from "../hook/useTikTokChannels";
import { useConnectTikTok } from "../hook/useConnectTikTok";
import { useDisconnectTikTokChannel } from "../hook/useDisconnectTikTokChannel";
import { TikTokStatsOverview } from "./TikTokStatsOverview";
import { TikTokChannelCardsList } from "./TikTokChannelCardsList";
import { TikTokPublishModal } from "./TikTokPublishModal";
import { TikTokVideosTable } from "./TikTokVideosTable";
import { TikTokChannelItem } from "../type/tiktok.type";

export const TikTokStudioView: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedChannel, setSelectedChannel] = useState<TikTokChannelItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data, isLoading, refetch } = useTikTokChannels();
  const { connect, isLoading: isConnecting } = useConnectTikTok();
  const disconnectMutation = useDisconnectTikTokChannel();

  const channels = data?.channels || [];
  const activeChannel = selectedChannel || (channels.length > 0 ? channels[0] : null);

  useEffect(() => {
    if (searchParams?.get("tiktok_connected") === "true") {
      setBannerAlert({
        type: "success",
        text: "Chúc mừng! Kênh TikTok đã được liên kết thành công vào Studio.",
      });
      refetch();
    } else if (searchParams?.get("tiktok_error")) {
      setBannerAlert({
        type: "error",
        text: `Liên kết kênh TikTok thất bại: ${searchParams.get("tiktok_error")}`,
      });
    }
  }, [searchParams, refetch]);

  const handleOpenPublish = (channel: TikTokChannelItem) => {
    setSelectedChannel(channel);
    setIsPublishModalOpen(true);
  };

  const handleDisconnect = async (channelId: string) => {
    try {
      await disconnectMutation.mutateAsync(channelId);
      setBannerAlert({
        type: "success",
        text: "Đã hủy liên kết kênh TikTok thành công.",
      });
    } catch (err: any) {
      setBannerAlert({
        type: "error",
        text: "Không thể hủy liên kết kênh, vui lòng thử lại.",
      });
    }
  };

  return (
    <FadeIn>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center text-2xl shadow-md shadow-black/10">
              <SiTiktok />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                TikTok Studio Multi-Channel
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Quản lý liên kết đa tài khoản TikTok và xuất bản video ngắn tự động (Content Posting API v2)
              </p>
            </div>
          </div>
        </div>

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

        <TikTokStatsOverview channels={channels} />

        <TikTokChannelCardsList
          channels={channels}
          isLoading={isLoading}
          onConnect={connect}
          isConnecting={isConnecting}
          onOpenPublish={handleOpenPublish}
          onDisconnect={handleDisconnect}
          isDisconnecting={disconnectMutation.isPending}
        />

        {channels.length > 0 && (
          <TikTokVideosTable selectedChannel={activeChannel} />
        )}

        <TikTokPublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          selectedChannel={selectedChannel}
          channels={channels}
        />
      </div>
    </FadeIn>
  );
};
