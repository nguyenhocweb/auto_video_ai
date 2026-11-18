"use client";

import React, { useState } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaSyncAlt,
  FaClock,
  FaSpinner,
  FaExternalLinkAlt,
  FaInbox,
} from "react-icons/fa";
import { formatVietnamTime } from "@/src/core/lib/date-utils";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useHookInventory, useDeleteHook } from "../hook/useHookInventory";
import { HookInventoryItem } from "../type/stitch.type";

export const HookInventoryTable: React.FC = () => {
  const { data, isLoading, refetch, isFetching } = useHookInventory();
  const { mutateAsync: deleteHook, isPending: isDeleting } = useDeleteHook();
  const [selectedHookToDelete, setSelectedHookToDelete] = useState<HookInventoryItem | null>(null);

  const handleDeleteConfirm = async () => {
    if (!selectedHookToDelete) return;
    try {
      await deleteHook(selectedHookToDelete.id);
      setSelectedHookToDelete(null);
    } catch {
      // toast handled in hook
    }
  };

  const hooks = data?.hooks || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden space-y-4 p-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Kho Đệm Đoạn Hook Tự Động (Hook Buffer Inventory)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Các đoạn đầu (0s - Xs) được Kênh 1 thu hoạch và lưu trữ chống cào trùng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              Khả dụng: {data?.available_count || 0}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              Đã ghép: {data?.used_count || 0}
            </span>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
            title="Làm mới danh sách"
          >
            <FaSyncAlt className={`text-xs ${isFetching ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
          <FaSpinner className="animate-spin text-xl text-blue-600" />
          <span className="text-xs">Đang tải danh sách Hook trong kho đệm...</span>
        </div>
      ) : hooks.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
          <FaInbox className="text-3xl text-gray-300" />
          <span className="text-xs font-bold text-gray-600">Kho Hook hiện đang trống</span>
          <p className="text-[11px] text-gray-400 max-w-sm text-center">
            Khi chiến dịch tự động hóa chạy, hệ thống sẽ tự động quét Kênh 1, cắt các đoạn Hook và lưu tạm vào đây.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-3">Video Hook</th>
                <th className="py-3 px-3">Thời Lượng</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3">Đã Ghép</th>
                <th className="py-3 px-3">Thời Gian Nạp</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {hooks.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="max-w-[280px]">
                      <div className="font-bold text-gray-900 truncate" title={item.title}>
                        {item.title || `Hook ${item.item_id}`}
                      </div>
                      {item.video_url && (
                        <a
                          href={item.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          Xem gốc <FaExternalLinkAlt className="text-[9px]" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-gray-700">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-gray-400 text-[10px]" /> {item.duration}s
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    {item.status === "available" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        <FaCheckCircle className="text-[9px]" /> Khả dụng (Chưa dùng)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        Đã từng dùng
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-bold text-gray-800">
                    {item.used_count} lần
                  </td>

                  <td className="py-3 px-3 text-[11px] text-gray-500">
                    {formatVietnamTime(item.created_at)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedHookToDelete(item)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Xóa Hook khỏi kho"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm modal xóa hook (Full màn hình, createPortal, NO window.confirm()) */}
      <ConfirmModal
        isOpen={!!selectedHookToDelete}
        onClose={() => setSelectedHookToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa Hook"
        message={`Bạn có chắc muốn xóa đoạn Hook '${selectedHookToDelete?.title || selectedHookToDelete?.item_id}' khỏi kho đệm không?`}
        confirmText="Xác nhận Xóa"
        cancelText="Hủy bỏ"
        isLoading={isDeleting}
        isDangerous={true}
      />
    </div>
  );
};
