"use client";

import React, { useState, useEffect } from "react";
import {
  FaListUl,
  FaPlusCircle,
  FaVolumeUp,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { VoiceProfileItem } from "../type/voice.type";

interface VoiceProfileGridProps {
  profiles: VoiceProfileItem[];
  selectedProfileId: string;
  isLoading: boolean;
  onSelectProfile: (id: string) => void;
  onOpenManageModal: () => void;
  onOpenTrainingForm: () => void;
}

export const VoiceProfileGrid: React.FC<VoiceProfileGridProps> = ({
  profiles,
  selectedProfileId,
  isLoading,
  onSelectProfile,
  onOpenManageModal,
  onOpenTrainingForm,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const totalItems = profiles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProfiles = profiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Header dòng chọn giọng */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Chọn Kiểu Giọng Đọc <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenTrainingForm}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlusCircle className="text-[11px]" />
            <span>+ Huấn luyện giọng mới</span>
          </button>
          <button
            type="button"
            onClick={onOpenManageModal}
            className="px-2.5 py-1 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-gray-700 text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-gray-50 transition-all"
          >
            <FaListUl className="text-blue-600 text-[10px]" />
            <span>Kho Giọng ({profiles.length})</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 p-3 text-xs text-gray-500 bg-gray-50 rounded-xl">
          <FaSpinner className="animate-spin text-blue-600" />
          <span>Đang tải danh sách kiểu giọng...</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-4">
          <div>
            <p className="font-bold">Chưa có kiểu giọng nào trong thư viện!</p>
            <p className="text-amber-700 mt-0.5">
              Hãy tải lên file ghi âm mẫu ở phần 1 để huấn luyện kiểu giọng đầu tiên.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTrainingForm}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-sm"
          >
            Huấn luyện ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Lưới các thẻ giọng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {paginatedProfiles.map((p) => {
              const isSelected = selectedProfileId === p.profile_id;
              return (
                <button
                  key={p.profile_id}
                  type="button"
                  onClick={() => onSelectProfile(p.profile_id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/30 shadow-sm ring-2 ring-blue-500/20"
                      : "border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <FaVolumeUp />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {p.profile_name}
                        </p>
                        {p.is_preset && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                            Mẫu
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {p.created_at || "Hệ thống"} • {p.gender === "FEMALE" ? "Nữ" : "Nam"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Thanh chuyển trang (Pagination Controls) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <span>
                Hiển thị{" "}
                <strong className="text-gray-900 font-bold">
                  {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </strong>{" "}
                / {totalItems} kiểu giọng
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Mỗi trang:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>

            {/* Các nút bấm trang */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-xs transition-all shadow-2xs"
              >
                <FaChevronLeft className="text-[10px]" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setCurrentPage(pNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pNum
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-xs transition-all shadow-2xs"
              >
                <span className="hidden sm:inline">Sau</span>
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

