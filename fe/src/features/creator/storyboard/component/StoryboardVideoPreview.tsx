"use client";

import React, { useState } from "react";
import { FaDownload, FaCheckCircle, FaUndo, FaArrowUp, FaPaperPlane } from "react-icons/fa";
import { RenderStoryboardResponse } from "../type/storyboard.type";
import { PublishStoryboardModal } from "./PublishStoryboardModal";

interface StoryboardVideoPreviewProps {
  renderResult: RenderStoryboardResponse;
  onReset: () => void;
  onScrollToTop?: () => void;
  topic?: string;
}

export const StoryboardVideoPreview: React.FC<StoryboardVideoPreviewProps> = ({
  renderResult,
  onReset,
  onScrollToTop,
  topic = "Câu chuyện AI",
}) => {
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
  const videoSrc = renderResult.video_url.startsWith("http")
    ? renderResult.video_url
    : `${apiBase}${renderResult.video_url}`;

  return (
    <>
      <div
        id="storyboard-video-preview"
        className="p-6 bg-white border-2 border-violet-200 rounded-2xl shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Top Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FaCheckCircle className="text-xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Video Đã Render Thành Công!
              </h3>
              <p className="text-xs text-gray-500">
                Thời lượng: <strong className="text-gray-800">{renderResult.duration}s</strong> • Ghép từ{" "}
                <strong className="text-gray-800">{renderResult.scenes_count} phân cảnh</strong> hoàn chỉnh
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onScrollToTop && (
              <button
                type="button"
                onClick={onScrollToTop}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition cursor-pointer"
              >
                <FaArrowUp className="text-xs" /> Cuộn Lên Sửa
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition cursor-pointer"
            >
              <FaUndo className="text-xs" /> Tạo Mới
            </button>

            <a
              href={videoSrc}
              download="storyboard_video.mp4"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <FaDownload className="text-xs" /> Tải MP4
            </a>

            {/* Nút Đăng Video Mới */}
            <button
              type="button"
              onClick={() => setIsPublishOpen(true)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-red-600 hover:from-violet-500 hover:to-red-500 text-white shadow-md shadow-pink-500/25 transition cursor-pointer"
            >
              <FaPaperPlane className="text-xs" /> Đăng Video
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden border border-gray-200 shadow-xl">
          <video
            key={videoSrc}
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Modal Xuất Bản Lên Mạng Xã Hội */}
      <PublishStoryboardModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        jobId={renderResult.job_id}
        defaultTopic={topic}
      />
    </>
  );
};
