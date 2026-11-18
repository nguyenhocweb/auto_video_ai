"use client";

import React, { useState } from "react";
import { FaEye, FaHeart, FaComment, FaShare, FaExternalLinkAlt, FaPlay, FaPlus } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { TikTokChannelItem, TikTokVideoItem } from "../type/tiktok.type";
import { useTikTokChannelVideos } from "../hook/useTikTokChannelVideos";
import { Table } from "@/src/core/components/ui/Table";
import { formatVietnamTime } from "@/src/core/lib/date-utils";

interface TikTokVideosTableProps {
  channel: TikTokChannelItem | null;
  onOpenPublishModal: () => void;
}

export const TikTokVideosTable: React.FC<TikTokVideosTableProps> = ({
  channel,
  onOpenPublishModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useTikTokChannelVideos(channel?.channel_id);
  const videos = data?.videos || [];

  const totalItems = videos.length;
  const startIndex = (currentPage - 1) * pageSize;
  const currentVideos = videos.slice(startIndex, startIndex + pageSize);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!channel) return null;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-12 text-center text-sm text-gray-500">
        <div className="inline-block animate-spin text-rose-500 text-2xl mb-2">⏳</div>
        <p>Đang tải thông số Video TikTok từ Open API v2...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center mx-auto mb-3 text-xl font-bold">
          <SiTiktok />
        </div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
          Chưa có video nào trên kênh {channel.display_name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-5">
          Kênh này chưa đăng video công khai nào hoặc token chưa có quyền video.list. Hãy bấm nút dưới đây để đăng video đầu tiên!
        </p>
        <button
          type="button"
          onClick={onOpenPublishModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
        >
          <FaPlus className="text-xs text-rose-500" />
          <span>1-Click Đăng Video Ngay</span>
        </button>
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
      <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
        <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Video TikTok</th>
            <th className="px-5 py-3.5 font-semibold text-center">Lượt xem 🔥</th>
            <th className="px-5 py-3.5 font-semibold text-center">Cảm xúc &amp; Tương tác</th>
            <th className="px-5 py-3.5 font-semibold">Ngày xuất bản</th>
            <th className="px-5 py-3.5 font-semibold text-right">Xem trực tiếp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {currentVideos.map((vid: TikTokVideoItem) => (
            <tr key={vid.id} className="hover:bg-rose-50/20 dark:hover:bg-rose-950/10 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    {vid.cover_image_url ? (
                      <img
                        src={vid.cover_image_url}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaPlay className="text-gray-500 text-lg" />
                    )}
                    {vid.duration ? (
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] text-white font-mono px-1 rounded">
                        {formatDuration(vid.duration)}
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0 max-w-md">
                    <p className="font-bold text-gray-900 dark:text-white text-xs truncate">
                      {vid.title || "Video TikTok (không tiêu đề)"}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {vid.video_description || "Không có mô tả thêm"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {vid.id}</p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-3.5 text-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                  <FaEye className="text-amber-500" />
                  {(vid.view_count || 0).toLocaleString("vi-VN")}
                </span>
              </td>

              <td className="px-5 py-3.5 text-center">
                <div className="inline-flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                    <FaHeart className="text-[10px]" />
                    {(vid.like_count || 0).toLocaleString("vi-VN")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                    <FaComment className="text-[10px]" />
                    {(vid.comment_count || 0).toLocaleString("vi-VN")}
                  </span>
                  {typeof vid.share_count === "number" && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      <FaShare className="text-[10px]" />
                      {vid.share_count.toLocaleString("vi-VN")}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {vid.create_time
                  ? formatVietnamTime(new Date(vid.create_time * 1000))
                  : "Chưa rõ"}
              </td>

              <td className="px-5 py-3.5 text-right">
                {vid.share_url ? (
                  <a
                    href={vid.share_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 rounded-lg transition-colors"
                  >
                    <span className="text-[11px]">Xem</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Table>
  );
};
