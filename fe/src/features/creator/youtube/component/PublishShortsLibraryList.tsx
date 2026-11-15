"use client";

import React from "react";
import { FaVideo } from "react-icons/fa";
import { AvailableVideo } from "../type/youtube.type";

interface PublishShortsLibraryListProps {
  availableVideos: AvailableVideo[];
  selectedVideoPath: string;
  isLoadingVideos: boolean;
  onSelectVideo: (v: AvailableVideo) => void;
}

export const PublishShortsLibraryList: React.FC<PublishShortsLibraryListProps> = ({
  availableVideos,
  selectedVideoPath,
  isLoadingVideos,
  onSelectVideo,
}) => {
  if (isLoadingVideos) {
    return <div className="p-4 text-center text-gray-400">Đang quét thư viện video máy chủ...</div>;
  }

  if (availableVideos.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-200">
        Chưa có video sạch nào trong thư viện máy chủ. Bạn có thể chuyển sang tab &quot;Chọn từ máy tính&quot; để tải file lên ngay!
      </div>
    );
  }

  return (
    <div className="max-h-40 overflow-y-auto space-y-1.5 p-1 border border-gray-200 rounded-xl">
      {availableVideos.map((v) => {
        const active = selectedVideoPath === v.path;
        return (
          <div
            key={v.path}
            onClick={() => onSelectVideo(v)}
            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-colors ${
              active
                ? "bg-red-50 border-red-400 text-red-900 font-semibold shadow-xs"
                : "border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FaVideo className="text-red-500 text-sm flex-shrink-0" />
              <span className="truncate text-xs">{v.title}</span>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {v.size_mb} MB
            </span>
          </div>
        );
      })}
    </div>
  );
};
