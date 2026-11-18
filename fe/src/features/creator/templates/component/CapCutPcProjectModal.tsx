"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaCheck,
  FaCopy,
  FaDesktop,
  FaFolderOpen,
  FaMusic,
  FaPlay,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { CreateCapCutDesktopResponse } from "../type/templates.types";
import { useLaunchCapCut } from "../hook/useTemplates";

interface CapCutPcProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CreateCapCutDesktopResponse | null;
}

export const CapCutPcProjectModal: React.FC<CapCutPcProjectModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const launchMutation = useLaunchCapCut();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !result || !mounted) return null;

  const handleCopyPath = () => {
    if (result.project_path) {
      navigator.clipboard.writeText(result.project_path);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenFolder = async () => {
    setActionMsg(null);
    try {
      const res = await launchMutation.mutateAsync(result.project_path);
      setActionMsg(res.message);
    } catch (err: any) {
      setActionMsg(err.message || "Không thể mở thư mục tự động");
    }
  };

  const handleOpenCapCutApp = async () => {
    setActionMsg(null);
    try {
      const res = await launchMutation.mutateAsync();
      setActionMsg(res.message);
    } catch (err: any) {
      setActionMsg(err.message || "Không thể khởi động CapCut PC tự động");
    }
  };

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
              <FaCheck />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">
                Đã tạo Dự án CapCut PC thành công
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                100% Hiệu ứng gốc • Nhạc gốc • Chuyển cảnh gốc
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Success Banner */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded text-emerald-800 text-[11px] leading-relaxed">
            <p className="font-medium">
              🎉 Dự án đã được đăng ký trực tiếp vào CapCut Desktop trên máy bạn!
            </p>
            <p className="text-emerald-700 mt-1">
              Toàn bộ timeline, hiệu ứng keyframes, sticker chuyển động, âm thanh gốc và các slot media của bạn đã sẵn sàng xuất video 4K/60FPS không watermark.
            </p>
          </div>

          {/* Project Details */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tên dự án:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[280px]">
                {result.project_name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Thời lượng:</span>
              <span className="text-slate-800">{result.total_duration} giây</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Media đã nạp:</span>
              <span className="text-slate-800">{result.slots_count} vị trí slot</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block mb-1">Thư mục dự án:</span>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded p-1.5">
                <span className="text-[10px] text-slate-700 truncate select-all flex-1">
                  {result.project_path}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPath}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] shrink-0 transition-colors cursor-pointer"
                >
                  {copied ? "Đã copy" : <FaCopy className="text-[10px]" />}
                </button>
              </div>
            </div>
          </div>

          {actionMsg && (
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-700 text-[11px]">
              {actionMsg}
            </div>
          )}

          {/* Guide Steps */}
          <div className="space-y-1.5 text-[11px] text-slate-600 bg-white border border-slate-100 rounded p-3">
            <p className="font-semibold text-slate-800">📌 Hướng dẫn mở dự án:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Mở ứng dụng <strong>CapCut PC</strong> trên màn hình máy tính.</li>
              <li>Tại trang chủ (Home), dự án <strong>{result.project_name}</strong> sẽ xuất hiện ngay ở đầu danh sách.</li>
              <li>Bấm mở dự án và bấm nút <strong>Xuất (Export)</strong> ở góc trên bên phải để nhận video hoàn chỉnh!</li>
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenFolder}
              disabled={launchMutation.isPending}
              className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FaFolderOpen className="text-xs text-amber-600" />
              <span>Mở thư mục</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCapCutApp}
              disabled={launchMutation.isPending}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {launchMutation.isPending ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaDesktop className="text-xs" />
              )}
              <span>Mở CapCut PC</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-200 hover:bg-slate-200/70 text-slate-600 text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
