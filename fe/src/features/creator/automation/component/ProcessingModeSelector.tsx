"use client";

import React from "react";
import { FaBolt, FaClosedCaptioning, FaMicrophone, FaCheck, FaVolumeUp, FaFireAlt } from "react-icons/fa";
import { ProcessingMode } from "../type/automation.type";
import { useGetVoiceProfiles } from "@/src/features/creator/voice/hook/useGetVoiceProfiles";
import { ReupBgmConfigSection } from "./ReupBgmConfigSection";

interface ProcessingModeSelectorProps {
  mode: ProcessingMode;
  onChangeMode: (mode: ProcessingMode) => void;
  voiceSource?: "preset" | "profile";
  voicePreset?: string;
  voiceProfileId?: string;
  onChangeVoiceConfig: (
    source: "preset" | "profile",
    presetOrId: string,
    voiceName?: string
  ) => void;
  selectedBgmIds?: string[];
  onChangeSelectedBgmIds?: (ids: string[]) => void;
  keepOriginalAudio?: boolean;
  onChangeKeepOriginalAudio?: (keep: boolean) => void;
  audioMode?: "sequential" | "body_audio" | "hook_audio" | "bgm_override";
  onChangeAudioMode?: (mode: "sequential" | "body_audio" | "hook_audio" | "bgm_override") => void;
}

export const ProcessingModeSelector: React.FC<ProcessingModeSelectorProps> = ({
  mode,
  onChangeMode,
  voiceSource = "preset",
  voicePreset = "vi-VN-NamMinhNeural",
  voiceProfileId,
  onChangeVoiceConfig,
  selectedBgmIds = [],
  onChangeSelectedBgmIds,
  keepOriginalAudio = false,
  onChangeKeepOriginalAudio,
  audioMode,
  onChangeAudioMode,
}) => {
  const { data: profilesData } = useGetVoiceProfiles();
  const profiles = profilesData?.profiles || [];

  // Xác định giá trị hiện tại của select
  const currentValue =
    voiceSource === "profile" && voiceProfileId
      ? `profile:${voiceProfileId}`
      : `preset:${voicePreset || "vi-VN-NamMinhNeural"}`;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val.startsWith("profile:")) {
      const pid = val.replace("profile:", "");
      const found = profiles.find((p) => p.profile_id === pid);
      onChangeVoiceConfig("profile", pid, found?.profile_name || "OmniVoice Clone");
    } else {
      const preset = val.replace("preset:", "");
      const name = preset === "vi-VN-NamMinhNeural" ? "Nam Minh (Trầm ấm)" : "Hoài My (Dịu dàng)";
      onChangeVoiceConfig("preset", preset, name);
    }
  };

  return (
    <div>
      <label className="block font-bold text-gray-800 mb-2">
        Chế độ xử lý video khi cào được:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => onChangeMode("both")}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
            mode === "both"
              ? "bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500/30"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <FaFireAlt className="text-amber-500 text-sm" />
            {mode === "both" && <FaCheck className="text-amber-600 text-xs" />}
          </div>
          <div className="font-bold text-gray-900 text-xs sm:text-sm">Sub + Thuyết minh</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
            In phụ đề tiếng Việt + Lồng tiếng đọc AI (Trọn gói Studio)
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode("vietsub")}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
            mode === "vietsub"
              ? "bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500/30"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <FaClosedCaptioning className="text-blue-500 text-sm" />
            {mode === "vietsub" && <FaCheck className="text-blue-600 text-xs" />}
          </div>
          <div className="font-bold text-gray-900 text-xs sm:text-sm">Chỉ Vietsub AI</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
            Xóa sub Trung + Dịch và in phụ đề tiếng Việt (giữ tiếng gốc)
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode("dubbing")}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
            mode === "dubbing"
              ? "bg-purple-50 border-purple-500 shadow-xs ring-1 ring-purple-500/30"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <FaMicrophone className="text-purple-500 text-sm" />
            {mode === "dubbing" && <FaCheck className="text-purple-600 text-xs" />}
          </div>
          <div className="font-bold text-gray-900 text-xs sm:text-sm">Chỉ Thuyết minh AI</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
            Lồng tiếng thuyết minh AI, hạ tiếng gốc (không in sub)
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode("download_only")}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
            mode === "download_only"
              ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <FaBolt className="text-emerald-500 text-sm" />
            {mode === "download_only" && <FaCheck className="text-emerald-600 text-xs" />}
          </div>
          <div className="font-bold text-gray-900 text-xs sm:text-sm">Gốc sạch logo</div>
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
            Tải video 1080p sạch logo gốc, không xử lý sub/thoại
          </div>
        </button>
      </div>

      {mode === "download_only" && (
        <ReupBgmConfigSection
          selectedBgmIds={selectedBgmIds}
          onChangeSelectedBgmIds={onChangeSelectedBgmIds}
          keepOriginalAudio={keepOriginalAudio}
          onChangeKeepOriginalAudio={onChangeKeepOriginalAudio}
          audioMode={audioMode}
          onChangeAudioMode={onChangeAudioMode}
        />
      )}

      {(mode === "both" || mode === "dubbing") && (
        <div className="mt-2.5 p-3 bg-purple-50/80 border border-purple-200 rounded-xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-purple-900 text-xs flex items-center gap-1.5">
              <FaVolumeUp className="text-purple-600 text-[11px]" />
              Giọng thuyết minh AI:
            </span>
            <select
              value={currentValue}
              onChange={handleSelectChange}
              className="px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-xs font-semibold outline-none text-purple-900 max-w-full sm:max-w-xs truncate"
            >
              <optgroup label="Giọng chuẩn Studio (Khuyên dùng - Ổn định 100%)">
                <option value="preset:vi-VN-NamMinhNeural">Nam Minh (Giọng Nam trầm ấm - Đề xuất)</option>
                <option value="preset:vi-VN-HoaiMyNeural">Hoài My (Giọng Nữ dịu dàng - Đề xuất)</option>
              </optgroup>
              {profiles.length > 0 && (
                <optgroup label="Giọng đã Huấn Luyện / Clone AI (OmniVoice)">
                  {profiles.map((p) => {
                    const cleanName = p.profile_name
                      .replace(/\s*\([^)]*pro[^)]*\)/gi, "")
                      .replace(/\s*\(⭐[^)]*\)/gi, "")
                      .trim();
                    const genderLabel = p.gender === "FEMALE" ? "Nữ" : p.gender === "MALE" ? "Nam" : "AI";
                    return (
                      <option key={p.profile_id} value={`profile:${p.profile_id}`}>
                        {cleanName || p.profile_name} (⭐ Pro 99% - {genderLabel})
                      </option>
                    );
                  })}
                </optgroup>
              )}
            </select>
          </div>
          {profiles.length === 0 && (
            <p className="text-[10px] text-purple-700/80">
              💡 Bạn chưa tạo giọng tùy chỉnh nào. Có thể huấn luyện thêm giọng cá nhân tại mục <b>AI Voice Studio</b>.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
