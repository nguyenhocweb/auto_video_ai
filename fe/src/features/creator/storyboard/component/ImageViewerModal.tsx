"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaDownload, FaExpand, FaMagic, FaCheck, FaSpinner } from "react-icons/fa";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  sceneIdx: number;
  narration?: string;
  isCleaned?: boolean;
  isCleaning?: boolean;
  onCleanWatermark?: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  sceneIdx,
  narration,
  isCleaned = false,
  isCleaning = false,
  onCleanWatermark,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 w-screen h-screen z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-xs border border-violet-100">
              #{sceneIdx}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <FaExpand className="text-violet-600 text-xs" /> Chi Tiết Ảnh Phân Cảnh #{sceneIdx}
              </h3>
              {narration && (
                <p className="text-xs text-gray-500 line-clamp-1 max-w-md sm:max-w-xl">
                  {narration}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onCleanWatermark && (
              <button
                type="button"
                onClick={onCleanWatermark}
                disabled={isCleaning}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-xs cursor-pointer ${
                  isCleaned
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20"
                }`}
              >
                {isCleaning ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" /> Đang tẩy logo...
                  </>
                ) : isCleaned ? (
                  <>
                    <FaCheck className="text-xs" /> Đã khử logo
                  </>
                ) : (
                  <>
                    <FaMagic className="text-xs" /> Xóa Logo AI
                  </>
                )}
              </button>
            )}

            <a
              href={imageUrl}
              download={`scene_${sceneIdx}.jpg`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            >
              <FaDownload className="text-xs" /> Tải về máy
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="flex-1 p-4 bg-zinc-950/5 flex items-center justify-center overflow-auto max-h-[75vh]">
          <img
            src={imageUrl}
            alt={`Ảnh Phân Cảnh ${sceneIdx}`}
            className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-gray-200/60 select-none"
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
