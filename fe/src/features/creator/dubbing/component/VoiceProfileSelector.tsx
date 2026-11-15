"use client";

import React from "react";
import { FaUserAstronaut, FaVolumeUp, FaSlidersH, FaRobot } from "react-icons/fa";
import { VoiceSource } from "../type/dubbing.type";
import { useDubbingProfiles } from "../hook/useDubbingProfiles";

interface VoiceProfileSelectorProps {
  voiceSource: VoiceSource;
  onSelectVoiceSource: (source: VoiceSource) => void;
  voicePreset: string;
  onSelectVoicePreset: (preset: string) => void;
  voiceProfileId?: string;
  onSelectVoiceProfileId: (id: string) => void;
  bgmVolume: number;
  onChangeBgmVolume: (vol: number) => void;
  voiceVolume: number;
  onChangeVoiceVolume: (vol: number) => void;
}

export const VoiceProfileSelector: React.FC<VoiceProfileSelectorProps> = ({
  voiceSource,
  onSelectVoiceSource,
  voicePreset,
  onSelectVoicePreset,
  voiceProfileId,
  onSelectVoiceProfileId,
  bgmVolume,
  onChangeBgmVolume,
  voiceVolume,
  onChangeVoiceVolume,
}) => {
  const { data: userProfiles, isLoading: isLoadingProfiles } = useDubbingProfiles();

  const presetVoices = [
    {
      id: "vi-VN-NamMinhNeural",
      name: "Nam Minh (Nam Trầm Ấm)",
      gender: "Nam",
      desc: "Giọng đọc truyền cảm, phù hợp review phim & kể chuyện",
    },
    {
      id: "vi-VN-HoaiMyNeural",
      name: "Hoài My (Nữ Truyền Cảm)",
      gender: "Nữ",
      desc: "Giọng đọc nhẹ nhàng, phù hợp tin tức & vlog đời sống",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200/90 bg-white p-5 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <FaSlidersH className="text-purple-600 text-base" />
          <h3 className="font-bold text-gray-900 text-sm">Cấu Hình Giọng Đọc & Âm Thanh</h3>
        </div>
        <span className="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-medium">
          OmniVoice + Neural TTS
        </span>
      </div>

      {/* Nguồn giọng nói: Preset hay Giọng cá nhân */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700">Nguồn Giọng Thuyết Minh</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelectVoiceSource("preset")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
              voiceSource === "preset"
                ? "border-purple-600 bg-purple-50/60 text-purple-800 ring-2 ring-purple-500/20"
                : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaRobot className="text-sm" />
            <span>Giọng Chuẩn Neural (Ổn Định 100%)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectVoiceSource("profile")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
              voiceSource === "profile"
                ? "border-purple-600 bg-purple-50/60 text-purple-800 ring-2 ring-purple-500/20"
                : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUserAstronaut className="text-sm" />
            <span>Giọng Clone / Training (Tối Ưu RAM)</span>
          </button>
        </div>
      </div>

      {/* Chi tiết chọn giọng theo nguồn */}
      {voiceSource === "preset" ? (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Chọn Giọng Mẫu</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presetVoices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => onSelectVoicePreset(voice.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  voicePreset === voice.id
                    ? "border-purple-500 bg-purple-50/40 text-purple-900 ring-1 ring-purple-400"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{voice.name}</span>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                    {voice.gender}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">{voice.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-600">Chọn Hồ Sơ Giọng Training Của Bạn</label>
            <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-medium">
              ⚡ Tuần tự (Chống OOM)
            </span>
          </div>
          {isLoadingProfiles ? (
            <div className="text-xs text-gray-500 py-3">Đang tải danh sách giọng của bạn...</div>
          ) : userProfiles && userProfiles.length > 0 ? (
            <>
              <select
                value={voiceProfileId || ""}
                onChange={(e) => onSelectVoiceProfileId(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Chọn hồ sơ giọng cá nhân --</option>
                {userProfiles.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.profile_name || p.name || `Hồ sơ giọng #${p.id.slice(-6)}`}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500 bg-purple-50/50 p-2 rounded border border-purple-100">
                💡 Hệ thống sẽ xử lý tuần tự từng câu thoại với giọng của bạn để đảm bảo không tràn RAM/VRAM máy chủ.
              </p>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">
                Bạn chưa có hồ sơ giọng nói nào trong OmniVoice Studio.
              </p>
              <a
                href="/creator/voice"
                className="text-xs text-purple-600 font-semibold hover:underline"
              >
                + Đi tới AI Voice Studio để Clone giọng ngay
              </a>
            </div>
          )}
        </div>
      )}

      {/* Điều chỉnh âm lượng Audio Ducking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-600 font-medium">Âm lượng Nhạc Nền Gốc (BGM Ducking)</span>
            <span className="font-bold text-gray-800">{Math.round(bgmVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.02"
            value={bgmVolume}
            onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <p className="text-[10px] text-gray-400 mt-1">Hạ nhỏ âm thanh nền để làm nổi bật giọng nói</p>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-600 font-medium">Âm lượng Thuyết Minh Tiếng Việt</span>
            <span className="font-bold text-gray-800">{Math.round(voiceVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={voiceVolume}
            onChange={(e) => onChangeVoiceVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <p className="text-[10px] text-gray-400 mt-1">Độ to rõ của giọng đọc thuyết minh</p>
        </div>
      </div>
    </div>
  );
};

