"use client";

import React, { useState } from "react";
import { FaPlay, FaPause, FaTrash, FaCheckCircle, FaVolumeUp, FaShieldAlt, FaSearch, FaCheck, FaCloud } from "react-icons/fa";
import { BgmTrack, CopyrightCheckResult } from "../type/bgm.type";
import { useCheckCopyrightTrack } from "../hook/useCheckCopyright";

interface BgmTrackItemProps {
  track: BgmTrack;
  isPlaying: boolean;
  onTogglePlay: (track: BgmTrack) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const MOOD_COLORS: Record<string, string> = {
  chill: "bg-blue-50 text-blue-700 border-blue-200",
  upbeat: "bg-pink-50 text-pink-700 border-pink-200",
  funny: "bg-amber-50 text-amber-700 border-amber-200",
  asmr: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cinematic: "bg-purple-50 text-purple-700 border-purple-200",
  general: "bg-gray-50 text-gray-700 border-gray-200",
};

export const BgmTrackItem: React.FC<BgmTrackItemProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onDelete,
  isDeleting = false,
  isSelectable = false,
  isSelected = false,
  onToggleSelect,
}) => {
  const [scanResult, setScanResult] = useState<CopyrightCheckResult | null>(null);
  const scanMutation = useCheckCopyrightTrack();

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleScan = () => {
    scanMutation.mutate(track.id, {
      onSuccess: (data) => setScanResult(data),
    });
  };

  const moodColor = MOOD_COLORS[track.mood] || MOOD_COLORS.general;

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 ${
        isSelected
          ? "bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400/30 shadow-xs"
          : isPlaying
          ? "bg-indigo-50/60 border-indigo-400 ring-1 ring-indigo-400/20 shadow-xs"
          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {isSelectable && (
            <button
              type="button"
              onClick={() => onToggleSelect?.(track.id)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
              title={isSelected ? "Bỏ chọn bài này" : "Chọn bài này vào danh sách Random"}
            >
              {isSelected && <FaCheck className="text-[10px]" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => onTogglePlay(track)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0 ${
              isPlaying
                ? "bg-indigo-600 text-white shadow-xs animate-pulse"
                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
            }`}
            title={isPlaying ? "Tạm dừng" : "Nghe thử"}
          >
            {isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs ml-0.5" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {track.title}
              </h4>
              {track.is_preset && (
                <span className="shrink-0 flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 font-semibold px-1.5 py-0.2 rounded-md">
                  <FaCheckCircle className="text-[9px]" /> Sạch bản quyền
                </span>
              )}
              {track.sanitized && !track.is_preset && (
                <span className="shrink-0 flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 font-semibold px-1.5 py-0.2 rounded-md">
                  <FaShieldAlt className="text-[9px]" /> Đã khử bản quyền DSP
                </span>
              )}
              {track.audio_url?.startsWith("http") && (
                <span className="shrink-0 flex items-center gap-1 text-[10px] text-sky-700 bg-sky-50 border border-sky-200 font-semibold px-1.5 py-0.2 rounded-md">
                  <FaCloud className="text-[9px]" /> Cloudinary
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase ${moodColor}`}>
                {track.mood}
              </span>
              <span>•</span>
              <span className="font-mono">{formatSec(track.duration)}</span>
              {isPlaying && (
                <span className="text-indigo-600 flex items-center gap-1 font-semibold animate-pulse">
                  <FaVolumeUp className="text-[10px]" /> Đang phát...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={scanMutation.isPending}
            onClick={handleScan}
            className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            title="Quét bản quyền bài này"
          >
            <FaSearch className="text-[9px]" />
            <span>{scanMutation.isPending ? "Đang quét..." : "Kiểm tra bản quyền"}</span>
          </button>

          {!track.is_preset && onDelete && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(track.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa bài nhạc"
            >
              <FaTrash className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Hiển thị kết quả thẩm định bản quyền nhanh nếu user vừa bấm quét */}
      {scanResult && (
        <div
          className={`text-[11px] p-2.5 rounded-xl border flex items-start gap-2 ${
            scanResult.risk_level === "danger"
              ? "bg-red-50 border-red-200 text-red-900"
              : scanResult.risk_level === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}
        >
          {scanResult.risk_level === "danger" ? (
            <FaShieldAlt className="text-red-600 shrink-0 mt-0.5" />
          ) : scanResult.risk_level === "warning" ? (
            <FaShieldAlt className="text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <FaCheckCircle className="text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-0.5">
            <p className="font-semibold">{scanResult.details}</p>
            <p className="opacity-90">{scanResult.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
