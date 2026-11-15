"use client";

import React, { useState } from "react";
import {
  FaVideo, FaSpinner, FaDownload, FaTrash, FaFileAlt, FaPlay,
  FaChevronLeft, FaChevronRight, FaClosedCaptioning, FaMicrophoneAlt,
  FaFireAlt, FaRocket, FaEye, FaRedo,
} from "react-icons/fa";
import { useDubbingHistory } from "@/src/features/creator/dubbing/hook/useDubbingHistory";
import { useDeleteDubbingJob } from "@/src/features/creator/dubbing/hook/useDeleteDubbingJob";
import { useRetryDubbingJob } from "@/src/features/creator/dubbing/hook/useRetryDubbingJob";
import { useNotificationSocket } from "@/src/features/shared/ws/useNotificationSocket";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { downloadFileWithPicker } from "@/src/core/lib/file-downloader";
import { DubbingHistoryItem } from "@/src/features/creator/dubbing/type/dubbing.type";
import { formatVietnamTime } from "@/src/core/lib/date-utils";
import { DubbingStatusBadge } from "./DubbingStatusBadge";
import { DubbingVideoPreviewModal } from "./DubbingVideoPreviewModal";
import { DubbingJobDetailModal } from "./DubbingJobDetailModal";
import { QuickPublishModal } from "./QuickPublishModal";

