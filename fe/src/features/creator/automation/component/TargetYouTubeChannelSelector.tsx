"use client";

import React from "react";
import Image from "next/image";
import { FaCheck, FaYoutube, FaVideo, FaFilm } from "react-icons/fa";
import { useYouTubeChannels } from "@/src/features/creator/youtube/hook/useYouTubeChannels";
import { TargetYouTubeChannelConfig } from "../type/automation.type";

interface TargetYouTubeChannelSelectorProps {
  selectedChannels: TargetYouTubeChannelConfig[];
  onChange: (channels: TargetYouTubeChannelConfig[]) => void;
  videoType?: "video" | "shorts";
  onChangeVideoType?: (val: "video" | "shorts") => void;
}

export const TargetYouTubeChannelSelector: React.FC<TargetYouTubeChannelSelectorProps> = ({
  selectedChannels,
  onChange,
  videoType = "shorts",
  onChangeVideoType,
}) => {
  const { data, isLoading } = useYouTubeChannels();
  const channels = data?.channels || [];

  const isSelected = (channelId: string) =>
    selectedChannels.some((c) => c.channel_id === channelId);

  const toggleSelect = (ch: { channel_id: string; channel_title: string; avatar_url?: string | null }) => {
    if (isSelected(ch.channel_id)) {
      onChange(selectedChannels.filter((c) => c.channel_id !== ch.channel_id));
    } else {
      onChange([
        ...selectedChannels,
        {
          channel_id: ch.channel_id,
          channel_title: ch.channel_title,
          avatar_url: ch.avatar_url,
        },
      ]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <FaYoutube className="text-red-600" /> Chọn Kênh YouTube đăng tự động:
        </label>
        <span className="text-[11px] font-semibold text-red-600">
          Đã chọn: {selectedChannels.length} kênh
        </span>
      </div>

      {/* Tùy chọn đăng Shorts vs Video Thường/Dài */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100/90 rounded-xl border border-gray-200/60">
          <button
            type="button"
            onClick={() => onChangeVideoType?.("shorts")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              videoType === "shorts"
                ? "bg-red-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <FaVideo className="text-[10px]" />
            Shorts (Ngắn ≤ 60s)
          </button>
          <button
            type="button"
            onClick={() => onChangeVideoType?.("video")}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              videoType === "video"
                ? "bg-red-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <FaFilm className="text-[10px]" />
            Video Thường (Dài 16:9)
          </button>
        </div>
        <p className="text-[10px] text-gray-400 italic px-1">
          {videoType === "video"
            ? "*Video Thường: Tự động ghép khung 16:9 ngang kèm nền mờ để YouTube nhận diện đúng Video dài."
            : "*Shorts: Tự động ghép khung 9:16 dọc kèm nền mờ nếu video sai tỷ lệ, chống bị YouTube phân loại thành Video dài."}
        </p>
      </div>

      {isLoading ? (
        <div className="text-xs text-gray-400 py-2">Đang tải danh sách Kênh YouTube...</div>
      ) : channels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 border border-gray-200 rounded-xl">
          {channels.map((ch) => {
            const active = isSelected(ch.channel_id);
            return (
              <button
                key={ch.channel_id}
                type="button"
                onClick={() => toggleSelect(ch)}
                className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  active
                    ? "bg-red-50 border-red-500 text-red-900 shadow-xs"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-red-100 flex-shrink-0 relative">
                  {ch.avatar_url ? (
                    <Image
                      src={ch.avatar_url}
                      alt={ch.channel_title}
                      fill
                      sizes="32px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-600 text-xs">
                      <FaYoutube />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{ch.channel_title}</div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {ch.custom_url || ch.channel_id} • {ch.subscriber_count.toLocaleString()} sub
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 ${
                    active ? "bg-red-600 text-white" : "border border-gray-300 text-transparent"
                  }`}
                >
                  <FaCheck className="text-[9px]" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-gray-500 bg-red-50/60 p-3 rounded-xl border border-red-200">
          Chưa có Kênh YouTube nào được liên kết. Vui lòng bấm <strong>[Thêm Kênh YouTube Mới]</strong> ở bảng điều khiển chính để kết nối!
        </div>
      )}
    </div>
  );
};

