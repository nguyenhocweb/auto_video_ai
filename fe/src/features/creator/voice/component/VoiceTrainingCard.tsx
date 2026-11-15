"use client";

import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaFileAudio,
  FaMicrophone,
  FaBolt,
} from "react-icons/fa";
import { VoiceLongAudioForm } from "./VoiceLongAudioForm";
import { VoiceBoothInlineStudio } from "./VoiceBoothInlineStudio";
import { VoiceQuickSampleForm } from "./VoiceQuickSampleForm";

interface VoiceTrainingCardProps {
  onProfileCreated: (newProfileId: string) => void;
  isOpenDefault?: boolean;
}

export const VoiceTrainingCard: React.FC<VoiceTrainingCardProps> = ({
  onProfileCreated,
  isOpenDefault = true,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [trainingMode, setTrainingMode] = useState<"LONG_AUDIO" | "DIRECT_MIC" | "FAST_SAMPLE">("LONG_AUDIO");

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-sm space-y-6">
      {/* Header phần 1 có thể thu gọn / mở rộng */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">
              1. Huấn Luyện &amp; Lưu Trữ Kiểu Giọng Độc Quyền
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs">
              AI Voice Cloning
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Chọn phương thức huấn luyện phù hợp: từ file dài 15-30p, thu âm trực tiếp hoặc mẫu ngắn 3s
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-xs flex items-center gap-1 font-semibold"
        >
          <span>{isOpen ? "Thu gọn" : "Mở rộng"}</span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6 animate-fadeIn">
          {/* Thanh chuyển đổi 3 Tab chế độ huấn luyện */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60">
            <button
              type="button"
              onClick={() => setTrainingMode("LONG_AUDIO")}
              className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                trainingMode === "LONG_AUDIO"
                  ? "bg-white text-blue-900 font-bold shadow-xs border border-blue-200/80"
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  trainingMode === "LONG_AUDIO"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <FaFileAudio />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold truncate">File Dài 15 - 30 Phút</p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                    Pro 99%
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  Tự động cắt lát thông minh
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTrainingMode("DIRECT_MIC")}
              className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                trainingMode === "DIRECT_MIC"
                  ? "bg-white text-purple-900 font-bold shadow-xs border border-purple-200/80"
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  trainingMode === "DIRECT_MIC"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <FaMicrophone />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold truncate">Phòng Thu Trực Tiếp</p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                    30 Câu
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  Thu âm trực tiếp qua mic
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTrainingMode("FAST_SAMPLE")}
              className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                trainingMode === "FAST_SAMPLE"
                  ? "bg-white text-emerald-900 font-bold shadow-xs border border-emerald-200/80"
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  trainingMode === "FAST_SAMPLE"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <FaBolt />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold truncate">Mẫu Nhanh 3 - 10s</p>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    Zero-shot
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  Nhái giọng tức thì 85%
                </p>
              </div>
            </button>
          </div>

          {/* Hiển thị Trực Tiếp Giao Diện Tương Ứng (Không còn nút trung gian mở modal) */}
          {trainingMode === "LONG_AUDIO" && (
            <VoiceLongAudioForm onProfileCreated={onProfileCreated} />
          )}

          {trainingMode === "DIRECT_MIC" && (
            <VoiceBoothInlineStudio
              onVoiceTrainedSuccess={() => {
                onProfileCreated?.("");
              }}
            />
          )}

          {trainingMode === "FAST_SAMPLE" && (
            <VoiceQuickSampleForm onProfileCreated={onProfileCreated} />
          )}
        </div>
      )}
    </div>
  );
};
