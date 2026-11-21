"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaEye,
  FaHeart,
  FaComment,
  FaExternalLinkAlt,
  FaVideo,
  FaYoutube,
  FaClock,
  FaTrashAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { YouTubeVideoItem } from "../type/youtube.type";
import { formatVietnamTime } from "@/src/core/lib/date-utils";
import { YouTubeRestrictionCell } from "./YouTubeRestrictionCell";
import { YouTubeVisibilityCell } from "./YouTubeVisibilityCell";
import { YouTubeDeleteConfirmModal } from "./YouTubeDeleteConfirmModal";
import { useDeleteYouTubeVideo } from "../hook/useDeleteYouTubeVideo";

interface YouTubeVideosTableProps {
  videos: YouTubeVideoItem[];
  isLoading: boolean;
  channelId?: string;
}

export const YouTubeVideosTable: React.FC<YouTubeVideosTableProps> = ({
  videos,
  isLoading,
  channelId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVideoToDelete, setSelectedVideoToDelete] = useState<YouTubeVideoItem | null>(null);

  const deleteMutation = useDeleteYouTubeVideo();

  const totalItems = videos.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentVideos = videos.slice(startIndex, startIndex + pageSize);

  const handleConfirmDelete = async (chId: string, vidId: string, title: string) => {
    await deleteMutation.mutateAsync({
      channelId: chId,
      videoId: vidId,
      videoTitle: title,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-sm text-gray-500 shadow-xs">
        <div className="inline-block animate-spin text-red-600 text-2xl mb-2">⏳</div>
        <p>Đang nạp danh sách video &amp; Shorts từ Kênh YouTube...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 text-xl">
          <FaVideo />
        </div>
        <h3 className="text-base font-bold text-gray-800">Chưa có video hoặc Shorts nào</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Kênh YouTube này hiện chưa đăng tải video nào, hoặc bạn vừa đăng tải và YouTube đang xử lý phân phối.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden space-y-4">
      {/* Header Bảng */}
      <div className="p-5 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <FaYoutube className="text-red-600" />
            <span>Danh Sách Video &amp; Shorts Đã Đăng ({totalItems})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Giám sát thời gian thực: Hạn chế bản quyền, chế độ hiển thị và xóa an toàn
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg outline-none font-semibold text-gray-700"
          >
            <option value={5}>5 dòng / trang</option>
            <option value={10}>10 dòng / trang</option>
            <option value={20}>20 dòng / trang</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/70 border-y border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-5">Video &amp; Tiêu đề</th>
              <th className="py-3 px-3">Thông báo</th>
              <th className="py-3 px-3">Chế độ hiển thị</th>
              <th className="py-3 px-4">Thời gian đăng</th>
              <th className="py-3 px-3 text-center">Lượt xem</th>
              <th className="py-3 px-3 text-center">Tương tác</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentVideos.map((v) => {
              const isShorts = v.title.toLowerCase().includes("#shorts");
              const primaryUrl = isShorts
                ? v.shorts_url || `https://www.youtube.com/shorts/${v.id}`
                : v.watch_url || `https://www.youtube.com/watch?v=${v.id}`;

              return (
                <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-5 max-w-[300px]">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden border border-gray-200">
                        {v.thumbnail ? (
                          <Image
                            src={v.thumbnail}
                            alt={v.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-red-600 text-xs">
                            <FaYoutube />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <a
                          href={primaryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-gray-900 hover:text-red-600 line-clamp-2 transition-colors"
                          title={v.title}
                        >
                          {v.title.replace(/^Video\s*\d+\s*(#Video\d+\s*)?/i, "").trim() || v.title}
                        </a>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                              isShorts
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {isShorts ? "Shorts" : "Video Thường"}
                          </span>
                          {v.is_deleted && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                              <FaShieldAlt className="text-[8px] text-emerald-600" /> Đã xóa trên YT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cột Thông Báo (Hạn chế bản quyền - Tooltip) */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <YouTubeRestrictionCell
                      restriction={v.restriction}
                      detail={v.restriction_detail}
                    />
                  </td>

                  {/* Cột Chế Độ Hiển Thị */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <YouTubeVisibilityCell status={v.privacy_status} />
                  </td>

                  {/* Thời gian đăng */}
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <FaClock className="text-gray-400 text-[10px]" />
                      <span>{v.published_at ? formatVietnamTime(v.published_at) : "N/A"}</span>
                    </div>
                  </td>

                  {/* Lượt xem */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      <FaEye className="text-[10px]" />
                      {v.views.toLocaleString()}
                    </span>
                  </td>

                  {/* Tương tác */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600 text-[11px]">
                        <FaHeart className="text-[9px]" />
                        {v.likes}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-500 text-[11px]">
                        <FaComment className="text-[9px]" />
                        {v.comments}
                      </span>
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 transition-colors"
                        title="Xem trên YouTube"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                      </a>

                      {channelId && !v.is_deleted ? (
                        <button
                          type="button"
                          onClick={() => setSelectedVideoToDelete(v)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-red-600 hover:text-white text-gray-500 transition-all cursor-pointer"
                          title="Xóa vĩnh viễn khỏi YouTube (Vẫn giữ DB chống cào lại)"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      ) : v.is_deleted ? (
                        <span
                          className="p-2 rounded-lg bg-gray-50 text-gray-300 cursor-not-allowed"
                          title="Video này đã được xóa trên YouTube và đang khóa chống cào lại"
                        >
                          <FaTrashAlt className="text-xs" />
                        </span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 pt-0 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <span>
            Trang {currentPage} / {totalPages} (Tổng {totalItems} video)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa an toàn */}
      <YouTubeDeleteConfirmModal
        isOpen={Boolean(selectedVideoToDelete)}
        onClose={() => setSelectedVideoToDelete(null)}
        video={selectedVideoToDelete}
        channelId={channelId || ""}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};