export const DubbingJobsTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [selectedDetailJob, setSelectedDetailJob] = useState<DubbingHistoryItem | null>(null);
  const [selectedPublishJob, setSelectedPublishJob] = useState<DubbingHistoryItem | null>(null);

  const { isConnected: isWsConnected } = useNotificationSocket();
  const { data, isLoading, isError, error, refetch } = useDubbingHistory(page, limit);
  const deleteMutation = useDeleteDubbingJob();
  const retryMutation = useRetryDubbingJob();

  const getFullUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001"}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FaVideo className="text-blue-600" /> Bảng Quản Lý Video & Trạng Thái Xử Lý
          </h2>
          <p className="text-xs text-gray-500">
            Duy nhất 1 bảng lưu trữ trên Database — Theo dõi trạng thái thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
              isWsConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isWsConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
            {isWsConnected ? "Socket Realtime" : "Đang kết nối..."}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Hiển thị:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={5}>5 video / trang</option>
              <option value={10}>10 video / trang</option>
              <option value={20}>20 video / trang</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-400">
          <FaSpinner className="animate-spin text-2xl text-blue-600 mx-auto mb-2" />
          <p className="text-xs">Đang nạp dữ liệu tiến trình...</p>
        </div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500 bg-red-50/40 rounded-xl border border-red-100 p-6 space-y-2">
          <p className="text-xs font-semibold text-red-600">Không thể kết nối máy chủ để lấy tiến trình</p>
          <p className="text-[11px] text-gray-500">{(error as any)?.message || "Đã xảy ra sự cố nạp dữ liệu"}</p>
          <button onClick={() => refetch()} className="px-3.5 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
            Thử tải lại
          </button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-14 text-center text-gray-400">
          <p className="text-sm font-semibold text-gray-700">Chưa có tác vụ xử lý nào</p>
          <p className="text-xs text-gray-400 mt-1">Dán link Douyin phía trên để bắt đầu xử lý tự động</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-3">Video / Tiêu đề</th>
                <th className="py-3 px-3">Chế Độ & Giọng Đọc</th>
                <th className="py-3 px-3">Tiến Trình & Trạng Thái</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map((item) => {
                const videoUrl = item.cloudinary_url || item.output_video_url;
                return (
                  <tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-3 px-3 max-w-[300px]">
                      <div onClick={() => setSelectedDetailJob(item)} className="flex items-center gap-3 cursor-pointer group">
                        {item.cover_url ? (
                          <img src={item.cover_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100 border border-gray-200 group-hover:opacity-80 transition" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                            <FaVideo className="text-sm" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition" title={item.title}>
                            {item.title || "Video Douyin"}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate mt-0.5 max-w-[190px]">{item.source_url}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>#{item.id.slice(-6)}</span>
                            <span>•</span>
                            <span className="text-gray-500">{formatVietnamTime(item.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {item.mode === "both" && <FaFireAlt className="text-amber-500" />}
                          {item.mode === "vietsub" && <FaClosedCaptioning className="text-blue-500" />}
                          {item.mode === "dubbing" && <FaMicrophoneAlt className="text-purple-500" />}
                          {item.mode === "download_only" && <FaRocket className="text-emerald-500" />}
                          {item.mode === "both" ? "Sub + Thoại" : item.mode === "vietsub" ? "Chỉ Vietsub" : item.mode === "dubbing" ? "Thuyết Minh" : "Tải Sạch Logo"}
                        </span>
                        {item.mode !== "download_only" && item.mode !== "vietsub" ? (
                          <div className="flex items-center gap-1 text-[10px] text-purple-700 font-semibold bg-purple-50/80 border border-purple-100 px-2 py-0.5 rounded-md w-fit">
                            <FaMicrophoneAlt className="text-[9px] text-purple-500 flex-shrink-0" />
                            <span className="truncate max-w-[120px]" title={item.voice_name || item.voice_preset}>
                              {item.voice_source === "profile"
                                ? (item.voice_name && !item.voice_name.includes("Nam Minh") ? item.voice_name : `Giọng Cá Nhân (#${item.voice_profile_id?.slice(-4) || "AI"})`)
                                : (item.voice_name || (item.voice_preset?.includes("HoaiMy") ? "Hoài My (Nữ)" : "Nam Minh (Nam)"))}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">Không lồng tiếng</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <DubbingStatusBadge item={item} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailJob(item)}
                          className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="Xem chi tiết video & cấu hình"
                        >
                          <FaEye className="text-xs" />
                        </button>
                        {videoUrl && item.status === "completed" && (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedPublishJob(item)}
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Đăng video lên Facebook / YouTube"
                            >
                              <FaRocket className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewVideoUrl(getFullUrl(videoUrl))}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Xem trực tiếp video"
                            >
                              <FaPlay className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadFileWithPicker(getFullUrl(videoUrl), `video_${item.id.slice(-6)}.mp4`, "mp4")}
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Tải MP4"
                            >
                              <FaDownload className="text-xs" />
                            </button>
                          </>
                        )}
                        {item.subtitle_srt_url && item.status === "completed" && (
                          <button
                            type="button"
                            onClick={() => downloadFileWithPicker(getFullUrl(item.subtitle_srt_url!), `sub_${item.id.slice(-6)}.srt`, "srt")}
                            className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Tải Sub SRT"
                          >
                            <FaFileAlt className="text-xs" />
                          </button>
                        )}
                        {(item.status === "failed" || item.status === "processing") && (
                          <button
                            type="button"
                            disabled={retryMutation.isPending}
                            onClick={() => retryMutation.mutate(item.id)}
                            className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            title={item.status === "processing" ? "Khởi động lại tác vụ này" : "Thử lại tác vụ này"}
                          >
                            <FaRedo className={`text-xs ${retryMutation.isPending ? "animate-spin" : ""}`} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa tác vụ"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span>Trang {page} / {totalPages} (Tổng {data?.total} tác vụ)</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}

      <DubbingVideoPreviewModal url={previewVideoUrl} onClose={() => setPreviewVideoUrl(null)} />
      <DubbingJobDetailModal job={selectedDetailJob} onClose={() => setSelectedDetailJob(null)} />
      <QuickPublishModal
        isOpen={!!selectedPublishJob}
        onClose={() => setSelectedPublishJob(null)}
        job={selectedPublishJob}
      />

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteMutation.mutate(deleteTargetId, { onSuccess: () => setDeleteTargetId(null) });
        }}
        title="Xóa Tác Vụ Video"
        message="Bạn có chắc chắn muốn xóa tác vụ xử lý này khỏi thư viện cá nhân? Thao tác này không thể hoàn tác."
        confirmText="Xác nhận xóa"
        isDangerous={true}
      />
    </div>
  );
};
