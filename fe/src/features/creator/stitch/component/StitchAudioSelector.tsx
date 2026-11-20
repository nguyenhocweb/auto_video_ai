"use client";

import React, { useState } from "react";
import { FaMusic, FaVolumeUp, FaRandom, FaLayerGroup, FaHeadphones } from "react-icons/fa";
import { AudioMode } from "../type/stitch.type";
import { BgmLibraryModal } from "@/src/features/creator/bgm/component/BgmLibraryModal";

interface StitchAudioSelectorProps {
  value: AudioMode;
  onChange: (val: AudioMode) => void;
  selectedBgmIds?: string[];
  onChangeBgmIds?: (ids: string[]) => void;
  disabled?: boolean;
}

export const StitchAudioSelector: React.FC<StitchAudioSelectorProps> = ({
  value,
  onChange,
  selectedBgmIds = [],
  onChangeBgmIds,
  disabled = false,
}) => {
  const [isBgmModalOpen, setIsBgmModalOpen] = useState(false);

  const options = [
    {
      id: "sequential" as AudioMode,
      title: "Nối Tiếp Tự Nhiên (Khuyên dùng)",
      desc: "Đoạn Hook phát tiếng Nguồn 1, chuyển sang đoạn Thân phát tiếng Nguồn 2 với chuyển âm mềm mại.",
      icon: FaRandom,
    },
    {
      id: "body_audio" as AudioMode,
      title: "Dùng Toàn Bộ Tiếng Thân Bài (Nguồn 2)",
      desc: "Âm thanh của Nguồn 2 phát từ đầu đến hết. Hình ảnh Nguồn 1 chỉ đóng vai trò Visual Hook.",
      icon: FaVolumeUp,
    },
    {
      id: "hook_audio" as AudioMode,
      title: "Dùng Tiếng Nguồn 1 (Hook Loop)",
      desc: "Lấy nhạc nền hoặc âm thanh cuốn hút của Nguồn 1 kéo dài hoặc lặp lại xuyên suốt.",
      icon: FaLayerGroup,
    },
    {
      id: "bgm_override" as AudioMode,
      title: "Đè Nhạc Nền Mới (BGM Sạch)",
      desc: "Hạ âm lượng gốc, lồng bài nhạc nền bản quyền sạch từ Kho BGM để lách bản quyền 100%.",
      icon: FaMusic,
    },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
        Chế Độ Hòa Âm (Audio Mixing)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                isSelected
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-950 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 text-gray-800"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-sm ${
                  isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold leading-snug">{opt.title}</div>
                <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Khu vực Chọn Nhiều Bài Nhạc Nền từ Kho BGM khi chọn đè nhạc */}
      {value === "bgm_override" && (
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-3 transition-all animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="text-xs font-bold text-blue-950 flex items-center gap-2">
                <FaMusic className="text-blue-600" />
                <span>Kho Nhạc Nền BGM Sạch Cho Video Này:</span>
              </div>
              <p className="text-[11px] text-blue-700/80 mt-0.5">
                Bạn có thể chọn 1 hoặc nhiều bài hát trong kho. Khi render, hệ thống sẽ bốc ngẫu nhiên (Random) 1 bài để ghép vào video!
              </p>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsBgmModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <FaHeadphones />
              <span>
                {selectedBgmIds.length > 0
                  ? `Đã Chọn (${selectedBgmIds.length}) Bài Random`
                  : "Mở Kho Nhạc & Chọn Nhiều Bài"}
              </span>
            </button>
          </div>

          {selectedBgmIds.length > 0 ? (
            <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-blue-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đã chọn {selectedBgmIds.length} bài hát. Hệ thống sẽ Random 1 bài để đè vào video này.
              </span>
              <button
                type="button"
                onClick={() => onChangeBgmIds && onChangeBgmIds([])}
                className="text-[11px] text-red-600 hover:underline cursor-pointer font-medium"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
              <span>⚠️ Bạn chưa chọn bài hát nào trong kho. Hãy bấm &quot;Mở Kho Nhạc &amp; Chọn Nhiều Bài&quot; để chọn bài hát đè vào video!</span>
            </div>
          )}

          <BgmLibraryModal
            isOpen={isBgmModalOpen}
            onClose={() => setIsBgmModalOpen(false)}
            selectionMode={true}
            initialSelectedIds={selectedBgmIds}
            onConfirmSelection={(ids) => {
              if (onChangeBgmIds) onChangeBgmIds(ids);
              setIsBgmModalOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
