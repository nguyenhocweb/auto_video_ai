import React from "react";
import { FaUsers, FaHeart, FaVideo, FaBroadcastTower } from "react-icons/fa";
import { TikTokChannelItem } from "../type/tiktok.type";

interface Props {
  channels: TikTokChannelItem[];
}

export const TikTokStatsOverview: React.FC<Props> = ({ channels }) => {
  const totalChannels = channels.length;
  const totalFollowers = channels.reduce(
    (sum, ch) => sum + (ch.follower_count || 0),
    0
  );
  const totalLikes = channels.reduce((sum, ch) => sum + (ch.likes_count || 0), 0);
  const totalVideos = channels.reduce((sum, ch) => sum + (ch.video_count || 0), 0);

  const stats = [
    {
      label: "Kênh đã liên kết",
      value: totalChannels,
      icon: FaBroadcastTower,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      label: "Tổng Người theo dõi",
      value: totalFollowers.toLocaleString(),
      icon: FaUsers,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Tổng Lượt thích",
      value: totalLikes.toLocaleString(),
      icon: FaHeart,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950/30",
    },
    {
      label: "Tổng Video trên kênh",
      value: totalVideos.toLocaleString(),
      icon: FaVideo,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3.5"
          >
            <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}>
              <Icon className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {s.label}
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                {s.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};
