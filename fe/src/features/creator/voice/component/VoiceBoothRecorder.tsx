"use client";

import React from "react";
import {
  FaMicrophone,
  FaStop,
  FaCloudUploadAlt,
  FaSpinner,
  FaRedo,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { TrainingPromptItem, AudioQualityReport } from "../type/voice.training.type";
import { AudioQualityBadge } from "./AudioQualityBadge";

interface VoiceBoothRecorderProps {
  currentPrompt?: TrainingPromptItem;
  currentPromptIndex: number;
  totalPrompts: number;
  completedCount: number;
  isRecording: boolean;
  recordSeconds: number;
  recordedAudioUrl: string | null;
  isUploadingSample: boolean;
  qualityReport?: AudioQualityReport | null;
  isInspectingQuality?: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onSaveSample: () => void;
  onPrevPrompt: () => void;
  onNextPrompt: () => void;
}

export const VoiceBoothRecorder: React.FC<VoiceBoothRecorderProps> = ({
  currentPrompt,
  currentPromptIndex,
  totalPrompts,
  completedCount,
  isRecording,
  recordSeconds,
  recordedAudioUrl,
  isUploadingSample,
  qualityReport,
  isInspectingQuality,
  onStartRecord,
  onStopRecord,
  onSaveSample,
  onPrevPrompt,
  onNextPrompt,
}) => {
  return (
    <div className="space-y-5">
      {/* Header tiến độ câu */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {currentPrompt?.category}
          </span>
          <h4 className="text-sm font-bold text-gray-900 mt-0.5">
            Câu số {currentPrompt?.id} / {totalPrompts}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            Đã lưu {completedCount} / {totalPrompts} câu
          </span>
        </div>
      </div>

      {/* Khung văn bản to để đọc */}
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm text-center relative overflow-hidden flex flex-col justify-between min-h-[260px]">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            💡 Trọng tâm: {currentPrompt?.phonetic_focus}
          </span>

          <p className="text-xl md:text-2xl font-extrabold text-gray-900 leading-relaxed max-w-xl mx-auto">
            &quot;{currentPrompt?.text}&quot;
          </p>
        </div>

        {/* Trạng thái thu âm */}
        <div className="pt-6">
          {isRecording ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm animate-pulse">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span>ĐANG THU ÂM ({recordSeconds}s) - Đọc to rõ câu trên...</span>
              </div>
              <button
                type="button"
                onClick={onStopRecord}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all hover:scale-105"
              >
                <FaStop /> Dừng Thu Âm
              </button>
            </div>
          ) : recordedAudioUrl ? (
            <div className="flex flex-col items-center gap-3">
              <audio src={recordedAudioUrl} controls className="h-10 w-full max-w-sm" />

              {/* Huy hiệu kiểm định chất lượng âm thanh và đo SNR */}
              {(qualityReport || isInspectingQuality) && (
                <div className="w-full max-w-sm text-left">
                  <AudioQualityBadge report={qualityReport || null} isLoading={isInspectingQuality} />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onStartRecord}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <FaRedo /> Thu lại
                </button>

                <button
                  type="button"
                  disabled={isUploadingSample}
                  onClick={onSaveSample}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25"
                >
                  {isUploadingSample ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCloudUploadAlt />
                  )}
                  Lưu Lên Cloud &amp; Sang Câu Kế
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartRecord}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/30 mx-auto transition-all hover:scale-105"
            >
              <FaMicrophone className="text-base" />
              <span>Bắt Đầu Đọc Câu Này</span>
            </button>
          )}
        </div>
      </div>

      {/* Nút điều hướng trước / sau */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={currentPromptIndex === 0}
          onClick={onPrevPrompt}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
        >
          <FaArrowLeft /> Câu trước
        </button>

        <button
          type="button"
          disabled={currentPromptIndex === totalPrompts - 1}
          onClick={onNextPrompt}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
        >
          Câu tiếp theo <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

