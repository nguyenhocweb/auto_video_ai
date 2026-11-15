import axiosClient from "@/src/core/api/axios-instance";
import {
  TrainingPromptItem,
  TrainingPromptsResponse,
  TrainingJobItem,
  TrainingJobDetailResponse,
  AudioQualityReport,
} from "../type/voice.training.type";

export type {
  TrainingPromptItem,
  TrainingPromptsResponse,
  TrainingJobItem,
  TrainingJobDetailResponse,
  AudioQualityReport,
};

export type TrainingJobResponse = TrainingJobItem;


export const getTrainingPromptsService = async (): Promise<TrainingPromptsResponse> => {
  const res = await axiosClient.get<TrainingPromptsResponse>("/api/v1/creator/voice/training/prompts");
  return res.data;
};

export const createTrainingJobService = async (payload: {
  voice_name: string;
  gender?: string;
}): Promise<{ job: TrainingJobResponse }> => {
  const res = await axiosClient.post("/api/v1/creator/voice/training/job", payload);
  return res.data;
};

export const getTrainingJobStatusService = async (
  jobId: string
): Promise<TrainingJobDetailResponse> => {
  const res = await axiosClient.get<TrainingJobDetailResponse>(
    `/api/v1/creator/voice/training/job/${jobId}`
  );
  return res.data;
};

export const uploadTrainingSampleService = async (
  jobId: string,
  promptId: number,
  promptText: string,
  audioBlob: Blob
) => {
  const formData = new FormData();
  formData.append("job_id", jobId);
  formData.append("prompt_id", promptId.toString());
  formData.append("prompt_text", promptText);
  formData.append("file", audioBlob, `prompt_${promptId}.wav`);

  const res = await axiosClient.post("/api/v1/creator/voice/training/sample", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const startTrainingJobService = async (jobId: string) => {
  const res = await axiosClient.post(`/api/v1/creator/voice/training/start/${jobId}`);
  return res.data;
};

export const uploadLongAudioTrainingService = async (
  voiceName: string,
  gender: string,
  audioFile: File,
  autoStart = true
): Promise<{ message: string; job_id: string; status: string }> => {
  const formData = new FormData();
  formData.append("voice_name", voiceName);
  formData.append("gender", gender);
  formData.append("auto_start", String(autoStart));
  formData.append("file", audioFile);

  const res = await axiosClient.post(
    "/api/v1/creator/voice/training/upload-long-audio",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

export const inspectAudioService = async (
  audioFileOrBlob: File | Blob
): Promise<{ success: boolean; report: AudioQualityReport }> => {
  const formData = new FormData();
  formData.append("audio_file", audioFileOrBlob, "sample.wav");
  const res = await axiosClient.post<{ success: boolean; report: AudioQualityReport }>(
    "/api/v1/creator/voice/training/inspect-audio",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

