"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaCheckDouble,
  FaExternalLinkAlt,
  FaRedo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaSpinner,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import { useGetNotifications } from "../hook/useGetNotifications";
import { useGetUnreadCount } from "../hook/useGetUnreadCount";
import { useMarkAsRead } from "../hook/useMarkAsRead";
import { useMarkAllAsRead } from "../hook/useMarkAllAsRead";
import { useRetryDubbingJob } from "@/src/features/creator/dubbing/hook/useRetryDubbingJob";
import { NotificationItem } from "../type/notification.type";
import { formatVietnamShortTime } from "@/src/core/lib/date-utils";

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useGetUnreadCount();
  const unreadCount = unreadData?.unread_count ?? 0;

  const { data, isLoading } = useGetNotifications(
    filterUnread ? false : undefined,
    40
  );
  const notifications: NotificationItem[] = data?.notifications || [];

  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();
  const retryMutation = useRetryDubbingJob();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.is_read) {
      markAsReadMutation.mutate(item.id);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />;
      case "WARNING":
        return <FaExclamationTriangle className="text-amber-500 text-sm mt-0.5 shrink-0" />;
      case "ERROR":
        return <FaTimesCircle className="text-rose-500 text-sm mt-0.5 shrink-0" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-sm mt-0.5 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Chuông Thông Báo */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors relative"
        title="Thông báo hệ thống"
      >
        <FaBell className="text-sm" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Menu Dropdown Thông Báo */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-3 top-[68px] sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 w-auto sm:w-[420px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-200/90 z-50 overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
          <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                disabled={markAllMutation.isPending}
                onClick={() => markAllMutation.mutate()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <FaCheckDouble className="text-[11px]" />
                Đã đọc tất cả
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-100 text-xs px-3 pt-2 bg-white">
            <button
              type="button"
              onClick={() => setFilterUnread(false)}
              className={`pb-2 px-3 font-medium border-b-2 transition-all ${
                !filterUnread
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterUnread(true)}
              className={`pb-2 px-3 font-medium border-b-2 transition-all ${
                filterUnread
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto divide-y divide-gray-100 flex-1 max-h-[460px]">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
                <span className="text-xs">Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                Không có thông báo nào {filterUnread ? "chưa đọc" : ""}.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 hover:bg-gray-50/80 transition-colors flex gap-3 cursor-pointer ${
                    !item.is_read ? "bg-blue-50/40" : "bg-white"
                  }`}
                >
                  {getLevelIcon(item.level)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs leading-snug truncate ${
                          !item.is_read
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-700"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                        {formatVietnamShortTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Metadata: Kênh nguồn & Video nguồn Douyin */}
                    {item.metadata && (
                      <div className="mt-2 space-y-1.5 text-[11px] bg-gray-50/90 rounded-lg p-2 border border-gray-100">
                        {item.metadata.channel_name && (
                          <div className="flex items-center gap-1.5 text-gray-600 truncate">
                            <span className="font-semibold text-gray-700">Kênh:</span>
                            {item.metadata.channel_url ? (
                              <a
                                href={item.metadata.channel_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-600 hover:underline flex items-center gap-1 truncate"
                              >
                                {item.metadata.channel_name}
                                <FaExternalLinkAlt className="text-[9px] shrink-0" />
                              </a>
                            ) : (
                              <span>{item.metadata.channel_name}</span>
                            )}
                          </div>
                        )}

                        {item.metadata.video_url && (
                          <div className="flex items-center gap-1.5 text-gray-600 truncate">
                            <span className="font-semibold text-gray-700">Video:</span>
                            <a
                              href={item.metadata.video_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-indigo-600 hover:underline flex items-center gap-1 truncate"
                            >
                              {item.metadata.translated_title || item.metadata.video_title || "Xem video Douyin gốc"}
                              <FaExternalLinkAlt className="text-[9px] shrink-0" />
                            </a>
                          </div>
                        )}

                        {/* Điểm xuất bản Facebook / YouTube */}
                        {item.metadata.published_destinations &&
                          item.metadata.published_destinations.length > 0 && (
                            <div className="pt-1 border-t border-gray-200/60 flex flex-wrap gap-1.5 items-center">
                              <span className="font-semibold text-gray-700 text-[10px]">Đã đăng:</span>
                              {item.metadata.published_destinations.map((dest, idx) => (
                                <a
                                  key={idx}
                                  href={dest.post_url || "#"}
                                  target={dest.post_url ? "_blank" : undefined}
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                    dest.platform === "facebook"
                                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                  }`}
                                >
                                  {dest.platform === "facebook" ? <FaFacebook /> : <FaYoutube />}
                                  {dest.target_name}
                                  {dest.post_url && <FaExternalLinkAlt className="text-[8px]" />}
                                </a>
                              ))}
                            </div>
                          )}

                        {/* Nút Thực thi lại nếu tiến trình bị lỗi */}
                        {item.metadata.can_retry && item.metadata.job_id && (
                          <div className="pt-1.5 flex justify-end">
                            <button
                              type="button"
                              disabled={retryMutation.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.metadata?.job_id) {
                                  retryMutation.mutate(item.metadata.job_id);
                                }
                              }}
                              className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                            >
                              <FaRedo className={`text-[10px] ${retryMutation.isPending ? "animate-spin" : ""}`} />
                              {retryMutation.isPending ? "Đang gửi..." : "Thực thi lại"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    )}
    </div>
  );
};

