"use client";

import React from "react";
import { FaCheck, FaSpinner } from "react-icons/fa";

interface CreateAutomationModalFooterProps {
  isEditing: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateAutomationModalFooter: React.FC<CreateAutomationModalFooterProps> = ({
  isEditing,
  isLoading,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
      >
        Hủy Bỏ
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Đang lưu...</span>
          </>
        ) : (
          <>
            <FaCheck />
            <span>{isEditing ? "Cập Nhật Chiến Dịch" : "Lưu & Khởi Chạy"}</span>
          </>
        )}
      </button>
    </div>
  );
};
