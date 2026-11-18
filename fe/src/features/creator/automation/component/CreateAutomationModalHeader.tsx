"use client";

import React from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

interface CreateAutomationModalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export const CreateAutomationModalHeader: React.FC<CreateAutomationModalHeaderProps> = ({
  isEditing,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          <FaRobot />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {isEditing ? "Chỉnh Sửa Chiến Dịch Automation" : "Tạo Cấu Hình Automation Mới"}
          </h3>
          <p className="text-[11px] text-gray-400">
            Tự động cào video mới nhất Douyin, ghép nối 2 nguồn &amp; xuất bản Reels FB / YouTube
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
      >
        <FaTimes />
      </button>
    </div>
  );
};
