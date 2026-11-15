"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStar, FaBolt, FaChartLine } from "react-icons/fa";
import {
  useGetTrainingPrompts,
  useCreateTrainingJob,
  useTrainingJobStatus,
  useUploadTrainingSample,
  useStartTrainingJob,
  useInspectAudioQuality,
} from "../hook/useVoiceTraining";
import { AudioQualityReport } from "../type/voice.training.type";
import { VoiceBoothInitStep } from "./VoiceBoothInitStep";
import { VoiceBoothTrainingProgress } from "./VoiceBoothTrainingProgress";
import { VoiceBoothRecorder } from "./VoiceBoothRecorder";
import { VoiceBoothPromptsChecklist } from "./VoiceBoothPromptsChecklist";
import { toast } from "sonner";

interface VoiceBoothInlineStudioProps {
  onVoiceTrainedSuccess?: () => void;
}

export const VoiceBoothInlineStudio: React.FC<VoiceBoothInlineStudioProps> = ({
  onVoiceTrainedSuccess,
}) => {
  const { data: promptsData } = useGetTrainingPrompts();
  const prompts = promptsData?.prompts || [];

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [sampleQualityReport, setSampleQualityReport] = useState<AudioQualityReport | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: createJob, isPending: isCreatingJob } = useCreateTrainingJob((job) => {
    setActiveJobId(job._id);
  });

  const { mutate: inspectAudioSample, isPending: isInspectingSample } = useInspectAudioQuality();
  const { data: jobDetail } = useTrainingJobStatus(activeJobId);

  const { mutate: uploadSample, isPending: isUploadingSample } = useUploadTrainingSample(
    () => {
      setRecordedAudioUrl(null);
      setRecordedBlob(null);
      setSampleQualityReport(null);
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex((prev) => prev + 1);
      }
    }
  );

  const { mutate: startTraining, isPending: isStartingTraining } = useStartTrainingJob();

  const completedPromptIds = new Set(
    jobDetail?.samples?.map((s) => s.prompt_id) || []
  );

  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlob(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());

        // Kiểm định tạp âm & đo SNR câu vừa đọc
        inspectAudioSample(audioBlob, {
          onSuccess: (data) => {
            setSampleQualityReport(data.report);
          },
        });
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordedAudioUrl(null);
    } catch {
      toast.error("Không thể mở micro. Vui lòng cấp quyền micro trên trình duyệt!");
    }
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveCurrentSample = () => {
    if (!activeJobId || !recordedBlob) return;
    const currentPrompt = prompts[currentPromptIndex];
    uploadSample({
      jobId: activeJobId,
      promptId: currentPrompt.id,
      promptText: currentPrompt.text,
      audioBlob: recordedBlob,
    });
  };

  const currentPrompt = prompts[currentPromptIndex];
  const isJobCompleted = jobDetail?.job?.status === "COMPLETED";
  const isJobTraining = jobDetail?.job?.status === "TRAINING";

  return (
    <div className="space-y-6">
      {/* Banner giới thiệu ngắn gọn phía trên */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
            <FaStar />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm md:text-base font-extrabold tracking-tight">
                Phòng Thu Huấn Luyện Trực Tiếp (30 Câu Chuẩn Âm Vị)
              </h4>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400 text-gray-900">
                LoRA 99%
              </span>
            </div>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Đọc to từng câu theo micro để AI học ngữ điệu, độ vang và thanh điệu tự nhiên của bạn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-blue-200 self-start sm:self-auto">
          <span className="px-2 py-1 rounded-lg bg-white/10 flex items-center gap-1">
            <FaBolt className="text-yellow-400" /> GPU Fine-tuning
          </span>
          <span className="px-2 py-1 rounded-lg bg-white/10 flex items-center gap-1">
            <FaChartLine className="text-emerald-400" /> Chuẩn lồng tiếng
          </span>
        </div>
      </div>

      {/* Hiển thị Trực Tiếp Phòng Thu Âm (Không cần bấm nút mở modal) */}
      <div className="p-4 md:p-6 rounded-2xl bg-gray-50/70 border border-gray-200/90 shadow-2xs">
        {!activeJobId ? (
          <VoiceBoothInitStep
            isCreatingJob={isCreatingJob}
            onCreateJob={(payload) => createJob(payload)}
          />
        ) : isJobTraining || isJobCompleted ? (
          <VoiceBoothTrainingProgress
            job={jobDetail?.job}
            onClose={() => setActiveJobId(null)}
            onVoiceTrainedSuccess={onVoiceTrainedSuccess}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VoiceBoothRecorder
                currentPrompt={currentPrompt}
                currentPromptIndex={currentPromptIndex}
                totalPrompts={prompts.length}
                completedCount={completedPromptIds.size}
                isRecording={isRecording}
                recordSeconds={recordSeconds}
                recordedAudioUrl={recordedAudioUrl}
                isUploadingSample={isUploadingSample}
                qualityReport={sampleQualityReport}
                isInspectingQuality={isInspectingSample}
                onStartRecord={handleStartRecord}
                onStopRecord={handleStopRecord}
                onSaveSample={handleSaveCurrentSample}
                onPrevPrompt={() => {
                  setCurrentPromptIndex((p) => p - 1);
                  setRecordedAudioUrl(null);
                  setSampleQualityReport(null);
                }}
                onNextPrompt={() => {
                  setCurrentPromptIndex((p) => p + 1);
                  setRecordedAudioUrl(null);
                  setSampleQualityReport(null);
                }}
              />
            </div>

            <VoiceBoothPromptsChecklist
              prompts={prompts}
              completedPromptIds={completedPromptIds}
              currentPromptIndex={currentPromptIndex}
              isStartingTraining={isStartingTraining}
              onSelectPrompt={(idx) => {
                setCurrentPromptIndex(idx);
                setRecordedAudioUrl(null);
              }}
              onStartFullTraining={() => {
                if (activeJobId) startTraining(activeJobId);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

