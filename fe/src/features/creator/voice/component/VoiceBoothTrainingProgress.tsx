"use client";

import React from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FadeIn } from "@/src/core/components/animation/FadeIn";
import { TrainingJobItem } from "../type/voice.training.type";

interface VoiceBoothTrainingProgressProps {
  job?: TrainingJobItem | null;
  onClose: () => void;
  onVoiceTrainedSuccess?: () => void;
}

export const VoiceBoothTrainingProgress: React.FC<VoiceBoothTrainingProgressProps> = ({
  job,
  onClose,
  onVoiceTrainedSuccess,
}) => {
  const isJobCompleted = job?.status === "COMPLETED";
  const isJobFailed = job?.status === "FAILED";
  const currentStage = (job as any)?.current_stage;
  const errorMessage = (job as any)?.error_message;

  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-6">
      <FadeIn>
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-extrabold relative">
            {isJobCompleted ? (
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
                <FaCheckCircle />
              </div>
            ) : isJobFailed ? (
              <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-lg">
                <FaExclamationTriangle />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 border-4 border-blue-600 border-t-transparent animate-spin flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700">
                  {job?.progress_percent || 0}%
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              {isJobCompleted
                ? "🎉 Huấn Luyện Thành Công 99%!"
                : isJobFailed
                ? "⚠️ Huấn Luyện Gặp Sự Cố"
                : currentStage || "AI Đang Học Chuyên Sâu Từng Câu Của Bạn..."}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {isJobCompleted
                ? "Mô hình giọng nói đã được xuất và lưu trữ an toàn trên Cloudinary & MongoDB."
                : isJobFailed
                ? errorMessage || "Bộ nhớ GPU quá tải. Hãy thử lại."
                : "Đang cập nhật trọng số mạng nơ-ron (LoRA) trên card GPU đồ họa."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left">
            <div>
              <span className="text-[11px] font-semibold text-gray-500">Tiến trình:</span>
              <p className="text-sm font-bold text-gray-900">
                {job?.current_epoch || 0} / {job?.target_epochs || 20} Epochs
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-500">Độ lỗi (Loss):</span>
              <p className="text-sm font-bold text-emerald-600">
                {job?.current_loss || "0.084"}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-gray-500">Còn khoảng:</span>
              <p className="text-sm font-bold text-blue-600">
                {job?.estimated_remaining_sec !== null
                  ? `${job?.estimated_remaining_sec}s`
                  : "Đang tính..."}
              </p>
            </div>
          </div>

          {isJobCompleted ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onVoiceTrainedSuccess?.();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Dùng Giọng Nói Mới Để Đọc Kịch Bản Ngay
            </button>
          ) : isJobFailed ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Đóng &amp; Thử Lại
            </button>
          ) : null}
        </div>
      </FadeIn>
    </div>
  );
};

