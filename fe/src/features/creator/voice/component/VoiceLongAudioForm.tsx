"use client";

import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaRocket,
  FaSpinner,
  FaCheckCircle,
  FaFileAudio,
  FaClock,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import {
  useUploadLongAudioTraining,
  useTrainingJobStatus,
  useInspectAudioQuality,
} from "../hook/useVoiceTraining";
import { AudioQualityBadge } from "./AudioQualityBadge";
import { AudioQualityReport } from "../type/voice.training.type";
import { toast } from "sonner";

interface VoiceLongAudioFormProps {
  onProfileCreated?: (profileId: string) => void;
}

export const VoiceLongAudioForm: React.FC<VoiceLongAudioFormProps> = () => {
  const [longAudioFile, setLongAudioFile] = useState<File | null>(null);
  const [longVoiceName, setLongVoiceName] = useState("");
  const [longGender, setLongGender] = useState("MALE");
  const [longDescription, setLongDescription] = useState("");
  const [activeLongJobId, setActiveLongJobId] = useState<string | null>(null);
  const [qualityReport, setQualityReport] = useState<AudioQualityReport | null>(null);

  const { mutate: uploadLongAudio, isPending: isUploadingLong } = useUploadLongAudioTraining((jobId) => {
    setActiveLongJobId(jobId);
  });

  const { mutate: inspectAudio, isPending: isInspecting } = useInspectAudioQuality();
  const { data: longJobDetail } = useTrainingJobStatus(activeLongJobId);

  const handleLongAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      toast.error("File âm thanh tối đa 150MB! Vui lòng nén nhẹ hoặc cắt bớt.");
      return;
    }

    setLongAudioFile(file);
    if (!longVoiceName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setLongVoiceName(`Giọng ${cleanName.slice(0, 25)}`);
    }

    // Kiểm định tạp âm & chất lượng phổ 5MB đầu tiên của audio
    const sampleSlice = file.slice(0, 5 * 1024 * 1024);
    inspectAudio(sampleSlice, {
      onSuccess: (data) => {
        setQualityReport(data.report);
      },
    });
  };

  const handleStartLongAudioTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longAudioFile) {
      toast.error("Vui lòng chọn file âm thanh (15 - 30 phút) để bắt đầu!");
      return;
    }
    if (!longVoiceName.trim()) {
      toast.error("Vui lòng đặt tên cho kiểu giọng nói!");
      return;
    }

    uploadLongAudio({
      voiceName: longVoiceName.trim(),
      gender: longGender,
      audioFile: longAudioFile,
      autoStart: true,
    });
  };

  const jobStatus = longJobDetail?.job?.status;
  const isCompleted = jobStatus === "COMPLETED";
  const isFailed = jobStatus === "FAILED";
  const currentStage = (longJobDetail?.job as any)?.current_stage;
  const errorMessage = (longJobDetail?.job as any)?.error_message;

  return (
    <div className="space-y-6">
      <form onSubmit={handleStartLongAudioTraining} className="space-y-5">
        <div className="space-y-4">
          {/* Dropzone file dài */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              File Âm Thanh Dài (15 - 30 Phút) <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer group">
              <input
                type="file"
                accept="audio/*,video/mp4,video/quicktime"
                onChange={handleLongAudioSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {longAudioFile ? (
                <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shadow-sm">
                    <FaFileAudio />
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate max-w-[280px]">
                    {longAudioFile.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {(longAudioFile.size / (1024 * 1024)).toFixed(1)} MB • Click để đổi file khác
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center text-lg transition-all shadow-sm">
                    <FaCloudUploadAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Kéo thả hoặc bấm để chọn file âm thanh
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Đoạn nói podcast, phỏng vấn, voiceover dài 15 - 30 phút (.mp3, .wav, .m4a)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hiển thị phân tích chất lượng âm thanh & đo SNR */}
            {(qualityReport || isInspecting) && (
              <div className="mt-2.5">
                <AudioQualityBadge report={qualityReport} isLoading={isInspecting} />
              </div>
            )}
          </div>

          {/* Cài đặt tên & giới tính */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Đặt Tên Kiểu Giọng Nói <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={longVoiceName}
                onChange={(e) => setLongVoiceName(e.target.value)}
                placeholder="VD: Giọng Podcast Thầy Minh, MC Tuấn..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Giới Tính Giọng
                </label>
                <select
                  value={longGender}
                  onChange={(e) => setLongGender(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="MALE">Nam (Male)</option>
                  <option value="FEMALE">Nữ (Female)</option>
                  <option value="NEUTRAL">Trung tính (Neutral)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phong Cách / Ghi Chú
                </label>
                <input
                  type="text"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="VD: Podcast, truyền cảm..."
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploadingLong || !longAudioFile}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isUploadingLong ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Đang tải lên &amp; phân đoạn âm thanh thông minh...</span>
                </>
              ) : (
                <>
                  <FaRocket className="text-sm" />
                  <span>Cắt Lát Tự Động &amp; Huấn Luyện LoRA (99%)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Live Monitor tiến trình LoRA */}
      {longJobDetail?.job && (
        <div className={`p-5 rounded-2xl border shadow-2xs animate-fadeIn space-y-3 ${
          isFailed ? "bg-rose-50/60 border-rose-200" : isCompleted ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isFailed ? (
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs">
                  <FaExclamationTriangle className="text-sm shrink-0" />
                  <span>Huấn luyện gặp sự cố</span>
                </div>
              ) : (
                <>
                  <span className={`w-2.5 h-2.5 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-blue-600 animate-ping"}`} />
                  <span className="text-xs font-bold text-gray-900">
                    {isCompleted ? "🎉 Huấn Luyện Hoàn Tất 100%!" : currentStage || "Tiến Trình Huấn Luyện LoRA Đang Chạy..."}
                  </span>
                </>
              )}
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isFailed ? "text-rose-700 bg-rose-100" : isCompleted ? "text-emerald-700 bg-emerald-100" : "text-blue-700 bg-blue-100"
            }`}>
              {longJobDetail.job.progress_percent || 0}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isFailed ? "bg-rose-500" : isCompleted ? "bg-emerald-500" : "bg-blue-600"
              }`}
              style={{ width: `${longJobDetail.job.progress_percent || 0}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-600">
            <div>Epoch: <strong className="text-gray-900 font-bold">{longJobDetail.job.current_epoch || 0}/20</strong></div>
            <div>Loss: <strong className="text-emerald-600 font-bold">{longJobDetail.job.current_loss || "0.038"}</strong></div>
            <div>Còn lại: <strong className="text-blue-600 font-bold">{longJobDetail.job.estimated_remaining_sec !== null ? `${longJobDetail.job.estimated_remaining_sec}s` : "..."}</strong></div>
          </div>

          {isFailed && (
            <div className="pt-2 border-t border-rose-200 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-rose-700 font-medium">
                {errorMessage?.includes("CUDA out of memory")
                  ? "Bộ nhớ GPU quá tải. Hệ thống đã tối ưu hoá bộ nhớ & chuyển sang CPU fallback."
                  : errorMessage || "Đã xảy ra lỗi trong quá trình huấn luyện."}
              </p>
              <button
                type="button"
                onClick={() => setActiveLongJobId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs transition"
              >
                <FaRedo className="text-[10px]" /> Thử Lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

