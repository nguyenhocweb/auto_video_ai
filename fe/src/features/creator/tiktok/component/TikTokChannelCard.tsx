import React from "react";
import { SiTiktok } from "react-icons/si";
import { FaTrash, FaUpload, FaCheckCircle } from "react-icons/fa";
import { TikTokChannelItem } from "../type/tiktok.type";

interface Props {
  channel: TikTokChannelItem;
  onOpenPublish: (channel: TikTokChannelItem) => void;
  onDisconnect: (channelId: string) => void;
  isDisconnecting?: boolean;
}

export const TikTokChannelCard: React.FC<Props> = ({
  channel,
  onOpenPublish,
  onDisconnect,
  isDisconnecting = false,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {channel.avatar_url ? (
              <img
                src={channel.avatar_url}
                alt={channel.display_name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                <SiTiktok />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                {channel.display_name}
                <FaCheckCircle className="text-teal-500 text-xs" />
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {channel.username ? `@${channel.username}` : `ID: ${channel.channel_id.slice(0, 10)}...`}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Hoạt động
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-gray-800 text-center mb-4">
          <div>
            <p className="text-[11px] text-gray-500">Followers</p>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">
              {(channel.follower_count || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Thích</p>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">
              {(channel.likes_count || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Video</p>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">
              {(channel.video_count || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onOpenPublish(channel)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors"
        >
          <FaUpload className="text-xs" />
          Đăng Video
        </button>
        <button
          onClick={() => onDisconnect(channel.channel_id)}
          disabled={isDisconnecting}
          title="Hủy liên kết kênh này"
          className="p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 transition-colors"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};
