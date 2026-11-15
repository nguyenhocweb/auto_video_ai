"use client";

import React, { useState } from "react";
import { FaHistory, FaImage, FaFont, FaVideo, FaEye } from "react-icons/fa";
import { InspectorRecord } from "../type/inspector.type";

interface InspectorHistoryTableProps {
  history: InspectorRecord[];
  isLoading: boolean;
  onSelectRecord?: (record: InspectorRecord) => void;
}

export const InspectorHistoryTable: React.FC<InspectorHistoryTableProps> = ({
  history,
  isLoading,
  onSelectRecord,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const total = history.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = history.slice(startIndex, startIndex + pageSize);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "image":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <FaImage className="text-[10px]" /> Ảnh Bìa
          </span>
        );
      case "text_policy":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <FaFont className="text-[10px]" /> Kịch Bản
          </span>
        );
      case "video_pacing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <FaVideo className="text-[10px]" /> Video Pacing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            {type}
          </span>
        );
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {score} / 100 🔥
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {score} / 100
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {score} / 100
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        {score} / 100 ⚠️
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <FaHistory className="text-gray-500" />
          <h4 className="text-sm font-bold text-gray-900">
            Lịch Sử Các Lần Thẩm Định Của Bạn
          </h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold">
            {total} kết quả
          </span>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value={5}>5 dòng / trang</option>
            <option value={10}>10 dòng / trang</option>
            <option value={20}>20 dòng / trang</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-xs text-gray-400">
          Đang tải lịch sử thẩm định...
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-400">
          Chưa có bản ghi thẩm định nào. Hãy thử phân tích ảnh bìa hoặc kịch bản ở trên!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Loại Thẩm Định</th>
                <th className="py-2.5 px-3">Tóm Tắt Đánh Giá</th>
                <th className="py-2.5 px-3">Điểm Số</th>
                <th className="py-2.5 px-3">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-3 whitespace-nowrap">{getTypeBadge(item.type)}</td>
                  <td className="py-3 px-3 max-w-md truncate text-gray-700 font-medium">
                    {item.summary}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{getScoreBadge(item.score)}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-gray-400 text-[11px]">
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
          <span className="text-gray-400 text-[11px]">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

