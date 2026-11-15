"use client";

import React from "react";
import { FaTimes, FaDatabase } from "react-icons/fa";
import { VoiceProfilesList } from "./VoiceProfilesList";

interface VoiceProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceProfilesModal: React.FC<VoiceProfilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FaDatabase />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Kho Kiểu Giọng Đã Lưu (MongoDB &amp; Cloudinary)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Danh sách các vector embedding kiểu giọng đã được trích xuất trên hệ thống
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-9 h-9 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-all"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <VoiceProfilesList />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs transition-all shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

