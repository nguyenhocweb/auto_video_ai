"use client";

import React from "react";
import { FaMicrophone, FaPlay, FaSpinner, FaRedo, FaBrain } from "react-icons/fa";
import { useGetStoryboardVoices } from "../hook/useGetStoryboardVoices";

interface StoryboardRenderControlsProps {
  voiceName: string;
  onVoiceChange: (voice: string) => void;
  onStartRender: () => void;
  isRendering: boolean;
  canRender: boolean;
  hasRendered?: boolean;
}

export const StoryboardRenderControls: React.FC<StoryboardRenderControlsProps> = ({
  voiceName,
  onVoiceChange,
  onStartRender,
  isRendering,
  canRender,
  hasRendered = false,
}) => {
  const { data: voices = [], isLoading: isLoadingVoices } = useGetStoryboardVoices();

  const presetVoices = voices.filter((v) => v.type === "preset");
  const trainedVoices = voices.filter((v) => v.type === "trained");

  const isTrainedSelected = trainedVoices.some((v) => v.id === voiceName);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-md mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <FaMicrophone className="text-violet-600 text-sm" /> Giọng đọc lồng tiếng:
        </span>

        <div className="relative">
          <select
            value={voiceName}
            disabled={isLoadingVoices}
            onChange={(e) => onVoiceChange(e.target.value)}
            className="px-3 py-1.5 pr-8 text-xs bg-gray-50 hover:bg-white border border-gray-300 focus:border-violet-500 rounded-lg text-gray-800 font-semibold focus:outline-none shadow-xs transition max-w-[280px] sm:max-w-[340px] truncate"
          >
            {/* Nhóm Giọng Đọc Mặc Định */}
            <optgroup label="🌟 Giọng AI Mặc Định (Edge TTS)">
              {presetVoices.length > 0 ? (
                presetVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="vi-VN-NamMinhNeural">Nam Minh (Giọng Nam Truyền Cảm - Edge TTS)</option>
                  <option value="vi-VN-HoaiMyNeural">Hoài My (Giọng Nữ Nhẹ Nhàng - Edge TTS)</option>
                </>
              )}
            </optgroup>

            {/* Nhóm Model Giọng Đã Training */}
            <optgroup label="🎙️ Model Giọng Đã Training (Voice Cloning)">
              {trainedVoices.length > 0 ? (
                trainedVoices.map((v) => {
                  const genderLabel = v.gender === "FEMALE" ? "Nữ" : v.gender === "MALE" ? "Nam" : "AI";
                  return (
                    <option key={v.id} value={v.id}>
                      🎙️ {v.name} ({genderLabel} - Đã Train)
                    </option>
                  );
                })
              ) : (
                <option value="" disabled>
                  (Chưa có giọng training nào trong hệ thống)
                </option>
              )}
            </optgroup>
          </select>

          {isLoadingVoices && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <FaSpinner className="animate-spin text-gray-400 text-xs" />
            </div>
          )}
        </div>

        {isTrainedSelected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <FaBrain className="text-amber-500 text-xs" /> Đang dùng Giọng Clone Đã Train
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={isRendering || !canRender}
        onClick={onStartRender}
        className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl text-white shadow-md transition cursor-pointer ${
          isRendering || !canRender
            ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25 active:scale-95"
        }`}
      >
        {isRendering ? (
          <>
            <FaSpinner className="animate-spin text-sm" />
            Đang lồng tiếng & render video...
          </>
        ) : hasRendered ? (
          <>
            <FaRedo className="text-xs" />
            Render Lại Video (Sau khi chỉnh sửa)
          </>
        ) : (
          <>
            <FaPlay className="text-xs" />
            Bắt Đầu Ghép & Render Video
          </>
        )}
      </button>
    </div>
  );
};
