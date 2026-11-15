"use client";

import React from "react";
import {
  FaUsers,
  FaShieldAlt,
  FaUser,
  FaSpinner,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import {
  useAdminUsers,
  useUpdateUserStatus,
} from "@/src/features/admin/hook/useAdminUsers";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
              <FaUsers />
            </div>
            <h2 className="text-base font-extrabold text-gray-900">
              Quản Lý Danh Sách Người Dùng Hệ Thống
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Hệ thống cố định 1 quyền Admin tối cao. Quản lý và khóa hoặc mở khóa tài khoản người dùng
          </p>
        </div>

        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
          Tổng số: {users?.length || 0} tài khoản
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2">
          <FaSpinner className="animate-spin text-xl text-blue-600" />
          <span className="text-xs font-bold text-gray-500">Đang tải danh sách người dùng...</span>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-400">
          Chưa có tài khoản nào được đăng ký trong hệ thống.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 rounded-l-xl">Người Dùng</th>
                <th className="py-3 px-4">Vai Trò</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Ngày Tạo</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const isAdmin = u.role === "ADMIN";
                const isActive = u.status === "ACTIVE";

                return (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white ${
                            isAdmin ? "bg-amber-500" : "bg-blue-600"
                          }`}
                        >
                          {isAdmin ? <FaShieldAlt /> : <FaUser />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.full_name || "Chưa đặt tên"}</p>
                          <p className="text-[11px] text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                          isAdmin
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-blue-100 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {isAdmin ? <FaShieldAlt className="text-amber-600" /> : <FaUser className="text-blue-600" />}
                        {isAdmin ? "Super Admin" : "User"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {isActive ? "Đang hoạt động" : "Bị khóa (Blocked)"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("vi-VN") : "Hôm nay"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end">
                        {isAdmin ? (
                          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl font-bold">
                            🛡️ Quyền Tối Cao
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={() =>
                              updateStatus({
                                userId: u.id,
                                status: isActive ? "BLOCKED" : "ACTIVE",
                              })
                            }
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50 ${
                              isActive
                                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                            title={isActive ? "Khóa tài khoản này" : "Mở khóa tài khoản này"}
                          >
                            {isActive ? <FaLock className="text-[10px]" /> : <FaLockOpen className="text-[10px]" />}
                            <span>{isActive ? "Khóa tài khoản" : "Mở khóa"}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
