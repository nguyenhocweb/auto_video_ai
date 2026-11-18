"use client";

import React from "react";
import { FaCheckCircle, FaDice, FaInfoCircle, FaTimes } from "react-icons/fa";
import { BgmTrack } from "@/src/features/creator/bgm/type/bgm.type";

interface ReupBgmPoolDisplayProps {
  selectedBgmIds: string[];
  allTracks: BgmTrack[];
  onOpenLibrary: () => void;
  onResetToRandomAll: () => void;
  onRemoveTrack: (id: string) => void;
}

export const ReupBgmPoolDisplay: React.FC<ReupBgmPoolDisplayProps> = ({
  selectedBgmIds,
  allTracks,
  onOpenLibrary,
  onResetToRandomAll,
  onRemoveTrack,
}) => {
  const selectedTracks = allTracks.filter((t) => selectedBgmIds.includes(t.id));

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <FaDice className="text-emerald-600 text-[11px]" />
          Chế độ gán nhạc ngẫu nhiên:
        </span>
        {selectedBgmIds.length > 0 && (
          <button
            type="button"
            onClick={onResetToRandomAll}
            className="text-[11px] text-emerald-700 hover:text-emerald-900 hover:underline font-medium cursor-pointer"
          >
            (Đặt lại về Random toàn bộ kho)
          </button>
        )}
      </div>

      {selectedBgmIds.length === 0 ? (
        <div className="p-2.5 bg-white/80 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Đang bật: <b>Random tất cả bài hát</b> trong kho nhạc sạch ({allTracks.length} bài có sẵn)
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenLibrary}
            className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Chọn bài cụ thể →
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="text-[11px] text-emerald-800 flex items-center gap-1">
            <FaCheckCircle className="text-emerald-600 text-xs" />
            <span>
              Đã chọn <b>{selectedBgmIds.length} bài hát</b> để Random gán vào video:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white/70 border border-emerald-200 rounded-lg">
            {selectedTracks.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100/80 text-emerald-900 border border-emerald-300 rounded-md text-[11px] font-medium"
              >
                <span className="truncate max-w-[150px]">{t.title}</span>
                <span className="text-[10px] text-emerald-700 opacity-80">
                  ({formatSec(t.duration)})
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveTrack(t.id)}
                  className="p-0.5 text-emerald-700 hover:text-red-600 rounded-sm cursor-pointer"
                  title="Bỏ bài này khỏi danh sách random"
                >
                  <FaTimes className="text-[9px]" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ghi chú nguyên tắc âm thanh */}
      <div className="p-2 bg-emerald-100/50 border border-emerald-200/80 rounded-lg flex items-start gap-1.5 text-[11px] text-emerald-900 leading-relaxed">
        <FaInfoCircle className="text-emerald-600 mt-0.5 shrink-0" />
        <span>
          <b>Quy chuẩn âm thanh:</b> Hệ thống tự động ưu tiên bài hát có thời lượng dài hơn video và cắt bỏ đoạn âm thanh dư thừa kèm hiệu ứng fade out 2s cuối để video và nhạc khớp tuyệt đối.
        </span>
      </div>
    </div>
  );
};
