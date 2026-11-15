"use client";

import React, { useState } from "react";
import {
  FaTrash,
  FaDownload,
  FaMusic,
  FaVideo,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { useGetDownloadedVideos } from "../hook/useGetDownloadedVideos";
import { useDeleteDownloadedVideo } from "../hook/useDeleteDownloadedVideo";
import { getProxyDownloadUrl } from "../service/video.download.service";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { VideoRecordItem } from "../type/video.type";

export const VideoHistoryList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading } = useGetDownloadedVideos({ page, limit });
  const deleteMutation = useDeleteDownloadedVideo();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        setDeleteTargetId(null);
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FaVideo className="text-blue-600" /> Thư Viện Video Đã Tải
          </h2>
          <p className="text-xs text-gray-500">
            Tổng hợp các video bạn đã bóc tách và lưu trữ trong tài khoản
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={6}>6 video / trang</option>
            <option value={12}>12 video / trang</option>
            <option value={24}>24 video / trang</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400 gap-3">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
          <p className="text-xs">Đang tải danh sách video...</p>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-xl text-gray-300">
            <FaVideo />
          </div>
          <p className="text-sm font-semibold text-gray-700">Chưa có video nào trong thư viện</p>
          <p className="text-xs text-gray-400 mt-1">
            Dán đường link Douyin ở biểu mẫu phía trên để bắt đầu bóc tách video không logo
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {data.items.map((item: VideoRecordItem) => {
              const mp4Url = getProxyDownloadUrl(item.video_url, `douyin_${item.item_id}.mp4`);
              const mp3Url = item.music_url
                ? getProxyDownloadUrl(item.music_url, `douyin_${item.item_id}.mp3`)
                : null;

              return (
                <div
                  key={item.id}
                  className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                      {item.cover_url ? (
                        <img
                          src={item.cover_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <FaVideo className="text-3xl text-gray-500" />
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-white flex items-center gap-1 font-semibold">
                        <FaClock className="text-[8px]" /> {formatDuration(item.duration)}
                      </div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] text-white font-bold">
                        Sạch Logo
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {item.author_avatar ? (
                          <img
                            src={item.author_avatar}
                            alt={item.author_name || ""}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : null}
                        <span className="text-xs font-semibold text-gray-600 truncate">
                          {item.author_name || "Douyin Creator"}
                        </span>
                      </div>
                      <h3
                        className="text-xs font-bold text-gray-800 line-clamp-2 leading-relaxed"
                        title={item.title}
                      >
                        {item.title || "Video không tiêu đề"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-100/60 mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={mp4Url}
                        download
                        className="p-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        title="Tải MP4"
                      >
                        <FaDownload /> MP4
                      </a>
                      {mp3Url && (
                        <a
                          href={mp3Url}
                          download
                          className="p-2 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1"
                          title="Tải MP3"
                        >
                          <FaMusic /> MP3
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-2 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa video"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phân trang */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Tổng số <span className="font-bold text-gray-800">{data.total}</span> video
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft className="text-[10px]" /> Trước
              </button>

              <span className="text-xs text-gray-600 font-medium px-2">
                Trang {data.page} / {data.total_pages}
              </span>

              <button
                type="button"
                disabled={page >= data.total_pages}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sau <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Xác nhận xóa video"
        message="Bạn có chắc chắn muốn xóa video này khỏi thư viện cá nhân? Thao tác này không thể hoàn tác."
        confirmText="Xác nhận xóa"
        isDangerous={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

