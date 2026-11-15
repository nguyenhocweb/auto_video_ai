"use client";

import React from "react";
import Image from "next/image";
import {
  FaVideo,
  FaDownload,
  FaMicrophone,
  FaSpinner,
  FaCalendarAlt,
  FaHeart,
  FaRegClock,
  FaCut,
} from "react-icons/fa";
import { ChannelVideoItem } from "../type/video.type";

interface ChannelVideoCardProps {
  video: ChannelVideoItem;
  isDownloading: boolean;
  onDownload: (item: ChannelVideoItem) => void;
  onGoToVoiceStudio: (item: ChannelVideoItem) => void;
  onOpenSlicer?: (item: ChannelVideoItem) => void;
}

export const ChannelVideoCard: React.FC<ChannelVideoCardProps> = ({
  video,
  isDownloading,
  onDownload,
  onGoToVoiceStudio,
  onOpenSlicer,
}) => {
  return (
    <div className="group flex flex-col justify-between bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <div>
        <div className="relative aspect-[9/14] w-full bg-gray-200 overflow-hidden">
          {video.cover_url ? (
            <Image
              src={video.cover_url}
              alt={video.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaVideo className="text-3xl" />
            </div>
          )}
          {/* Badge ngày đăng trên ảnh bìa */}
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 backdrop-blur-xs text-white shadow-xs flex items-center gap-1 border border-white/10">
              <FaCalendarAlt className="text-blue-400 text-[9px]" />
              <span>{video.publish_time || video.crawled_date || "Mới đăng"}</span>
            </span>
            {video.is_today && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-500 text-white shadow-xs animate-pulse">
                Mới
              </span>
            )}
          </div>
        </div>

        <div className="p-3">
          <h3
            className="text-xs font-semibold text-gray-800 line-clamp-2 leading-relaxed"
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Dòng hiển thị ngày tháng và tương tác của video */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2.5 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium text-gray-600">
              <FaRegClock className="text-blue-500 text-[10px]" />
              <span>{video.publish_time || video.crawled_date}</span>
            </span>
            {video.likes_count && video.likes_count > 0 ? (
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                <FaHeart className="text-[10px]" />
                <span>{video.likes_count.toLocaleString()}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Nút tác vụ nhanh */}
      <div className="p-3 pt-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDownload(video)}
          disabled={isDownloading}
          className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          title="Tải MP4 không logo"
        >
          {isDownloading ? (
            <FaSpinner className="animate-spin text-xs" />
          ) : (
            <FaDownload className="text-xs" />
          )}
          <span>{isDownloading ? "Đang xử lý..." : "Tải MP4"}</span>
        </button>

        <button
          type="button"
          onClick={() => onGoToVoiceStudio(video)}
          className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs transition-colors"
          title="Chuyển sang Voice Studio lồng tiếng AI"
        >
          <FaMicrophone />
        </button>

        {onOpenSlicer && (
          <button
            type="button"
            onClick={() => onOpenSlicer(video)}
            className="p-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs transition-colors"
            title="AI Giải Phẫu & Cắt Khớp Mẫu"
          >
            <FaCut />
          </button>
        )}
      </div>
    </div>
  );
};

