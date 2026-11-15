"use client";

import React, { useState } from "react";
import {
  FaEye,
  FaHeart,
  FaComment,
  FaExternalLinkAlt,
  FaVideo,
  FaClock,
} from "react-icons/fa";
import { FacebookVideo } from "../type/facebook.type";
import { Table } from "@/src/core/components/ui/Table";

interface PageVideosTableProps {
  videos: FacebookVideo[];
  isLoading: boolean;
}

export const PageVideosTable: React.FC<PageVideosTableProps> = ({
  videos,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalItems = videos.length;
  const startIndex = (currentPage - 1) * pageSize;
  const currentVideos = videos.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-sm text-gray-500">
        <div className="inline-block animate-spin text-blue-600 text-2xl mb-2">⏳</div>
        <p>Đang tải thông số Video & Thước phim từ Facebook...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-xl">
          <FaVideo />
        </div>
        <h3 className="text-base font-bold text-gray-800">Chưa có video hoặc Reels nào</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Trang này chưa đăng video nào, hoặc các video đang ở trạng thái nháp. Hãy bấm &quot;1-Click Đăng Reels&quot; để đăng video đầu tiên!
        </p>
      </div>
    );
  }

  return (
    <Table
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={(page) => setCurrentPage(page)}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      pageSizeOptions={[5, 10, 20]}
    >
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50/80 text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Video / Thước phim</th>
            <th className="px-5 py-3.5 font-semibold text-center">Lượt xem 🔥</th>
            <th className="px-5 py-3.5 font-semibold text-center">Cảm xúc & Bình luận</th>
            <th className="px-5 py-3.5 font-semibold">Ngày xuất bản</th>
            <th className="px-5 py-3.5 font-semibold text-right">Xem trực tiếp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentVideos.map((vid) => (
            <tr key={vid.id} className="hover:bg-blue-50/20 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-gray-200 flex items-center justify-center">
                    {vid.thumbnail ? (
                      <img
                        src={vid.thumbnail}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaVideo className="text-gray-500 text-lg" />
                    )}
                    {vid.length > 0 && (
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] text-white font-mono px-1 rounded">
                        {formatDuration(vid.length)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 max-w-md">
                    <p className="font-bold text-gray-900 text-xs truncate">
                      {vid.title
                        ? vid.title.replace(/^Video\s*\d+\s*(#Video\d+\s*)?/i, "").trim() || "Thước phim (không tiêu đề)"
                        : "Thước phim (không tiêu đề)"}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {vid.description
                        ? vid.description.replace(/^Video\s*\d+\s*(#Video\d+\s*)?/i, "").trim() || "Không có mô tả"
                        : "Không có mô tả"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {vid.id}</p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-3.5 text-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <FaEye className="text-amber-500" />
                  {vid.views.toLocaleString("vi-VN")}
                </span>
              </td>

              <td className="px-5 py-3.5 text-center">
                <div className="inline-flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-md">
                    <FaHeart className="text-[10px]" />
                    {vid.reactions_count.toLocaleString("vi-VN")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    <FaComment className="text-[10px]" />
                    {vid.comments_count.toLocaleString("vi-VN")}
                  </span>
                </div>
              </td>

              <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <FaClock className="text-gray-400 text-[10px]" />
                  <span>{formatDate(vid.created_time)}</span>
                </div>
              </td>

              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                <a
                  href={vid.id ? `https://www.facebook.com/reel/${vid.id}` : (vid.permalink_url || "https://www.facebook.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 transition-colors"
                >
                  <FaExternalLinkAlt className="text-[10px]" />
                  Mở Reel
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Table>
  );
};

