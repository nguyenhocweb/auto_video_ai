"use client";

import React from "react";
import { FaCheck, FaHeart, FaPlay } from "react-icons/fa";
import { ChannelVideoItem } from "@/src/features/creator/video/type/video.type";

interface StitchScannedVideosGridProps {
  videos: ChannelVideoItem[];
  selectedUrl: string;
  onSelect: (url: string, title?: string) => void;
  accentColor: "blue" | "purple";
}

export const StitchScannedVideosGrid: React.FC<StitchScannedVideosGridProps> = ({
  videos,
  selectedUrl,
  onSelect,
  accentColor,
}) => {
  const isBlue = accentColor === "blue";

  if (!videos || videos.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <div className="text-[11px] font-bold text-gray-600 flex justify-between">
        <span>Video mới quét được (Click chọn video làm nguồn):</span>
        <span className="text-emerald-600">Đã chọn video mới nhất ✓</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 bg-white border border-gray-200 rounded-xl">
        {videos.map((vid, idx) => {
          const isCurSelected = selectedUrl === vid.video_url;
          return (
            <div
              key={vid.item_id || idx}
              onClick={() => onSelect(vid.video_url, vid.title)}
              className={`relative rounded-lg overflow-hidden border p-1 cursor-pointer transition-all flex flex-col justify-between ${
                isCurSelected
                  ? isBlue
                    ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30"
                    : "border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/30"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/40"
              }`}
            >
              <div className="w-full h-16 bg-gray-200 rounded overflow-hidden relative">
                {vid.cover_url ? (
                  <img src={vid.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaPlay className="text-xs" />
                  </div>
                )}
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black px-1 py-0.5 rounded shadow">
                    MỚI NHẤT
                  </span>
                )}
                {isCurSelected && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    <FaCheck className="text-emerald-400 text-sm" />
                  </div>
                )}
              </div>
              <div className="mt-1 text-[10px] font-bold text-gray-800 line-clamp-2 leading-tight">
                {vid.title || `Douyin #${vid.item_id}`}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5 flex justify-between">
                <span>{vid.crawled_date || "Hôm nay"}</span>
                {vid.likes_count ? (
                  <span className="flex items-center gap-0.5">
                    <FaHeart className="text-red-400 text-[8px]" /> {vid.likes_count}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
