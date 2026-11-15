"use client";

import React from "react";
import {
  FaFacebook,
  FaUsers,
  FaThumbsUp,
  FaCheckCircle,
  FaSyncAlt,
  FaKey,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FacebookPage } from "../type/facebook.type";

interface PageCardListProps {
  pages: FacebookPage[];
  selectedPage: FacebookPage | null;
  onSelectPage: (page: FacebookPage) => void;
  isLoading: boolean;
  isFetching?: boolean;
  onRefresh: () => void;
  onOpenUpdateTokenModal: () => void;
  isTokenExpired?: boolean;
}

export const PageCardList: React.FC<PageCardListProps> = ({
  pages,
  selectedPage,
  onSelectPage,
  isLoading,
  isFetching = false,
  onRefresh,
  onOpenUpdateTokenModal,
  isTokenExpired = false,
}) => {
  const loadingActive = isLoading || isFetching;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            <FaFacebook />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">
                Danh sách Fanpage quản lý ({pages.length})
              </h2>
              {loadingActive && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                  <FaSyncAlt className="animate-spin text-[10px]" />
                  Đang đồng bộ...
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Nhấp vào một Trang để xem chi tiết bài viết, video và đăng Thước phim
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenUpdateTokenModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <FaKey className="text-amber-600 text-xs" />
            Cập nhật Token
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loadingActive}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <FaSyncAlt className={`text-xs ${loadingActive ? "animate-spin text-blue-600" : ""}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Cảnh báo khi Token hết hạn */}
      {isTokenExpired && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-amber-900">
            <FaExclamationTriangle className="text-amber-600 text-base shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">User Access Token đã hết hạn (Chỉ hiển thị Trang mặc định)</p>
              <p className="text-amber-800 text-[11px]">
                Nếu bạn vừa được thêm vào Quản trị viên Trang mới, Facebook yêu cầu tạo Token mới để quét được Trang đó.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenUpdateTokenModal}
            className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 shrink-0 transition-colors cursor-pointer"
          >
            Cập nhật Token ngay
          </button>
        </div>
      )}

      {/* Loading Skeleton khi chưa có dữ liệu */}
      {isLoading && pages.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-sm font-medium text-gray-600">Không tìm thấy Fanpage nào</p>
          <p className="text-xs text-gray-400 mt-1">
            Vui lòng bấm &quot;Cập nhật Token&quot; để kết nối tài khoản Facebook của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {pages.map((p) => {
            const isSelected = selectedPage?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPage(p)}
                className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20"
                    : "border-gray-200/80 bg-white hover:border-blue-300 hover:bg-gray-50/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    {p.picture_url ? (
                      <img
                        src={p.picture_url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50 font-bold">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h3>
                      {isSelected && (
                        <FaCheckCircle className="text-blue-600 text-sm shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-gray-400 truncate">
                        {p.category || "Phim & Giải trí"} • ID: {p.id}
                      </p>
                      {isTokenExpired ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full shrink-0 border border-rose-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block"></span>
                          Hết hạn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0 border border-emerald-200/60">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          Đang kết nối
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1 font-medium bg-gray-100/80 px-2 py-0.5 rounded-md text-[11px]">
                        <FaUsers className="text-gray-400 text-[10px]" />
                        {p.followers_count.toLocaleString("vi-VN")}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium bg-gray-100/80 px-2 py-0.5 rounded-md text-[11px]">
                        <FaThumbsUp className="text-blue-500 text-[10px]" />
                        {p.fan_count.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
