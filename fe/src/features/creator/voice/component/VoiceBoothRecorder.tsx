"use client";

import React from "react";
import {
  FaMicrophone,
  FaStop,
  FaArrowRight,
  FaCloudUploadAlt,
  FaSpinner,
  FaRedo,
} from "react-icons/fa";
import { TrainingPromptItem } from "../type/voice.training.type";

interface VoiceBoothRecorderProps {
  currentPrompt?: TrainingPromptItem;
  currentPromptIndex: number;
  totalPrompts: number;
  isRecording: boolean;
  recordSeconds: number;
  hasFinished: boolean;
  recordedAudioUrl: string | null;
  isUploading: boolean;
  onStartRecord: () => void;
  onStopAndSave: () => void;
  onNextPrompt: () => void;
  onUploadFinal: () => void;
  onReRecord: () => void;
}

export const VoiceBoothRecorder: React.FC<VoiceBoothRecorderProps> = ({
  currentPrompt,
  currentPromptIndex,
  totalPrompts,
  isRecording,
  recordSeconds,
  hasFinished,
  recordedAudioUrl,
  isUploading,
  onStartRecord,
  onStopAndSave,
  onNextPrompt,
  onUploadFinal,
  onReRecord,
}) => {
  const isLastPrompt = currentPromptIndex === totalPrompts - 1;
  const minutes = Math.floor(recordSeconds / 60);
  const secs = recordSeconds % 60;
  const timeDisplay = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="space-y-5">
      {/* Header tiến độ */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {currentPrompt?.category}
          </span>
          <h4 className="text-sm font-bold text-gray-900 mt-0.5">
            Câu số {currentPromptIndex + 1} / {totalPrompts}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {isRecording && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              REC {timeDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Khung văn bản to để đọc */}
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm text-center relative overflow-hidden flex flex-col justify-between min-h-[280px]">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            💡 Trọng tâm: {currentPrompt?.phonetic_focus}
          </span>

          <p className="text-xl md:text-2xl font-extrabold text-gray-900 leading-relaxed max-w-xl mx-auto">
            &quot;{currentPrompt?.text}&quot;
          </p>

          {isRecording && (
            <p className="text-xs text-blue-600 font-semibold animate-pulse">
              🎙️ Đọc to rõ ràng câu trên, xong bấm &quot;Câu kế&quot; để chuyển...
            </p>
          )}
        </div>

        {/* Trạng thái & điều khiển */}
        <div className="pt-6">
          {/* Chưa bắt đầu ghi - hiện nút Start */}
          {!isRecording && !hasFinished && (
            <button
              type="button"
              onClick={onStartRecord}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/30 mx-auto transition-all hover:scale-105"
            >
              <FaMicrophone className="text-base" />
              <span>Bắt Đầu Ghi Âm Liên Tục (Đọc 30 Câu 1 Lần)</span>
            </button>
          )}

          {/* Đang ghi - hiện nút Câu kế & Dừng */}
          {isRecording && (
            <div className="flex items-center justify-center gap-3">
              {!isLastPrompt ? (
                <button
                  type="button"
                  onClick={onNextPrompt}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
                >
                  Câu kế <FaArrowRight />
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 px-3 py-2 rounded-full bg-emerald-50">
                  ✓ Đây là câu cuối cùng
                </span>
              )}

              <button
                type="button"
                onClick={onStopAndSave}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all hover:scale-105"
              >
                <FaStop /> Dừng & Kết Thúc
              </button>
            </div>
          )}

          {/* Đã xong - hiện audio review & nút upload */}
          {hasFinished && recordedAudioUrl && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md space-y-2">
                <p className="text-xs font-bold text-emerald-700">
                  ✅ Đã ghi xong {timeDisplay} — Nghe lại bản thu:
                </p>
                <audio src={recordedAudioUrl} controls className="h-10 w-full" />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReRecord}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <FaRedo /> Thu lại từ đầu
                </button>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={onUploadFinal}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all"
                >
                  {isUploading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCloudUploadAlt />
                  )}
                  {isUploading ? "Đang tải lên & huấn luyện..." : "Tải Lên & Bắt Đầu Huấn Luyện"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thanh tiến trình câu (visual cue khi đang ghi) */}
      {isRecording && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentPromptIndex + 1) / totalPrompts) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
