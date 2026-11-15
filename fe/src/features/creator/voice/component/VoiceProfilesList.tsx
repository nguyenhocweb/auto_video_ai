"use client";

import React, { useState } from "react";
import { FaMicrophone, FaTrash, FaCheckCircle, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import { useGetVoiceProfiles } from "../hook/useGetVoiceProfiles";
import { useDeleteVoiceProfile } from "../hook/useDeleteVoiceProfile";
import { Table } from "@/src/core/components/ui/Table";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { usePagination } from "@/src/core/hooks/usePagination";
import { toast } from "sonner";

export const VoiceProfilesList: React.FC = () => {
  const { data, isLoading } = useGetVoiceProfiles();
  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteVoiceProfile(() => {
    setDeleteTargetId(null);
  });
  const { page, pageSize, goToPage, changePageSize } = usePagination({
    initialPage: 1,
    initialPageSize: 5,
  });

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const profiles = data?.profiles || [];
  const startIndex = (page - 1) * pageSize;
  const paginatedProfiles = profiles.slice(startIndex, startIndex + pageSize);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteProfile(deleteTargetId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 bg-white rounded-2xl border border-gray-100">
        Đang nạp danh sách hồ sơ giọng nói...
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <FaMicrophone className="text-xl" />
        </div>
        <h4 className="text-sm font-bold text-gray-800">Chưa có hồ sơ giọng nói nào</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Tạo hồ sơ giọng nói từ đoạn thu âm 5 giây để sử dụng vĩnh viễn cho các video tiếp theo.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Table
        currentPage={page}
        pageSize={pageSize}
        totalItems={profiles.length}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        pageSizeOptions={[5, 10, 20]}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Tên Hồ Sơ Giọng</th>
              <th className="px-6 py-3.5">Mã ID (.pt)</th>
              <th className="px-6 py-3.5">Trạng thái</th>
              <th className="px-6 py-3.5">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {paginatedProfiles.map((item) => (
              <tr key={item.profile_id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <FaMicrophone className="text-xs" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.profile_name}</p>
                      <p className="text-[10px] text-gray-400">Embedding nạp sẵn</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-gray-500 text-[11px]">
                  {item.profile_id.slice(0, 16)}...
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <FaCheckCircle className="text-[10px]" /> Khả dụng
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.is_preset ? (
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                      Mẫu hệ thống
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(item.profile_id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa hồ sơ giọng của bạn"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Table>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Xóa hồ sơ giọng nói"
        message="Bạn có chắc chắn muốn xóa hồ sơ giọng nói này? Các video cũ sử dụng giọng này vẫn giữ nguyên audio đã xuất."
        confirmText="Xác nhận xóa"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

