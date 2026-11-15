"use client";

import React, { useState } from "react";
import {
  FaFolderOpen,
  FaWifi,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import { useGetUserRecordings } from "../hook/useGetUserRecordings";
import { useDeleteRecording } from "../hook/useDeleteRecording";
import { useNotificationSocket } from "@/src/features/shared/ws/useNotificationSocket";
import { AudioRecordingItemCard } from "./AudioRecordingItemCard";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

export const AudioRecordingsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Kết nối WebSocket nhận tín hiệu hoàn tất thời gian thực
  const { isConnected } = useNotificationSocket();
  const { data, isLoading } = useGetUserRecordings(page, pageSize);
  const { mutate: deleteRecording, isPending: isDeleting } = useDeleteRecording();

  const recordings = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteRecording(deleteTargetId, {
        onSettled: () => setDeleteTargetId(null),
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <FaFolderOpen className="text-blue-600" />
            Các Bản Thu Âm Của Bạn ({total})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Chỉ bạn mới có quyền nghe và quản lý các bản thuyết minh do chính tài khoản của bạn tạo
          </p>
        </div>

        {/* Real-time socket badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isConnected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            <FaWifi className={isConnected ? "text-emerald-500 animate-pulse" : "text-gray-400"} />
            {isConnected ? "Socket Trực Tiếp" : "Đang kết nối lại..."}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
          <span className="text-xs font-medium">Đang tải danh sách bản thu âm...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && recordings.length === 0 && (
        <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8 space-y-2">
          <p className="text-sm font-semibold text-gray-600">Bạn chưa có bản thu âm nào</p>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Hãy chọn một kiểu giọng và bấm &quot;Tạo Giọng Nói Ngay Tức Thì&quot; ở trên. Tiến trình sẽ chạy ngầm và hiển thị tại đây ngay khi hoàn tất!
          </p>
        </div>
      )}

      {/* List items */}
      {!isLoading && recordings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recordings.map((rec) => (
            <AudioRecordingItemCard
              key={rec.id}
              item={rec}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {!isLoading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={4}>4 / trang</option>
              <option value={6}>6 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
            </select>
            <span>Tổng số {total} bản ghi</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft className="text-[10px]" />
            </button>
            <span className="px-3 py-1 font-semibold text-gray-800">
              Trang {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal xóa bản ghi */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Xóa Bản Thu Âm"
        message="Bạn có chắc chắn muốn xóa vĩnh viễn bản thu âm này? File audio trên cloud cũng sẽ bị gỡ bỏ."
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

