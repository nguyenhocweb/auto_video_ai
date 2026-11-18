"use client";

import React, { useState } from "react";
import {
  FaMusic,
  FaHeadphones,
  FaVolumeUp,
  FaShieldAlt,
  FaRandom,
  FaLayerGroup,
  FaCheckCircle,
} from "react-icons/fa";
import { useGetBgmTracks } from "@/src/features/creator/bgm/hook/useGetBgmTracks";
import { BgmLibraryModal } from "@/src/features/creator/bgm/component/BgmLibraryModal";
import { ReupBgmPoolDisplay } from "./ReupBgmPoolDisplay";

interface ReupBgmConfigSectionProps {
  selectedBgmIds?: string[];
  onChangeSelectedBgmIds?: (ids: string[]) => void;
  keepOriginalAudio?: boolean;
  onChangeKeepOriginalAudio?: (keep: boolean) => void;
  audioMode?: "sequential" | "body_audio" | "hook_audio" | "bgm_override";
  onChangeAudioMode?: (mode: "sequential" | "body_audio" | "hook_audio" | "bgm_override") => void;
}

export const ReupBgmConfigSection: React.FC<ReupBgmConfigSectionProps> = ({
  selectedBgmIds = [],
  onChangeSelectedBgmIds,
  keepOriginalAudio = false,
  onChangeKeepOriginalAudio,
  audioMode,
  onChangeAudioMode,
}) => {
  const [isBgmModalOpen, setIsBgmModalOpen] = useState(false);
  const { data: bgmData } = useGetBgmTracks("all");
  const allTracks = bgmData?.items || [];

  // Xác định chế độ âm thanh hiện tại
  const currentMode =
    audioMode || (keepOriginalAudio ? "body_audio" : "bgm_override");

  const handleSelectMode = (mode: "sequential" | "body_audio" | "hook_audio" | "bgm_override") => {
    onChangeAudioMode?.(mode);
    if (mode === "bgm_override") {
      onChangeKeepOriginalAudio?.(false);
    } else {
      onChangeKeepOriginalAudio?.(true);
    }
  };

  const audioOptions = [
    {
      id: "body_audio" as const,
      title: "Tiếng Video Cuối (Body Audio)",
      desc: "Giữ 100% âm thanh video chính (thân bài). Đoạn đầu chỉ đóng vai trò Visual Hook.",
      icon: FaVolumeUp,
      recommended: true,
    },
    {
      id: "sequential" as const,
      title: "Nối Tiếp Tuần Tự (Đầu → Cuối)",
      desc: "Đoạn đầu phát tiếng video 1, đoạn sau phát tiếng video 2 với chuyển âm xfade mượt mà.",
      icon: FaRandom,
    },
    {
      id: "hook_audio" as const,
      title: "Tiếng Video Đầu (Hook Loop)",
      desc: "Lấy nhạc trend hoặc âm thanh cuốn hút của video đoạn đầu lặp xuyên suốt.",
      icon: FaLayerGroup,
    },
    {
      id: "bgm_override" as const,
      title: "Mix Random Bài Hát BGM Đã Chọn",
      desc: "Đè bài BGM sạch từ kho, hạ tiếng cũ để lách bản quyền Content ID 100%.",
      icon: FaMusic,
    },
  ];

  return (
    <div className="mt-2.5 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3">
      {/* Banner giới thiệu */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs">
            <FaShieldAlt />
          </span>
          <div>
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              Mô hình 2: Lách thuật toán pHash &amp; Tùy chọn Âm thanh
            </div>
            <div className="text-[10px] text-emerald-700/90">
              Tự động zoom nhẹ 1.04x, xóa metadata bản quyền của Douyin/TikTok
            </div>
          </div>
        </div>

        {currentMode === "bgm_override" && (
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

      {/* Cấu hình âm thanh video: 4 tùy chọn */}
      <div>
        <label className="text-xs font-bold text-emerald-950 mb-1.5 block">
          Cấu hình âm thanh video:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {audioOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = currentMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectMode(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 font-bold text-xs">
                      <Icon className={isSelected ? "text-white" : "text-emerald-600"} />
                      {opt.title}
                    </span>
                    {opt.recommended && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        Đề xuất
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] mt-1 leading-tight ${
                      isSelected ? "text-emerald-100" : "text-gray-400"
                    }`}
                  >
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hiển thị chi tiết theo chế độ được chọn */}
      {currentMode === "bgm_override" ? (
        <ReupBgmPoolDisplay
          selectedBgmIds={selectedBgmIds}
          allTracks={allTracks}
          onOpenLibrary={() => setIsBgmModalOpen(true)}
          onResetToRandomAll={() => onChangeSelectedBgmIds?.([])}
          onRemoveTrack={(id) =>
            onChangeSelectedBgmIds?.(selectedBgmIds.filter((tId) => tId !== id))
          }
        />
      ) : (
        <div className="p-3 bg-white/90 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
          <FaCheckCircle className="text-emerald-600 mt-0.5 text-sm shrink-0" />
          <div>
            <div className="font-bold">
              {currentMode === "body_audio" && "Đang bật: Tiếng Video Cuối (Thân bài gốc 100%)"}
              {currentMode === "sequential" && "Đang bật: Nối tiếp tuần tự (Đoạn đầu → Đoạn cuối)"}
              {currentMode === "hook_audio" && "Đang bật: Tiếng Video Đầu (Hook Loop)"}
            </div>
            <div className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
              {currentMode === "body_audio" &&
                "Hệ thống sẽ giữ trọn vẹn 100% tiếng thoại & nhạc gốc của video thân bài chính, đoạn đầu đóng vai trò visual hook. Áp dụng lách pHash (zoom 1.04x & xóa metadata) để video an toàn khi xuất bản."}
              {currentMode === "sequential" &&
                "Đoạn Hook phát tiếng của video đầu, sau đó chuyển sang tiếng của video thân bài với hiệu ứng làm dịu âm thanh qua acrossfade tự nhiên."}
              {currentMode === "hook_audio" &&
                "Âm thanh cuốn hút của video đoạn đầu sẽ được kéo dài hoặc lặp lại xuyên suốt toàn bộ video."}
            </div>
          </div>
        </div>
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
