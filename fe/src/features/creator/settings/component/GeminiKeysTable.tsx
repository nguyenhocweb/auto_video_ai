"use client";

import React, { useState, useMemo } from "react";
import {
  FaTrash,
  FaKey,
  FaCheck,
  FaBan,
  FaChevronLeft,
  FaChevronRight,
  FaSyncAlt,
  FaToggleOn,
  FaToggleOff,
  FaBolt,
} from "react-icons/fa";
import { GeminiKeyItem } from "../type/gemini-key.type";
import { useDeleteGeminiKey } from "../hook/useDeleteGeminiKey";
import { useToggleGeminiKey } from "../hook/useToggleGeminiKey";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { formatVietnamTime, formatVietnamDateOnly } from "@/src/core/lib/date-utils";

interface GeminiKeysTableProps {
  keys: GeminiKeyItem[];
  isLoading: boolean;
  onOpenAddModal: () => void;
  onOpenTesterModal: (keyItem?: GeminiKeyItem) => void;
  onRefresh: () => void;
}

export const GeminiKeysTable: React.FC<GeminiKeysTableProps> = ({
  keys,
  isLoading,
  onOpenAddModal,
  onOpenTesterModal,
  onRefresh,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<GeminiKeyItem | null>(null);

  const deleteMutation = useDeleteGeminiKey();
  const toggleMutation = useToggleGeminiKey();

  const totalPages = Math.ceil(keys.length / pageSize) || 1;
  const paginatedKeys = useMemo(() => {
    const start = (page - 1) * pageSize;
    return keys.slice(start, start + pageSize);
  }, [keys, page, pageSize]);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FaKey className="text-blue-600" />
            Danh Sách API Keys Trong Rotation Pool
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Hệ thống tự động xoay tua sang key khả dụng tiếp theo khi gặp hạn mức 429
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm"
            title="Làm mới danh sách"
          >
            <FaSyncAlt className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            type="button"
            onClick={() => onOpenTesterModal()}
            className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FaBolt className="text-amber-600" /> Kiểm Tra Key API
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/25 transition-all flex items-center gap-1.5"
          >
            + Thêm API Key Mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-6">Gợi nhớ / Nhãn</th>
              <th className="py-3.5 px-6">API Key</th>
              <th className="py-3.5 px-6">Model AI</th>
              <th className="py-3.5 px-6">Trạng thái Pool</th>
              <th className="py-3.5 px-6">Lượt dịch / 429</th>
              <th className="py-3.5 px-6">Lần dùng cuối (UTC+7)</th>
              <th className="py-3.5 px-6">Ngày thêm</th>
              <th className="py-3.5 px-6 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  <FaSyncAlt className="animate-spin text-xl mx-auto mb-2 text-blue-500" />
                  Đang tải danh sách Gemini API Keys...
                </td>
              </tr>
            ) : keys.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-14 text-gray-500">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3">
                    <FaKey className="text-xl" />
                  </div>
                  <p className="font-bold text-gray-800 mb-1">Chưa có Gemini API Key nào trong Database</p>
                  <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                    Thêm ít nhất 1 API Key từ Google AI Studio để kích hoạt mô hình dịch thuật ngữ cảnh phim.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAddModal}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                  >
                    + Thêm Key Ngay
                  </button>
                </td>
              </tr>
            ) : (
              paginatedKeys.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-gray-900">
                    {item.note || <span className="text-gray-400 italic">Không có nhãn</span>}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-gray-700 bg-gray-50/50 rounded">
                    {item.key_masked}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.model || "gemini-2.5-flash"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      type="button"
                      disabled={toggleMutation.isPending}
                      onClick={() => toggleMutation.mutate(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        item.is_active
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      title={item.is_active ? "Bấm để tạm tắt" : "Bấm để kích hoạt"}
                    >
                      {item.is_active ? (
                        <>
                          <FaCheck className="text-[10px]" /> Đang Bật
                        </>
                      ) : (
                        <>
                          <FaBan className="text-[10px]" /> Tạm Tắt
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-bold text-purple-700">{item.usage_count || 0}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className={`font-semibold ${item.error_count > 0 ? "text-amber-600" : "text-gray-400"}`}>
                      {item.error_count || 0} lần
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600">
                    {item.last_used_at ? formatVietnamTime(item.last_used_at) : <span className="text-gray-400">Chưa dùng</span>}
                  </td>
                  <td className="py-3.5 px-6 text-gray-500">
                    {formatVietnamDateOnly(item.created_at)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenTesterModal(item)}
                        className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Kiểm tra kết nối & đổi Model cho Key này"
                      >
                        <FaBolt className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa Key này khỏi Database"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Rows Per Page */}
      {keys.length > 0 && (
        <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 bg-white border border-gray-200 rounded-lg outline-none font-semibold text-gray-700"
            >
              <option value={5}>5 hàng</option>
              <option value={10}>10 hàng</option>
              <option value={20}>20 hàng</option>
            </select>
            <span>trong tổng số <b>{keys.length}</b> Keys</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              Trang {page} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa Gemini API Key?"
        message={`Bạn có chắc chắn muốn xóa Key "${deleteTarget?.note || deleteTarget?.key_masked}" khỏi Database? Hành động này sẽ loại bỏ key khỏi pool xoay tua tự động.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        isDangerous={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

