"use client";

import React from "react";
import Link from "next/link";
import {
  FaEraser,
  FaClosedCaptioning,
  FaMicrophoneAlt,
  FaFireAlt,
  FaRocket,
  FaVolumeUp,
  FaCheck,
  FaKey,
} from "react-icons/fa";
import { DubbingMode, VoiceSource } from "@/src/features/creator/dubbing/type/dubbing.type";

interface AutoDubbingConfigPanelProps {
  mode: DubbingMode;
  setMode: (m: DubbingMode) => void;
  voiceSource: VoiceSource;
  setVoiceSource: (s: VoiceSource) => void;
  voicePreset: string;
  setVoicePreset: (p: string) => void;
  voiceProfileId: string;
  setVoiceProfileId: (id: string) => void;
  userProfiles?: any[];
  removeSubtitles: boolean;
  setRemoveSubtitles: (b: boolean) => void;
  fontSize?: number;
  setFontSize?: (s: number) => void;
  bgmVolume: number;
  setBgmVolume: (v: number) => void;
  voiceVolume: number;
  setVoiceVolume: (v: number) => void;
}

const SYSTEM_VOICE_PRESETS = [
  { id: "vi-VN-NamMinhNeural", type: "preset" as const, name: "Nam Minh", badge: "⭐ Chuẩn Studio", gender: "Nam", desc: "Thuyết minh, phóng sự", isPreset: true },
  { id: "vi-VN-HoaiMyNeural", type: "preset" as const, name: "Hoài My", badge: "⭐ Chuẩn Studio", gender: "Nữ", desc: "Vlog, tin tức đời sống", isPreset: true },
];

