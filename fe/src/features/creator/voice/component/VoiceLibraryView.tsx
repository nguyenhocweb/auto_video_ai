"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FaMicrophone,
  FaTrash,
  FaCheckCircle,
  FaPlusCircle,
  FaSearch,
  FaPlay,
  FaStar,
} from "react-icons/fa";
import { useGetVoiceProfiles } from "../hook/useGetVoiceProfiles";
import { useDeleteVoiceProfile } from "../hook/useDeleteVoiceProfile";
import { Table } from "@/src/core/components/ui/Table";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { usePagination } from "@/src/core/hooks/usePagination";

export const VoiceLibraryView: React.FC = () => {
  const router = useRouter();
  const { data, isLoading } = useGetVoiceProfiles();
  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteVoiceProfile(() => {
    setDeleteTargetId(null);
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("ALL");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const profiles = data?.profiles || [];

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchSearch = p.profile_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGender = genderFilter === "ALL" || p.gender === genderFilter;
      return matchSearch && matchGender;
    });
  }, [profiles, searchQuery, genderFilter]);

  const { page, pageSize, goToPage, changePageSize } = usePagination({
    initialPage: 1,
    initialPageSize: 8,
  });

  const startIndex = (page - 1) * pageSize;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + pageSize);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteProfile(deleteTargetId);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      {/* Top action & filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">
            Kho Kiểu Giọng Đã Lưu
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản lý và kích hoạt các kiểu giọng độc quyền đã đồng bộ trên Database
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/creator/voice/record")}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <FaPlusCircle />
          <span>+ Huấn Luyện Giọng Mới</span>
        </button>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên giọng..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {["ALL", "MALE", "FEMALE", "NEUTRAL"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                genderFilter === g
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {g === "ALL" ? "Tất cả" : g === "MALE" ? "Nam" : g === "FEMALE" ? "Nữ" : "Trung tính"}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng danh sách hoặc Trạng thái trống */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl">
          Đang nạp danh sách hồ sơ giọng nói từ Database...
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="p-10 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-xl">
            <FaMicrophone />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Không tìm thấy kiểu giọng nào</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Hãy bấm vào nút &quot;Huấn Luyện Giọng Mới&quot; để tạo kiểu giọng đầu tiên của bạn.
            </p>
          </div>
        </div>
      ) : (
        <Table
          currentPage={page}
          pageSize={pageSize}
          totalItems={filteredProfiles.length}
          onPageChange={goToPage}
          onPageSizeChange={changePageSize}
          pageSizeOptions={[8, 16, 24]}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Kiểu Giọng</th>
                <th className="px-5 py-3">Giới Tính</th>
                <th className="px-5 py-3">Loại Giọng</th>
                <th className="px-5 py-3">Ngày Tạo</th>
                <th className="px-5 py-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {paginatedProfiles.map((item) => (
                <tr key={item.profile_id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <FaMicrophone className="text-xs" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.profile_name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          ID: {item.profile_id.slice(0, 16)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {item.gender === "FEMALE" ? "Nữ" : item.gender === "MALE" ? "Nam" : "Trung tính"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    {item.is_preset ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                        Mẫu Hệ Thống
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <FaStar className="text-[9px] text-amber-500" /> Độc Quyền
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-gray-500 text-[11px]">
                    {item.created_at || "Hệ thống"}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/creator/voice?profileId=${item.profile_id}`)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                      >
                        <FaPlay className="text-[9px]" />
                        <span>Sử dụng</span>
                      </button>

                      {!item.is_preset && (
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.profile_id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa hồ sơ"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Xóa hồ sơ giọng nói"
        message="Bạn có chắc chắn muốn xóa hồ sơ giọng nói này? Dữ liệu trên Database & Cloudinary sẽ được dọn sạch."
        confirmText="Xác nhận xóa"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

