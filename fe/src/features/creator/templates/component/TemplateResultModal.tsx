"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaCloud, FaDownload, FaTimes } from "react-icons/fa";
import { TemplateRenderResponse } from "../type/templates.types";

interface TemplateResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TemplateRenderResponse | null;
}

export const TemplateResultModal: React.FC<TemplateResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !result || !mounted) return null;

  const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const streamSrc = result.stream_url.startsWith("http")
    ? result.stream_url
    : `${apiHost}${result.stream_url}`;
  const downloadSrc = result.download_url.startsWith("http")
    ? result.download_url
    : `${apiHost}${result.download_url}`;

  const isCloudinary = result.stream_url.includes("cloudinary.com");

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Central Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
              <FaCheck />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">Kết quả render video</h3>
              <p className="text-[11px] font-mono text-slate-400">
                {result.filename}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors cursor-pointer"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Video Player */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          <div className="flex justify-center bg-slate-950 rounded p-2">
            <video
              src={streamSrc}
              controls
              autoPlay
              playsInline
              className="max-h-[360px] w-auto rounded object-contain"
            />
          </div>

          {/* Cloudinary CDN Notice */}
          {isCloudinary && (
            <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] font-mono text-emerald-800">
              <span className="flex items-center gap-1.5 font-medium">
                <FaCloud className="text-xs text-emerald-600" /> Cloudinary CDN
              </span>
              <span className="text-emerald-700">Đã giải phóng ổ cứng cục bộ</span>
            </div>
          )}

          {/* Technical Meta Grid */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-400 block">Thời lượng</span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{result.duration}s</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-400 block">Dung lượng</span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{result.file_size_mb} MB</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-400 block">Thời gian</span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{result.elapsed_seconds}s</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-2 rounded">
              <span className="text-[10px] text-slate-400 block">Encoder</span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{result.encoder_used}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <a
            href={downloadSrc}
            download={result.filename}
            className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FaDownload className="text-[10px]" /> Tải video
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};
