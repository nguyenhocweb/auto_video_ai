"use client";

import React from "react";
import { FaCheckCircle, FaRocket, FaSpinner } from "react-icons/fa";
import { TrainingPromptItem } from "../type/voice.training.type";

interface VoiceBoothPromptsChecklistProps {
  prompts: TrainingPromptItem[];
  completedPromptIds: Set<number>;
  currentPromptIndex: number;
  isStartingTraining: boolean;
  onSelectPrompt: (index: number) => void;
  onStartFullTraining: () => void;
}

export const VoiceBoothPromptsChecklist: React.FC<VoiceBoothPromptsChecklistProps> = ({
  prompts,
  completedPromptIds,
  currentPromptIndex,
  isStartingTraining,
  onSelectPrompt,
  onStartFullTraining,
}) => {
  return (
    <div className="space-y-4 flex flex-col justify-between">
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex-1 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <h5 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
            Tiến Độ 30 Câu Mẫu
          </h5>
          <span className="text-[11px] font-bold text-emerald-600">
            {completedPromptIds.size} / {prompts.length}
          </span>
        </div>

        <div className="overflow-y-auto max-h-64 space-y-1.5 pr-1 flex-1">
          {prompts.map((p, idx) => {
            const isCompleted = completedPromptIds.has(p.id);
            const isCurrent = idx === currentPromptIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPrompt(idx)}
                className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                  isCurrent
                    ? "bg-blue-50 border border-blue-400 text-blue-900 font-bold"
                    : "hover:bg-gray-50 text-gray-600 border border-transparent"
                }`}
              >
                <span className="truncate max-w-[200px]">
                  {p.id}. {p.text}
                </span>
                {isCompleted ? (
                  <FaCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nút hành động Bắt đầu Huấn Luyện */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200/80">
        <div className="flex items-center gap-2 mb-2">
          <FaRocket className="text-amber-600" />
          <span className="text-xs font-bold text-amber-900">
            Sẵn sàng huấn luyện?
          </span>
        </div>
        <p className="text-[11px] text-amber-800 mb-3 leading-relaxed">
          Cần tối thiểu <strong>5 câu</strong> để bắt đầu (đã thu:{" "}
          <strong>{completedPromptIds.size} câu</strong>). Khuyên dùng 15-30 câu để đạt độ giống 99%.
        </p>

        <button
          type="button"
          disabled={completedPromptIds.size < 5 || isStartingTraining}
          onClick={onStartFullTraining}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 text-white font-extrabold text-xs shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStartingTraining ? (
            <FaSpinner className="animate-spin text-sm" />
          ) : (
            <FaRocket className="text-sm" />
          )}
          <span>Bắt Đầu Huấn Luyện LoRA (99%)</span>
        </button>
      </div>
    </div>
  );
};

