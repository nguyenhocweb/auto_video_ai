"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaBolt, FaChartLine } from "react-icons/fa";
import {
  useGetTrainingPrompts,
  useCreateTrainingJob,
  useTrainingJobStatus,
  useUploadLongAudioTraining,
  useStartTrainingJob,
} from "../hook/useVoiceTraining";
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
  const [voiceName, setVoiceName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Continuous recording states
  const [isRecording, setIsRecording] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [readPromptIds, setReadPromptIds] = useState<Set<number>>(new Set());

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: createJob, isPending: isCreatingJob } = useCreateTrainingJob((job) => {
    setActiveJobId(job._id);
  });

  const { data: jobDetail } = useTrainingJobStatus(activeJobId);

  const { mutate: uploadLongAudio, isPending: isUploadingLongAudio } =
    useUploadLongAudioTraining((jobId) => {
      setActiveJobId(jobId);
    });

  const { mutate: startTraining, isPending: isStartingTraining } = useStartTrainingJob();

  const completedPromptIds = new Set(
    jobDetail?.samples?.map((s) => s.prompt_id) || []
  );

  // Timer đếm giây khi đang ghi
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
        setHasFinished(true);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setHasFinished(false);
      setRecordedAudioUrl(null);
      setRecordedBlob(null);
      setCurrentPromptIndex(0);
      setReadPromptIds(new Set());
      toast.info("🎙️ Micro đã bật — Hãy đọc to từng câu, bấm \"Câu kế\" để chuyển!");
    } catch {
      toast.error("Không thể mở micro. Vui lòng cấp quyền micro trên trình duyệt!");
    }
  };

  const handleNextPromptWhileRecording = () => {
    if (currentPromptIndex < prompts.length - 1) {
      // Đánh dấu câu hiện tại đã đọc xong
      setReadPromptIds((prev) => {
        const next = new Set(prev);
        if (prompts[currentPromptIndex]) next.add(prompts[currentPromptIndex].id);
        return next;
      });
      setCurrentPromptIndex((p) => p + 1);
    }
  };

  const handleStopAndSave = () => {
    // Đánh dấu câu cuối đã đọc
    setReadPromptIds((prev) => {
      const next = new Set(prev);
      if (prompts[currentPromptIndex]) next.add(prompts[currentPromptIndex].id);
      return next;
    });
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUploadFinal = () => {
    if (!recordedBlob) return;
    const audioFile = new File([recordedBlob], "continuous_recording.wav", {
      type: "audio/wav",
    });
    uploadLongAudio({
      voiceName: voiceName || jobDetail?.job?.voice_name || "My Voice",
      gender: gender || jobDetail?.job?.gender || "MALE",
      audioFile,
      autoStart: true,
    });
  };

  const handleReRecord = () => {
    setHasFinished(false);
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setRecordSeconds(0);
    setCurrentPromptIndex(0);
    setReadPromptIds(new Set());
  };

  const handleCreateJob = (payload: { voice_name: string; gender: string }) => {
    setVoiceName(payload.voice_name);
    setGender(payload.gender);
    createJob(payload);
  };

  const currentPrompt = prompts[currentPromptIndex];
  const isJobCompleted = jobDetail?.job?.status === "COMPLETED";
  const isJobTraining = jobDetail?.job?.status === "TRAINING";

  return (
    <div className="space-y-6">
      {/* Banner */}
      <BannerHeader />

      {/* Phòng Thu Âm */}
      <div className="p-4 md:p-6 rounded-2xl bg-gray-50/70 border border-gray-200/90 shadow-2xs">
        {!activeJobId ? (
          <VoiceBoothInitStep
            isCreatingJob={isCreatingJob}
            onCreateJob={handleCreateJob}
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
                isRecording={isRecording}
                recordSeconds={recordSeconds}
                hasFinished={hasFinished}
                recordedAudioUrl={recordedAudioUrl}
                isUploading={isUploadingLongAudio}
                onStartRecord={handleStartRecord}
                onStopAndSave={handleStopAndSave}
                onNextPrompt={handleNextPromptWhileRecording}
                onUploadFinal={handleUploadFinal}
                onReRecord={handleReRecord}
              />
            </div>

            <VoiceBoothPromptsChecklist
              prompts={prompts}
              completedPromptIds={completedPromptIds}
              readPromptIds={readPromptIds}
              currentPromptIndex={currentPromptIndex}
              isRecording={isRecording}
              isStartingTraining={isStartingTraining}
              onSelectPrompt={(idx) => {
                if (!isRecording) setCurrentPromptIndex(idx);
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

/* ---- Sub-component Banner (tách nhỏ giữ dưới 300 dòng) ---- */
const BannerHeader: React.FC = () => (
  <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
        <FaStar />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm md:text-base font-extrabold tracking-tight">
            Phòng Thu Huấn Luyện Liên Tục (30 Câu — 1 Lần Ghi)
          </h4>
          <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400 text-gray-900">
            LoRA 99%
          </span>
        </div>
        <p className="text-[11px] text-blue-200 mt-0.5">
          Bấm Ghi 1 lần → Đọc hết 30 câu → Upload toàn bộ → AI tự cắt lát &amp; huấn luyện
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
);
