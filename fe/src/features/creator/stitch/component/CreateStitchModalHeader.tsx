"use client";

import React from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

interface CreateStitchModalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export const CreateStitchModalHeader: React.FC<CreateStitchModalHeaderProps> = ({
  isEditing,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-500/20">
          <FaRobot />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900">
            {isEditing ? "Chỉnh Sửa Chiến Dịch Auto Ghép Nối" : "Tạo Chiến Dịch Auto Ghép 2 Nguồn Mới"}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Tự động cào video mồi câu (Hook) và thân bài, ghép nối xfade mượt mà và xuất bản
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
      >
        <FaTimes />
      </button>
    </div>
  );
};
