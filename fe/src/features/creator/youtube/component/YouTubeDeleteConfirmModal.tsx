"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaExclamationTriangle, FaTrashAlt, FaTimes, FaShieldAlt, FaSpinner } from "react-icons/fa";
import { YouTubeVideoItem } from "../type/youtube.type";

interface YouTubeDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: YouTubeVideoItem | null;
  channelId: string;
  onConfirm: (channelId: string, videoId: string, videoTitle: string) => Promise<void> | void;
  isPending: boolean;
}

export const YouTubeDeleteConfirmModal: React.FC<YouTubeDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  video,
  channelId,
  onConfirm,
  isPending,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !video || !mounted) return null;

  const handleConfirm = async () => {
    await onConfirm(channelId, video.id, video.title);
    onClose();
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-lg shrink-0">
              <FaExclamationTriangle />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Xác Nhận Xóa Video Khỏi YouTube
              </h3>
              <p className="text-[11px] text-gray-500">
                Hành động vĩnh viễn trên kênh YouTube
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Video Preview Card */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt=""
              className="w-16 h-10 rounded-lg object-cover shrink-0 bg-gray-200"
            />
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-gray-800 line-clamp-2">
              {video.title}
            </h4>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              ID: {video.id}
            </div>
          </div>
        </div>

        {/* Cảnh báo nghiêm trọng */}
        <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl text-xs space-y-2 text-red-900">
          <div className="font-bold flex items-center gap-1.5 text-red-700">
            <FaExclamationTriangle className="text-xs" />
            <span>Cảnh báo: Video sẽ bị xóa vĩnh viễn khỏi YouTube!</span>
          </div>
          <p className="text-[11px] leading-relaxed text-red-800">
            Video này sẽ lập tức biến mất khỏi kênh YouTube của bạn (mất toàn bộ lượt xem, bình luận và không thể phục hồi).
          </p>
          <div className="pt-2 border-t border-red-200 flex items-start gap-2 text-emerald-800 text-[11px]">
            <FaShieldAlt className="text-emerald-600 text-sm shrink-0 mt-0.5" />
            <span>
              <b>Cơ chế An toàn (Anti-Reupload):</b> Hệ thống sẽ tiếp tục lưu giữ mã định danh video gốc trong Database. Crawler tự động sẽ <b>tuyệt đối không bao giờ cào và đăng lại</b> video này nữa!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Đang xóa trên YouTube...</span>
              </>
            ) : (
              <>
                <FaTrashAlt className="text-xs" />
                <span>Xác Nhận Xóa Trên YouTube</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
