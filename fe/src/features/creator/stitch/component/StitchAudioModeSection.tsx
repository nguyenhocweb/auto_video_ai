"use client";

import React, { useState } from "react";
import {
  FaVolumeUp,
  FaRandom,
  FaLayerGroup,
  FaMusic,
  FaHeadphones,
  FaCheckCircle,
} from "react-icons/fa";
import { BgmLibraryModal } from "@/src/features/creator/bgm/component/BgmLibraryModal";

export type StitchAudioMode = "body_audio" | "sequential" | "hook_audio" | "bgm_override";

interface StitchAudioModeSectionProps {
  value: StitchAudioMode;
  onChange: (val: StitchAudioMode) => void;
  selectedBgmIds: string[];
  onChangeBgmIds: (ids: string[]) => void;
  disabled?: boolean;
}

export const StitchAudioModeSection: React.FC<StitchAudioModeSectionProps> = ({
  value,
  onChange,
  selectedBgmIds,
  onChangeBgmIds,
  disabled = false,
}) => {
  const [isBgmModalOpen, setIsBgmModalOpen] = useState(false);

  const options = [
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
      desc: "Đoạn đầu phát tiếng video 1, đoạn sau phát tiếng video 2 với chuyển âm acrossfade êm dịu.",
      icon: FaRandom,
    },
    {
      id: "hook_audio" as const,
      title: "Tiếng Video Đầu (Hook Loop)",
      desc: "Lấy nhạc trend cuốn hút của video đoạn đầu lặp xuyên suốt toàn bộ video.",
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
    <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <FaVolumeUp className="text-emerald-600" />
            <span>3. Cấu hình âm thanh video khi ghép nối:</span>
          </label>
          <p className="text-[10px] text-emerald-700/80 mt-0.5">
            Lựa chọn cách phối âm thanh giữa video Hook mồi câu và video Thân bài chính
          </p>
        </div>

        {value === "bgm_override" && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsBgmModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FaHeadphones />
            {selectedBgmIds.length > 0
              ? `Đã chọn ${selectedBgmIds.length} bài Random`
              : "Mở Kho Nhạc & Chọn Bài"}
          </button>
        )}
      </div>

      {/* Grid 4 tùy chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
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
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected
                          ? "bg-emerald-700 text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
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

      {/* Banner ghi chú */}
      <div className="p-2.5 bg-white/90 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
        <FaCheckCircle className="text-emerald-600 mt-0.5 text-xs shrink-0" />
        <div className="text-[11px] leading-relaxed">
          {value === "body_audio" &&
            "Đang bật: Tiếng Video Cuối. Giữ 100% âm thanh & tiếng nói của video chính, video đầu chỉ đóng vai trò Visual Hook mồi mắt."}
          {value === "sequential" &&
            "Đang bật: Nối tiếp tuần tự. Đoạn đầu phát nhạc/tiếng video 1, sau đó nối sang video 2 qua hiệu ứng acrossfade tự nhiên."}
          {value === "hook_audio" &&
            "Đang bật: Tiếng Video Đầu. Nhạc trend của video đoạn đầu sẽ lặp xuyên suốt toàn bộ video."}
          {value === "bgm_override" &&
            `Đang bật: Mix Random BGM. Đè bài hát sạch từ kho (${selectedBgmIds.length > 0 ? selectedBgmIds.length + " bài đã chọn" : "tất cả bài có sẵn"}).`}
        </div>
      </div>

      <BgmLibraryModal
        isOpen={isBgmModalOpen}
        onClose={() => setIsBgmModalOpen(false)}
        selectionMode={true}
        initialSelectedIds={selectedBgmIds}
        onConfirmSelection={(ids) => onChangeBgmIds(ids)}
      />
    </div>
  );
};
