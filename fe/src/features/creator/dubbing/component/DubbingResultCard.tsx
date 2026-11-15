"use client";

import React, { useState } from "react";
import { FaDownload, FaFileAlt, FaCheck, FaPlayCircle } from "react-icons/fa";
import { DubbingJobResponse } from "../type/dubbing.type";

interface DubbingResultCardProps {
  job: DubbingJobResponse;
}

export const DubbingResultCard: React.FC<DubbingResultCardProps> = ({ job }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const getFullUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const saveFileWithPicker = async (url: string, suggestedName: string, mimeType: string, ext: string) => {
    setDownloading(ext);
    try {
      const fullUrl = getFullUrl(url);
      const res = await fetch(fullUrl);
      const blob = await res.blob();

      // Sử dụng File System Access API để mở hộp thoại Save As trên Windows
      if ("showSaveFilePicker" in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName,
            types: [
              {
                description: `${ext.toUpperCase()} File`,
                accept: { [mimeType]: [`.${ext}`] },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (pickerErr: any) {
          if (pickerErr.name === "AbortError") return;
        }
      }

      // Fallback nếu trình duyệt không hỗ trợ File System Access API
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Lỗi khi tải file:", err);
    } finally {
      setDownloading(null);
    }
  };

  const videoUrl = getFullUrl(job.output_video_url);

  return (
    <div className="rounded-xl border border-green-200/90 bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-green-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-green-100 text-green-600">
            <FaCheck className="text-xs" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Video Thành Phẩm Đã Sẵn Sàng</h3>
            <p className="text-[11px] text-gray-500">Chế độ: <span className="font-semibold text-green-700 uppercase">{job.mode}</span></p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
          Xử lý thành công 100%
        </span>
      </div>

      {/* Trình phát video xem trực tiếp */}
      {videoUrl && (
        <div className="rounded-xl overflow-hidden bg-black/95 max-h-[360px] flex items-center justify-center">
          <video
            controls
            playsInline
            src={videoUrl}
            className="max-h-[360px] w-auto mx-auto rounded-lg shadow-inner"
          />
        </div>
      )}

      {/* Nhóm các nút tải về có Save As dialog */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {job.output_video_url && (
          <button
            type="button"
            onClick={() =>
              saveFileWithPicker(
                job.output_video_url!,
                `video_${job.mode}_${job.id.slice(-6)}.mp4`,
                "video/mp4",
                "mp4"
              )
            }
            disabled={downloading === "mp4"}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <FaDownload />
            {downloading === "mp4" ? "Đang lưu video..." : "Tải Video MP4 (Chọn Thư Mục Lưu)"}
          </button>
        )}

        {job.subtitle_srt_url && (
          <button
            type="button"
            onClick={() =>
              saveFileWithPicker(
                job.subtitle_srt_url!,
                `sub_${job.id.slice(-6)}.srt`,
                "text/plain",
                "srt"
              )
            }
            disabled={downloading === "srt"}
            className="flex items-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
          >
            <FaFileAlt className="text-gray-500" />
            {downloading === "srt" ? "Lưu SRT..." : "Tải Phụ Đề .SRT"}
          </button>
        )}

        {job.subtitle_ass_url && (
          <button
            type="button"
            onClick={() =>
              saveFileWithPicker(
                job.subtitle_ass_url!,
                `sub_${job.id.slice(-6)}.ass`,
                "text/plain",
                "ass"
              )
            }
            disabled={downloading === "ass"}
            className="flex items-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
          >
            <FaFileAlt className="text-gray-500" />
            {downloading === "ass" ? "Lưu ASS..." : "Tải Phụ Đề .ASS"}
          </button>
        )}
      </div>
    </div>
  );
};

