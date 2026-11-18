import React from "react";
import { SiTiktok } from "react-icons/si";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { TikTokChannelItem } from "../type/tiktok.type";
import { TikTokChannelCard } from "./TikTokChannelCard";

interface Props {
  channels: TikTokChannelItem[];
  isLoading: boolean;
  onConnect: () => void;
  isConnecting: boolean;
  onOpenPublish: (channel: TikTokChannelItem) => void;
  onDisconnect: (channelId: string) => void;
  isDisconnecting?: boolean;
}

export const TikTokChannelCardsList: React.FC<Props> = ({
  channels,
  isLoading,
  onConnect,
  isConnecting,
  onOpenPublish,
  onDisconnect,
  isDisconnecting = false,
}) => {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-2xl text-rose-500" />
        <p>Đang tải danh sách kênh TikTok...</p>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-10 text-center flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/30">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-3xl mb-4 shadow-lg shadow-black/10">
          <SiTiktok />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Chưa có kênh TikTok nào được liên kết
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
          Kết nối kênh TikTok của bạn để quản lý đăng video tự động, theo dõi tương tác và phân phối nội dung AI đa kênh.
        </p>
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 font-semibold text-sm transition-all shadow-md active:scale-95"
        >
          {isConnecting ? (
            <FaSpinner className="animate-spin text-sm" />
          ) : (
            <FaPlus className="text-xs" />
          )}
          {isConnecting ? "Đang chuyển hướng ủy quyền..." : "Kết nối Kênh TikTok ngay"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Danh sách Kênh TikTok ({channels.length})
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Quản lý và xuất bản video đa kênh nhanh chóng
          </p>
        </div>
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 text-xs font-semibold transition-all active:scale-95"
        >
          {isConnecting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPlus className="text-[10px]" />
          )}
          Thêm kênh TikTok mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((ch) => (
          <TikTokChannelCard
            key={ch.channel_id}
            channel={ch}
            onOpenPublish={onOpenPublish}
            onDisconnect={onDisconnect}
            isDisconnecting={isDisconnecting}
          />
        ))}
      </div>
    </div>
  );
};
