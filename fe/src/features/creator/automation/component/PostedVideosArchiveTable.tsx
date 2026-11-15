"use client";

import React, { useState } from "react";
import {
  FaDatabase,
  FaExternalLinkAlt,
  FaFacebook,
  FaShieldAlt,
  FaSpinner,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { useGetPostedVideos } from "../hook/useGetPostedVideos";
import { PostedVideo } from "../type/automation.type";
import { formatVietnamTime } from "@/src/core/lib/date-utils";

export const PostedVideosArchiveTable: React.FC = () => {
  const { data, isLoading } = useGetPostedVideos();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const postedVideos = data?.posted_videos || [];
  const totalPages = Math.ceil(postedVideos.length / pageSize) || 1;
  const paginated = postedVideos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatTime = (isoString: string) => formatVietnamTime(isoString);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-xs flex items-center justify-center gap-2">
        <FaSpinner className="animate-spin text-blue-600 text-lg" />
        <span>Đang nạp danh sách video đã lưu trong Database...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Bảng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
            <FaDatabase />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Kho Video Đã Lưu Trong Database ({postedVideos.length})</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FaShieldAlt className="text-[9px]" /> Chống trùng lặp 100%
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Mọi video đã đăng đều được lưu kèm ID và Link Douyin. Hệ thống sẽ bỏ qua nếu phát hiện trùng trong các lần cào sau.
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
      {postedVideos.length === 0 ? (
        <div className="p-10 text-center text-gray-400 text-xs">
          Chưa có video nào trong Database. Khi các chiến dịch Automation cào và đăng video thành công, toàn bộ ID và Link sẽ tự động lưu vào đây!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã ID & Link Douyin</th>
                <th className="py-3 px-4">Tiêu đề video (Đã dịch)</th>
                <th className="py-3 px-4">Kênh nguồn / Chiến dịch</th>
                <th className="py-3 px-4">Thời gian đăng</th>
                <th className="py-3 px-4">Chế độ</th>
                <th className="py-3 px-4">Fanpage Facebook đã đăng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((item: PostedVideo) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-gray-800 text-[11px]">
                      {item.video_item_id}
                    </div>
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center gap-1 text-[10px] mt-0.5"
                    >
                      <FaVideo className="text-[9px]" /> Mở Douyin <FaExternalLinkAlt className="text-[8px]" />
                    </a>
                  </td>
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="font-bold text-gray-900 truncate" title={item.title_translated || item.title_original}>
                      {item.title_translated || item.title_original}
                    </div>
                    {item.title_original && item.title_translated && (
                      <div className="text-[10px] text-gray-400 truncate">
                        Gốc: {item.title_original}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-700 max-w-[160px]">
                    <div className="truncate">{item.channel_name}</div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {item.campaign_name}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                    {formatTime(item.created_at)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {item.processing_mode === "both"
                        ? "Sub + Thuyết minh"
                        : item.processing_mode === "vietsub"
                        ? "Vietsub AI"
                        : item.processing_mode === "dubbing"
                        ? "Thuyết minh AI"
                        : "Gốc sạch logo"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <div className="flex flex-wrap gap-1.5">
                      {item.published_pages && item.published_pages.map((p, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
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

                      {((item.published_youtube_channels && item.published_youtube_channels.length > 0)
                        ? item.published_youtube_channels
                        : item.published_youtube
                        ? [item.published_youtube]
                        : []
                      ).map((yt, yIdx) => (
                        <div
                          key={`yt-posted-${yIdx}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-red-50 text-red-700 border border-red-200"
                        >
                          <FaYoutube className="text-[10px] text-red-600" />
                          <span>{yt.channel_title || "Shorts"}</span>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang */}
      {postedVideos.length > pageSize && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50/50">
          <span>
            Trang {currentPage} / {totalPages} (Tổng {postedVideos.length} video đã lưu)
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

