"use client";

import React, { useState } from "react";
import {
  FaLink,
  FaRegClipboard,
  FaSpinner,
  FaTimes,
  FaSlidersH,
  FaRocket,
} from "react-icons/fa";
import { toast } from "sonner";
import { useAutoDubbing } from "@/src/features/creator/dubbing/hook/useAutoDubbing";
import { useDubbingProfiles } from "@/src/features/creator/dubbing/hook/useDubbingProfiles";
import { DubbingMode, VoiceSource } from "@/src/features/creator/dubbing/type/dubbing.type";
import { AutoDubbingConfigPanel } from "./AutoDubbingConfigPanel";

export const VideoExtractForm: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>("https://v.douyin.com/iY9eX8k/");
  const [showConfig, setShowConfig] = useState<boolean>(true);

  // Cấu hình Vietsub & Dubbing
  const [mode, setMode] = useState<DubbingMode>("both");
  const [voiceSource, setVoiceSource] = useState<VoiceSource>("preset");
  const [voicePreset, setVoicePreset] = useState("vi-VN-NamMinhNeural");
  const [voiceProfileId, setVoiceProfileId] = useState<string>("");
  const [removeSubtitles, setRemoveSubtitles] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(32);
  const [bgmVolume, setBgmVolume] = useState<number>(0.18);
  const [voiceVolume, setVoiceVolume] = useState<number>(1.0);

  const autoDubbingMutation = useAutoDubbing();
  const { data: profilesData } = useDubbingProfiles();
  const userProfiles = Array.isArray(profilesData)
    ? profilesData
    : (profilesData as any)?.profiles || [];

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        toast.info("Đã dán link từ clipboard!");
      }
    } catch {
      toast.error("Không thể đọc từ bộ nhớ tạm. Vui lòng dán thủ công!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.warning("Vui lòng dán đường link video Douyin vào ô nhập!");
      return;
    }

    let voiceName = "Nam Minh (Nam Trầm Ấm)";
    let activePreset = voicePreset;
    if (voiceSource === "preset") {
      voiceName = voicePreset === "vi-VN-HoaiMyNeural" ? "Hoài My (Nữ Truyền Cảm)" : "Nam Minh (Nam Trầm Ấm)";
    } else {
      activePreset = "";
      const found = userProfiles.find((p: any) => (p.profile_id || p.id) === voiceProfileId);
      voiceName = found ? (found.profile_name || found.name) : (voiceProfileId ? `Giọng Cá Nhân (#${voiceProfileId.slice(-4)})` : "Giọng Cá Nhân");
    }

    autoDubbingMutation.mutate(
      {
        url: urlInput.trim(),
        mode,
        voice_source: voiceSource,
        voice_preset: activePreset,
        voice_profile_id: voiceProfileId || undefined,
        voice_name: voiceName,
        remove_subtitles: removeSubtitles,
        font_size: fontSize,
        bgm_volume: bgmVolume,
        voice_volume: voiceVolume,
      },
      {
        onSuccess: () => {
          toast.success("Đã đưa tác vụ vào hàng đợi chạy ngầm thành công!");
          setUrlInput("");
        },
        onError: (err: any) => {
          toast.error(`Lỗi: ${err?.response?.data?.detail || err.message || "Không thể khởi chạy"}`);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Box chính */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative flex-1 w-full bg-gray-50/70 rounded-xl border border-gray-300 flex items-center px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white">
            <FaLink className="text-gray-400 text-base sm:text-lg mr-3 flex-shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Dán đường link Douyin / TikTok / MP4 vào đây..."
              className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />

            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput("")}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg text-xs mr-2 transition-colors"
                title="Xóa link"
              >
                <FaTimes />
              </button>
            )}

            <button
              type="button"
              onClick={handlePasteClipboard}
              className="p-1.5 text-gray-600 hover:text-blue-600 rounded-lg text-base transition-colors flex-shrink-0"
              title="Dán từ bộ nhớ tạm"
            >
              <FaRegClipboard />
            </button>
          </div>

          <button
            type="submit"
            disabled={autoDubbingMutation.isPending}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {autoDubbingMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Đang tiếp nhận...</span>
              </>
            ) : (
              <>
                <FaRocket className="text-sm" />
                <span>Bắt Đầu Xử Lý Ngầm</span>
              </>
            )}
          </button>
        </div>

        {/* Thanh tiêu đề mở rộng cấu hình */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaSlidersH className="text-blue-600 text-xs" />
            <span>Cấu Hình Tự Động Vietsub & Lồng Tiếng (AI Dubbing)</span>
            <span className="text-[10px] text-gray-400">({showConfig ? "Thu gọn" : "Mở rộng"})</span>
          </button>
        </div>

        {/* Khu vực Cấu hình khi mở rộng */}
        {showConfig && (
          <AutoDubbingConfigPanel
            mode={mode}
            setMode={setMode}
            voiceSource={voiceSource}
            setVoiceSource={setVoiceSource}
            voicePreset={voicePreset}
            setVoicePreset={setVoicePreset}
            voiceProfileId={voiceProfileId}
            setVoiceProfileId={setVoiceProfileId}
            userProfiles={userProfiles}
            removeSubtitles={removeSubtitles}
            setRemoveSubtitles={setRemoveSubtitles}
            fontSize={fontSize}
            setFontSize={setFontSize}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            voiceVolume={voiceVolume}
            setVoiceVolume={setVoiceVolume}
          />
        )}
      </form>
    </div>
  );
};
