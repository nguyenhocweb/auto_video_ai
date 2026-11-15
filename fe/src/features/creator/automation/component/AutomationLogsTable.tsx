"use client";

import React, { useState } from "react";
import {
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaSpinner,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import { useGetAutomationLogs } from "../hook/useGetAutomationLogs";
import { AutomationLog } from "../type/automation.type";
import { formatVietnamTime } from "@/src/core/lib/date-utils";

export const AutomationLogsTable: React.FC = () => {
  const { data, isLoading } = useGetAutomationLogs();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const logs = data?.logs || [];
  const totalPages = Math.ceil(logs.length / pageSize) || 1;
  const paginatedLogs = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatTime = (isoString: string) => formatVietnamTime(isoString);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FaCheckCircle className="text-[10px]" /> Thành công
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <FaExclamationTriangle className="text-[10px]" /> Đăng 1 phần
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <FaTimesCircle className="text-[10px]" /> Thất bại
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <FaSpinner className="animate-spin text-[10px]" /> Đang xử lý
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
        <FaSpinner className="animate-spin text-blue-600 text-lg" />
        <span>Đang nạp lịch sử hoạt động Automation...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Bảng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
            <FaHistory />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Lịch Sử Cào & Đăng Tự Động ({logs.length})
            </h3>
            <p className="text-xs text-gray-400">
              Nhật ký chi tiết các video đã bóc tách, dịch thuật và xuất bản lên Facebook Reels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-gray-500">
          <span>Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 bg-gray-50 border border-gray-300 rounded-lg outline-none font-semibold"
          >
            <option value={5}>5 dòng / trang</option>
            <option value={10}>10 dòng / trang</option>
            <option value={20}>20 dòng / trang</option>
          </select>
        </div>
      </div>

      {/* Nội dung bảng */}
      {logs.length === 0 ? (
        <div className="p-10 text-center text-gray-400 text-xs">
          Chưa có nhật ký cào hoặc đăng bài tự động nào được ghi nhận.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Chiến dịch / Nguồn</th>
                <th className="py-3 px-4">Tên video dịch</th>
                <th className="py-3 px-4">Chế độ</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Fanpage đã đăng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log: AutomationLog) => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                    {formatTime(log.created_at)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900 max-w-[180px]">
                    <div className="truncate" title={log.campaign_name}>
                      {log.campaign_name}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      Nguồn: {log.source_channel_name}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-800 max-w-[240px]">
                    <div className="font-bold truncate text-blue-950" title={log.video_translated_title || log.video_original_title}>
                      {log.video_translated_title || log.video_original_title}
                    </div>
                    {log.video_original_title && log.video_translated_title && (
                      <div className="text-[10px] text-gray-400 truncate">
                        Gốc: {log.video_original_title}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {log.processing_mode === "both"
                        ? "Sub + Thuyết minh"
                        : log.processing_mode === "vietsub"
                        ? "Vietsub AI"
                        : log.processing_mode === "dubbing"
                        ? "Thuyết minh AI"
                        : "Gốc sạch logo"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <div className="flex flex-wrap gap-1.5">
                      {log.published_pages && log.published_pages.map((p, idx) => (
                        <div
                          key={idx}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${
                            p.success
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <FaFacebook className="text-[9px]" />
                          <span className="truncate max-w-[100px]">{p.page_name}</span>
                          {p.reel_url && (
                            <a
                              href={p.reel_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 ml-0.5"
                              title="Xem Reel trên Facebook"
                            >
                              <FaExternalLinkAlt className="text-[8px]" />
                            </a>
                          )}
                        </div>
                      ))}

                      {((log.published_youtube_channels && log.published_youtube_channels.length > 0)
                        ? log.published_youtube_channels
                        : log.published_youtube
                        ? [log.published_youtube]
                        : []
                      ).map((yt, yIdx) => (
                        <div
                          key={`yt-${yIdx}`}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${
                            yt.success
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <FaYoutube className="text-[10px] text-red-600" />
                          <span className="truncate max-w-[100px]">{yt.channel_title || "Shorts"}</span>
                          {yt.shorts_url && (
                            <a
                              href={yt.shorts_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-600 hover:text-red-800 ml-0.5"
                              title="Xem Shorts trên YouTube"
                            >
                              <FaExternalLinkAlt className="text-[8px]" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                    {(!log.published_pages || log.published_pages.length === 0) &&
                      (!log.published_youtube_channels || log.published_youtube_channels.length === 0) &&
                      !log.published_youtube && (
                      <span className="text-gray-400 text-[11px]">
                        {log.error || "Không có bài đăng"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang */}
      {logs.length > pageSize && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
          <span>
            Trang {currentPage} / {totalPages} (Tổng {logs.length} bản ghi)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

