"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTrainingPromptsService,
  createTrainingJobService,
  getTrainingJobStatusService,
  uploadTrainingSampleService,
  startTrainingJobService,
  uploadLongAudioTrainingService,
  inspectAudioService,
} from "../service/voice.training.service";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useGetTrainingPrompts = () => {
  return useQuery({
    queryKey: ["voice-training-prompts"],
    queryFn: () => getTrainingPromptsService(),
    staleTime: 60 * 1000,
  });
};

export const useCreateTrainingJob = (onSuccessCallback?: (job: any) => void) => {
  return useMutation({
    mutationFn: (data: { voice_name: string; gender?: string }) =>
      createTrainingJobService(data),
    onSuccess: (res) => {
      toast.success("Khởi tạo phòng thu âm huấn luyện thành công!");
      onSuccessCallback?.(res.job);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Không thể tạo phiên phòng thu âm!"));
    },
  });
};

export const useTrainingJobStatus = (jobId: string | null) => {
  return useQuery({
    queryKey: ["voice-training-job", jobId],
    queryFn: () => (jobId ? getTrainingJobStatusService(jobId) : null),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = (query.state.data as any)?.job?.status;
      return status === "TRAINING" || status === "PREPROCESSING" ? 1500 : false;
    },
    staleTime: 1000,
  });
};

export const useUploadTrainingSample = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      jobId: string;
      promptId: number;
      promptText: string;
      audioBlob: Blob;
    }) =>
      uploadTrainingSampleService(
        data.jobId,
        data.promptId,
        data.promptText,
        data.audioBlob
      ),
    onSuccess: (_, vars) => {
      toast.success(`Đã lưu câu ${vars.promptId} lên Cloudinary!`);
      queryClient.invalidateQueries({ queryKey: ["voice-training-job", vars.jobId] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Không thể lưu câu ghi âm!"));
    },
  });
};

export const useStartTrainingJob = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => startTrainingJobService(jobId),
    onSuccess: (_, jobId) => {
      toast.success("🚀 Đã khởi chạy tiến trình Huấn luyện Chuyên sâu!");
      queryClient.invalidateQueries({ queryKey: ["voice-training-job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["voice-profiles"] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Lỗi khi bắt đầu huấn luyện!"));
    },
  });
};

export const useUploadLongAudioTraining = (
  onSuccessCallback?: (jobId: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      voiceName: string;
      gender: string;
      audioFile: File;
      autoStart?: boolean;
    }) =>
      uploadLongAudioTrainingService(
        data.voiceName,
        data.gender,
        data.audioFile,
        data.autoStart
      ),
    onSuccess: (res) => {
      toast.success("Đã tải lên file âm thanh dài! Hệ thống đang cắt lát thông minh và huấn luyện...");
      queryClient.invalidateQueries({ queryKey: ["voice-training-job", res.job_id] });
      queryClient.invalidateQueries({ queryKey: ["voice-profiles"] });
      onSuccessCallback?.(res.job_id);
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Không thể xử lý file âm thanh dài!"));
    },
  });
};

export const useInspectAudioQuality = () => {
  return useMutation({
    mutationFn: (audioFileOrBlob: File | Blob) =>
      inspectAudioService(audioFileOrBlob),
    onError: (err) => {
      console.warn("Audio inspection warning:", err);
    },
  });
};
