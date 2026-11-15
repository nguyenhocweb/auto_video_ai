"use client";

import React from "react";
import { FiDownload, FiImage, FiVideo, FiCheckCircle } from "react-icons/fi";
import { SliceVideoToTemplateResponse } from "../type/slicer.type";

interface SlotResultGalleryProps {
  result: SliceVideoToTemplateResponse;
}

export const SlotResultGallery: React.FC<SlotResultGalleryProps> = ({ result }) => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

  const getFullUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
      return relativeUrl;
    }
    return `${apiBase}${relativeUrl}`;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-zinc-100">
              Đã trích xuất {result.total_slots} tư liệu khớp mẫu
            </div>
            <div className="text-xs text-zinc-400">
              Phát hiện {result.detected_scenes_count} phân cảnh • Độ dài gốc: {result.video_info.duration}s
            </div>
          </div>
        </div>

        <a
          href={getFullUrl(result.zip_download_url)}
          download
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition"
        >
          <FiDownload className="w-4 h-4" />
          Tải trọn bộ Asset Pack (.ZIP)
        </a>
      </div>

      {/* Grid of slot assets */}
      <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 md:grid-cols-3 gap-3">
        {result.assets.map((asset) => {
          const fileUrl = getFullUrl(asset.download_url);

          return (
            <div
              key={asset.slot_id + asset.index}
              className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition"
            >
              {/* Media preview */}
              <div className="relative aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">
                {asset.type === "image" ? (
                  <img
                    src={fileUrl}
                    alt={asset.file_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <video
                    src={fileUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Badge top left */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                  {asset.type === "image" ? (
                    <>
                      <FiImage className="w-3 h-3 text-emerald-400" />
                      <span>ẢNH #{asset.index}</span>
                    </>
                  ) : (
                    <>
                      <FiVideo className="w-3 h-3 text-violet-400" />
                      <span>CLIP {asset.duration}s</span>
                    </>
                  )}
                </div>

                {/* Timestamp badge top right */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300">
                  @{asset.timestamp}s
                </div>
              </div>

              {/* Bottom detail & download */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-zinc-950/80">
                <span className="text-[11px] font-mono text-zinc-400 truncate" title={asset.file_name}>
                  {asset.file_name}
                </span>

                <a
                  href={fileUrl}
                  download={asset.file_name}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-zinc-400 hover:text-white rounded bg-zinc-800 hover:bg-zinc-700 transition"
                  title="Tải riêng file này"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

