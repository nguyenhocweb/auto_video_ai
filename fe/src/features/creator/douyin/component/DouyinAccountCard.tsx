"use client";

import React, { useState } from "react";
import {
  FaQrcode,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSyncAlt,
  FaUserCircle,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { useDouyinStatus } from "../hook/useDouyinStatus";
import { useLogoutDouyin } from "../hook/useLogoutDouyin";
import { DouyinQrModal } from "./DouyinQrModal";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

export const DouyinAccountCard: React.FC = () => {
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState<boolean>(false);

  const { data: status, isLoading } = useDouyinStatus();
  const logoutMutation = useLogoutDouyin();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setIsConfirmLogoutOpen(false);
      },
    });
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Cột trái: Thông tin tài khoản / Trạng thái */}
          <div className="flex items-center gap-3.5">
            {/* Avatar / Icon */}
            <div className="relative flex-shrink-0">
              {status?.is_connected && status.avatar_url ? (
                <img
                  src={status.avatar_url}
                  alt={status.nickname || "Douyin Avatar"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-sm"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                    status?.is_connected
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  <SiTiktok />
                </div>
              )}

              {/* Status Dot */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  status?.is_connected ? "bg-green-500" : "bg-gray-400"
                }`}
                title={status?.is_connected ? "Đang kết nối" : "Chưa kết nối"}
              />
            </div>

            {/* Chi tiết thông tin */}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-gray-900">
                  {status?.is_connected
                    ? status.nickname || "Tài khoản Douyin"
                    : "Tài khoản Douyin"}
                </h4>

                {status?.is_connected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <FaCheckCircle className="text-[10px]" /> Đã kết nối
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    <FaExclamationCircle className="text-[10px]" /> Chưa kết nối
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-0.5">
                {isLoading ? (
                  "Đang kiểm tra kết nối..."
                ) : status?.is_connected ? (
                  <>
                    {status.uid && <span>UID: {status.uid} • </span>}
                    <span className="text-emerald-600 font-medium">
                      Phiên quét mã đang hoạt động ổn định
                    </span>
                  </>
                ) : (
                  "Quét mã QR bằng App Douyin để tự động vượt bảo mật và quét video không giới hạn"
                )}
              </p>
            </div>
          </div>

          {/* Cột phải: Các nút hành động */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            {status?.is_connected ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                  title="Quét lại để làm mới phiên đăng nhập"
                >
                  <FaSyncAlt className="text-[11px]" /> Quét lại
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmLogoutOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors"
                  title="Hủy liên kết tài khoản này"
                >
                  <FaSignOutAlt className="text-[11px]" /> Ngắt kết nối
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <FaQrcode className="text-sm" /> Quét mã QR kết nối
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal quét mã QR */}
      <DouyinQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* Modal xác nhận ngắt kết nối */}
      <ConfirmModal
        isOpen={isConfirmLogoutOpen}
        title="Ngắt kết nối Douyin"
        message="Bạn có chắc chắn muốn ngắt kết nối tài khoản Douyin này không? Sau khi ngắt, hệ thống sẽ quay về sử dụng Cookie dự phòng."
        confirmText="Ngắt kết nối"
        cancelText="Đóng"
        isDangerous={true}
        isLoading={logoutMutation.isPending}
        onConfirm={handleLogout}
        onClose={() => setIsConfirmLogoutOpen(false)}
      />
    </>
  );
};