export const AutoDubbingConfigPanel: React.FC<AutoDubbingConfigPanelProps> = ({
  mode,
  setMode,
  voiceSource,
  setVoiceSource,
  voicePreset,
  setVoicePreset,
  voiceProfileId,
  setVoiceProfileId,
  userProfiles,
  removeSubtitles,
  setRemoveSubtitles,
  fontSize = 32,
  setFontSize,
  bgmVolume,
  setBgmVolume,
  voiceVolume,
  setVoiceVolume,
}) => {
  const profileList = Array.isArray(userProfiles)
    ? userProfiles
    : (userProfiles as any)?.profiles && Array.isArray((userProfiles as any).profiles)
    ? (userProfiles as any).profiles
    : [];

  const allVoices = [
    ...SYSTEM_VOICE_PRESETS,
    ...profileList.map((p: any) => {
      const pid = p.profile_id || p.id || "";
      const rawName = p.profile_name || p.name || `Hồ sơ #${pid.slice(-6)}`;
      const cleanName = rawName.replace(/\s*(\([^)]*pro[^)]*\)|\([^)]*long[^)]*\)|\(⭐[^)]*\))/gi, "").trim();
      return {
        id: pid,
        type: "profile" as const,
        name: cleanName || rawName,
        badge: rawName.toLowerCase().includes("long") ? "⭐ Pro 99% - Long Audio" : "⭐ Pro 99%",
        gender: p.gender === "FEMALE" ? "Nữ" : p.gender === "MALE" ? "Nam" : "Trung tính",
        desc: "OmniVoice Clone AI",
        isPreset: false,
      };
    }),
  ];

  return (
    <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4 text-xs animate-fadeIn">
      {/* 1. Chọn chế độ */}
      <div className="space-y-1.5">
        <label className="font-semibold text-gray-700 block">Chế Độ Xử Lý:</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "both", label: "Cả 2 (Sub + Thoại)", icon: FaFireAlt, color: "text-amber-600" },
            { id: "vietsub", label: "Chỉ Vietsub", icon: FaClosedCaptioning, color: "text-blue-600" },
            { id: "dubbing", label: "Chỉ Thuyết Minh", icon: FaMicrophoneAlt, color: "text-purple-600" },
            { id: "download_only", label: "Chỉ Tải Sạch Logo", icon: FaRocket, color: "text-emerald-600" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id as DubbingMode)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border font-semibold transition-all ${
                mode === item.id
                  ? "bg-white border-blue-500 text-blue-700 shadow-2xs ring-1 ring-blue-400"
                  : "bg-white/60 border-gray-200 text-gray-600 hover:bg-white"
              }`}
            >
              <item.icon className={item.color} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Chọn Giọng nói - Để chung hiển thị tất cả các giọng, tối đa 2 hàng có cuộn đồng bộ */}
      {mode !== "vietsub" && mode !== "download_only" && (
        <div className="space-y-2 pt-2 border-t border-gray-200/60">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-700">Giọng Thuyết Minh Tiếng Việt:</label>
            <span className="text-[10px] text-gray-400">
              {allVoices.length} giọng sẵn sàng • Cuộn để xem thêm
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[148px] overflow-y-auto pr-1.5 [scrollbar-width:thin] [scrollbar-color:#c084fc_#f3e8ff] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-purple-50/70 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-purple-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-400"
          >
            {allVoices.map((v) => {
              const isSelected =
                (v.type === "preset" && voiceSource === "preset" && voicePreset === v.id) ||
                (v.type === "profile" && voiceSource === "profile" && voiceProfileId === v.id);

              return (
                <button
                  key={`${v.type}_${v.id}`}
                  type="button"
                  onClick={() => {
                    if (v.type === "preset") {
                      setVoiceSource("preset");
                      setVoicePreset(v.id);
                      setVoiceProfileId("");
                    } else {
                      setVoiceSource("profile");
                      setVoiceProfileId(v.id);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 relative ${
                    isSelected
                      ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-400 shadow-xs"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/70"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FaVolumeUp className="text-xs" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 leading-tight">
                      <span
                        className={`text-xs font-bold truncate ${
                          isSelected ? "text-purple-900" : "text-gray-900"
                        }`}
                      >
                        {v.name}
                      </span>
                      <span className="text-[10px] text-amber-600 font-semibold flex-shrink-0">
                        ({v.badge})
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1 truncate flex items-center gap-1.5">
                      <span className="font-semibold text-gray-700">{v.gender}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400">{v.desc}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-[8px] font-bold">
                      <FaCheck className="text-[7px]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Inpainting Xóa phụ đề cứng */}
      {mode !== "download_only" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2">
              <FaEraser className="text-indigo-600 text-sm" />
              <div>
                <span className="font-bold text-gray-800 text-xs">
                  Làm mờ phụ đề gốc & Đè phụ đề Vàng nghệ chuẩn Reels
                </span>
                <p className="text-[10px] text-gray-400">
                  Dải Soft Blur mờ êm + Vietsub vàng viền đen chống lem nhem
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={removeSubtitles}
              onChange={(e) => setRemoveSubtitles(e.target.checked)}
              className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Cỡ chữ phụ đề Vietsub */}
          {mode !== "dubbing" && (
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200/80">
              <div>
                <span className="font-bold text-gray-800 text-xs">Cỡ Chữ Vietsub:</span>
                <p className="text-[10px] text-gray-400">Tối ưu cho hiển thị điện thoại & Reels</p>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { size: 26, label: "Vừa" },
                  { size: 32, label: "To ⭐" },
                  { size: 38, label: "Cực To" },
                ].map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setFontSize?.(item.size)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      (fontSize || 32) === item.size
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-900">
            <span className="flex items-center gap-1.5">
              <FaKey className="text-blue-600 text-[10px]" />
              Dịch thuật ngữ cảnh: <b>Gemini Multi-Key Pool</b>
            </span>
            <Link
              href="/creator/settings"
              className="font-bold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              Cấu hình Keys →
            </Link>
          </div>
        </div>
      )}

      {/* 4. Âm lượng BGM & Voice */}
      {mode !== "vietsub" && mode !== "download_only" && (
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
              <span>Nhạc Nền Gốc (Audio Ducking):</span>
              <span className="font-bold">{Math.round(bgmVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.02"
              value={bgmVolume}
              onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
              className="w-full accent-blue-600 h-1 bg-gray-200 rounded cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
              <span>Âm Lượng Thuyết Minh:</span>
              <span className="font-bold">{Math.round(voiceVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
              className="w-full accent-blue-600 h-1 bg-gray-200 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

