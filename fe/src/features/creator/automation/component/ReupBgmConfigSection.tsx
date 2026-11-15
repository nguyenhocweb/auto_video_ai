"use client";

import React, { useState } from "react";
import {
  FaMusic,
  FaHeadphones,
  FaTimes,
  FaDice,
  FaCheckCircle,
  FaInfoCircle,
  FaVolumeUp,
  FaShieldAlt,
} from "react-icons/fa";
import { useGetBgmTracks } from "@/src/features/creator/bgm/hook/useGetBgmTracks";
import { BgmLibraryModal } from "@/src/features/creator/bgm/component/BgmLibraryModal";

interface ReupBgmConfigSectionProps {
  selectedBgmIds?: string[];
  onChangeSelectedBgmIds?: (ids: string[]) => void;
  keepOriginalAudio?: boolean;
  onChangeKeepOriginalAudio?: (keep: boolean) => void;
}

export const ReupBgmConfigSection: React.FC<ReupBgmConfigSectionProps> = ({
  selectedBgmIds = [],
  onChangeSelectedBgmIds,
  keepOriginalAudio = false,
  onChangeKeepOriginalAudio,
}) => {
  const [isBgmModalOpen, setIsBgmModalOpen] = useState(false);
  const { data: bgmData } = useGetBgmTracks("all");
  const allTracks = bgmData?.items || [];

  const selectedTracks = allTracks.filter((t) => selectedBgmIds.includes(t.id));

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleRemoveTrack = (trackId: string) => {
    if (!onChangeSelectedBgmIds) return;
    onChangeSelectedBgmIds(selectedBgmIds.filter((id) => id !== trackId));
  };

  const handleResetToRandomAll = () => {
    if (!onChangeSelectedBgmIds) return;
    onChangeSelectedBgmIds([]);
  };

  return (
    <div className="mt-2.5 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3">
      {/* Banner giới thiệu Mô hình 2 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs">
            <FaShieldAlt />
          </span>
          <div>
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              Mô hình 2: Lách thuật toán pHash & Tùy chọn Âm thanh
            </div>
            <div className="text-[10px] text-emerald-700/90">
              Tự động zoom nhẹ 1.04x, xóa metadata bản quyền của Douyin/TikTok
            </div>
          </div>
        </div>

        {!keepOriginalAudio && (
          <button
            type="button"
            onClick={() => setIsBgmModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FaHeadphones className="text-xs" />
            {selectedBgmIds.length > 0
              ? `Chọn lại bài Random (${selectedBgmIds.length})`
              : "Mở Kho Nhạc & Chọn Bài"}
          </button>
        )}
      </div>

      {/* Tùy chọn Chế độ Âm Thanh: Giữ nguyên âm thanh gốc vs Mix BGM */}
      <div>
        <label className="text-xs font-bold text-emerald-950 mb-1.5 block">
          Cấu hình âm thanh video:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChangeKeepOriginalAudio?.(true)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              keepOriginalAudio
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <FaVolumeUp className={keepOriginalAudio ? "text-white" : "text-emerald-600"} />
              Giữ nguyên âm thanh gốc
            </div>
            <div
              className={`text-[10px] mt-0.5 leading-tight ${
                keepOriginalAudio ? "text-emerald-100" : "text-gray-400"
              }`}
            >
              Bảo toàn 100% tiếng thoại & nhạc gốc của video Douyin
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeKeepOriginalAudio?.(false)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              !keepOriginalAudio
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <FaMusic className={!keepOriginalAudio ? "text-white" : "text-emerald-600"} />
              Mix BGM bản quyền sạch
            </div>
            <div
              className={`text-[10px] mt-0.5 leading-tight ${
                !keepOriginalAudio ? "text-emerald-100" : "text-gray-400"
              }`}
            >
              Đè bài BGM sạch từ kho, hạ tiếng cũ tránh flop/gậy
            </div>
          </button>
        </div>
      </div>

      {/* Hiển thị chi tiết theo chế độ được chọn */}
      {keepOriginalAudio ? (
        <div className="p-3 bg-white/90 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
          <FaCheckCircle className="text-emerald-600 mt-0.5 text-sm shrink-0" />
          <div>
            <div className="font-bold">Đang bật: Giữ nguyên âm thanh gốc 100%</div>
            <div className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
              Hệ thống sẽ giữ trọn vẹn dải âm thanh gốc của video Douyin/TikTok (sử dụng stream copy không làm giảm chất lượng âm thanh), không lồng ghép thêm nhạc BGM, đồng thời vẫn áp dụng lách thuật toán pHash (zoom 1.04x & xóa metadata) để video an toàn khi xuất bản.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Cấu hình Pool Random BGM */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <FaDice className="text-emerald-600 text-[11px]" />
                Chế độ gán nhạc ngẫu nhiên:
              </span>
              {selectedBgmIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetToRandomAll}
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
                  onClick={() => setIsBgmModalOpen(true)}
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
                        onClick={() => handleRemoveTrack(t.id)}
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
          </div>

          {/* Ghi chú nguyên tắc âm thanh */}
          <div className="p-2 bg-emerald-100/50 border border-emerald-200/80 rounded-lg flex items-start gap-1.5 text-[11px] text-emerald-900 leading-relaxed">
            <FaInfoCircle className="text-emerald-600 mt-0.5 shrink-0" />
            <span>
              <b>Quy chuẩn âm thanh:</b> Hệ thống tự động ưu tiên bài hát có thời lượng dài hơn video và cắt bỏ đoạn âm thanh dư thừa kèm hiệu ứng fade out 2s cuối để video và nhạc khớp tuyệt đối.
            </span>
          </div>
        </>
      )}

      {/* Modal Kho nhạc */}
      <BgmLibraryModal
        isOpen={isBgmModalOpen}
        onClose={() => setIsBgmModalOpen(false)}
        selectionMode={true}
        initialSelectedIds={selectedBgmIds}
        onConfirmSelection={(ids) => onChangeSelectedBgmIds?.(ids)}
      />
    </div>
  );
};
