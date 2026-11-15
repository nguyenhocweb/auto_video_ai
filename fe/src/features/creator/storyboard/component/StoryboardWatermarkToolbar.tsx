"use client";

import React from "react";
import { FaMagic, FaSpinner } from "react-icons/fa";

interface StoryboardWatermarkToolbarProps {
  autoClean: boolean;
  onToggleAutoClean: (val: boolean) => void;
  onBatchClean: () => void;
  isBatchCleaning: boolean;
  withImageCount: number;
}

export const StoryboardWatermarkToolbar: React.FC<StoryboardWatermarkToolbarProps> = ({
  autoClean,
  onToggleAutoClean,
  onBatchClean,
  isBatchCleaning,
  withImageCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs">
      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
        <input
          type="checkbox"
          checked={autoClean}
          onChange={(e) => onToggleAutoClean(e.target.checked)}
          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 bg-white border-gray-300"
        />
        <span className="flex items-center gap-1.5">
          <FaMagic className="text-violet-600 text-xs" />
          Tự động xóa Watermark / Logo AI khi tải ảnh
        </span>
      </label>

      <button
        type="button"
        onClick={onBatchClean}
        disabled={isBatchCleaning || withImageCount === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isBatchCleaning ? (
          <>
            <FaSpinner className="animate-spin text-xs" />
            Đang làm sạch tất cả...
          </>
        ) : (
          <>
            <FaMagic className="text-xs" />
            Xóa Logo Hàng Loạt ({withImageCount} ảnh)
          </>
        )}
      </button>
    </div>
  );
};

