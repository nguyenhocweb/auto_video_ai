"use client";

import React from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";

interface CreateStitchModalFooterProps {
  isEditing: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateStitchModalFooter: React.FC<CreateStitchModalFooterProps> = ({
  isEditing,
  isLoading,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-end gap-2.5 p-4 border-t border-gray-100 bg-gray-50/70">
      <button
        type="button"
        disabled={isLoading}
        onClick={onClose}
        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
      >
        Hủy Bỏ
      </button>
      <button
        type="button"
        disabled={isLoading}
        onClick={onSubmit}
        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <FaCheck />
            <span>{isEditing ? "Lưu Thay Đổi" : "Lưu & Khởi Chạy"}</span>
          </>
        )}
      </button>
    </div>
  );
};
