"use client";

import React from "react";
import { FaMusic, FaVolumeUp, FaRandom, FaLayerGroup } from "react-icons/fa";
import { AudioMode } from "../type/stitch.type";

interface StitchAudioSelectorProps {
  value: AudioMode;
  onChange: (val: AudioMode) => void;
  disabled?: boolean;
}

export const StitchAudioSelector: React.FC<StitchAudioSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
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
    </div>
  );
};
