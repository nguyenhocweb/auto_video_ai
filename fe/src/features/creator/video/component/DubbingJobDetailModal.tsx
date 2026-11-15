"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaVideo,
  FaMicrophoneAlt,
  FaClosedCaptioning,
  FaVolumeDown,
  FaVolumeUp,
  FaDownload,
  FaExternalLinkAlt,
  FaCopy,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import { DubbingHistoryItem } from "@/src/features/creator/dubbing/type/dubbing.type";
import { downloadFileWithPicker } from "@/src/core/lib/file-downloader";
import { formatVietnamTime } from "@/src/core/lib/date-utils";

interface DubbingJobDetailModalProps {
  job: DubbingHistoryItem | null;
  onClose: () => void;
}

export const DubbingJobDetailModal: React.FC<DubbingJobDetailModalProps> = ({ job, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!job || !mounted) return null;

  const getFullUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const videoUrl = job.cloudinary_url || job.output_video_url;

  const handleCopyLink = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "both":
        return "Sub + Thuyết Minh";
      case "vietsub":
        return "Chỉ Vietsub Tiếng Việt";
      case "dubbing":
        return "Chỉ Thuyết Minh Lồng Tiếng";
      case "download_only":
        return "Tải Video Sạch Logo";
      default:
        return mode;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FaVideo className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Chi Tiết Video & Thông Số Xử Lý</h3>
                <span className="text-[11px] font-mono text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-md">
                  #{job.id.slice(-6)}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{job.title || "Video Douyin AI"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nội Dung Chi Tiết (Cuộn) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Khung Video Player Hoặc Trạng Thái Đang Xử Lý */}
          <div className="bg-black rounded-2xl overflow-hidden relative shadow-inner">
            {videoUrl ? (
              <video
                controls
                src={getFullUrl(videoUrl)}
                poster={job.cover_url}
                className="w-full max-h-[380px] object-contain mx-auto"
              />
            ) : (
              <div className="py-20 px-6 text-center text-white space-y-3 bg-gradient-to-b from-gray-900 to-black">
                {job.status === "failed" ? (
                  <FaExclamationCircle className="text-4xl text-red-500 mx-auto" />
                ) : (
                  <FaSpinner className="text-4xl text-blue-500 animate-spin mx-auto" />
                )}
                <p className="text-sm font-semibold">{job.progress_step || "Đang xử lý video ngầm..."}</p>
                <div className="w-64 max-w-full bg-gray-800 rounded-full h-2 mx-auto overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress_percent || 15}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">Tiến trình: {job.progress_percent || 0}%</p>
              </div>
            )}
          </div>

          {/* Nút Thao Tác Tải File */}
          {videoUrl && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => downloadFileWithPicker(getFullUrl(videoUrl), `video_${job.id.slice(-6)}.mp4`, "mp4")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
              >
                <FaDownload /> Tải Video MP4
              </button>
              {job.subtitle_srt_url && (
                <button
                  type="button"
                  onClick={() => downloadFileWithPicker(getFullUrl(job.subtitle_srt_url), `sub_${job.id.slice(-6)}.srt`, "srt")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
                >
                  <FaDownload /> Tải Sub SRT
                </button>
              )}
              {job.subtitle_ass_url && (
                <button
                  type="button"
                  onClick={() => downloadFileWithPicker(getFullUrl(job.subtitle_ass_url), `sub_${job.id.slice(-6)}.ass`, "ass")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold hover:bg-purple-100 transition"
                >
                  <FaDownload /> Tải Sub ASS
                </button>
              )}
              {job.source_url && (
                <button
                  type="button"
                  onClick={() => handleCopyLink(job.source_url)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition ml-auto"
                >
                  <FaCopy /> Sao chép link gốc
                </button>
              )}
            </div>
          )}

          {/* Lưới Thông Số Đã Cấu Hình */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-1.5">
                <FaMicrophoneAlt /> Giọng Thuyết Minh:
              </span>
              <p className="text-xs font-bold text-gray-900">
                {job.voice_source === "profile"
                  ? (job.voice_name && !job.voice_name.includes("Nam Minh") && !job.voice_name.includes("Hoài My")
                      ? job.voice_name
                      : `Giọng Cá Nhân (${job.voice_profile_id ? `#${job.voice_profile_id.slice(-4)}` : "OmniVoice"})`)
                  : (job.voice_name || job.voice_preset || "Nam Minh (Nam Trầm Ấm)")}
              </p>
              <p className="text-[10px] text-gray-500">
                {job.voice_source === "profile" ? "OmniVoice Clone AI" : "Edge-TTS Studio"}
              </p>
            </div>

            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-1">
              <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1.5">
                <FaVideo /> Chế Độ Xử Lý:
              </span>
              <p className="text-xs font-bold text-gray-900">{getModeLabel(job.mode)}</p>
              <p className="text-[10px] text-gray-500">
                {job.remove_subtitles ? "Có xóa phụ đề cứng gốc" : "Giữ nguyên hình ảnh gốc"}
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-1">
              <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
                <FaClosedCaptioning /> Xóa Phụ Đề Cứng:
              </span>
              <p className="text-xs font-bold text-gray-900">
                {job.remove_subtitles ? "AI Inpainting (Zero-Blur)" : "Không xóa"}
              </p>
              <p className="text-[10px] text-gray-500">Tái tạo khung hình không làm mờ</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
                <FaVolumeDown /> Âm Lượng Nhạc Nền:
              </span>
              <p className="text-xs font-bold text-gray-900">
                {Math.round((job.bgm_volume ?? 0.18) * 100)}% (Audio Ducking)
              </p>
              <p className="text-[10px] text-gray-500">Tự động giảm âm khi có tiếng thuyết minh</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
                <FaVolumeUp /> Âm Lượng Thuyết Minh:
              </span>
              <p className="text-xs font-bold text-gray-900">
                {Math.round((job.voice_volume ?? 1.0) * 100)}%
              </p>
              <p className="text-[10px] text-gray-500">Độ rõ nét giọng đọc tiếng Việt</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5">
                <FaClock /> Thời Gian Khởi Tạo:
              </span>
              <p className="text-xs font-bold text-gray-900">
                {formatVietnamTime(job.created_at)}
              </p>
              <p className="text-[10px] text-gray-500">Đã lưu trữ an toàn trên MongoDB Atlas</p>
            </div>
          </div>

          {/* Chi tiết lỗi nếu có */}
          {job.error_message && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <FaExclamationCircle /> Thông Báo Lỗi:
              </p>
              <p className="font-mono text-[11px] break-all">{job.error_message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Trạng thái hiện tại: <span className="font-semibold text-gray-700 uppercase">{job.status}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold transition"
          >
            Đóng Chi Tiết
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
