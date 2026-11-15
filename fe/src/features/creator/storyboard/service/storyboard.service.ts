import axiosClient from "@/src/core/api/axios-instance";
import {
  ScriptGeneratePayload,
  ScriptGenerateResponse,
  RenderStoryboardPayload,
  RenderStoryboardResponse,
} from "../type/storyboard.type";

export const generateScriptService = async (
  payload: ScriptGeneratePayload
): Promise<ScriptGenerateResponse> => {
  const response = await axiosClient.post<ScriptGenerateResponse>(
    "/api/v1/creator/storyboard/generate-script",
    payload
  );
  return response.data;
};

export const uploadSceneImageService = async (
  jobId: string,
  sceneIdx: number,
  file: File,
  autoClean: boolean = false
): Promise<{ success: boolean; url: string; path: string; scene_idx: number; cleaned?: boolean }> => {
  const formData = new FormData();
  formData.append("job_id", jobId);
  formData.append("scene_idx", sceneIdx.toString());
  formData.append("file", file);
  if (autoClean) {
    formData.append("auto_clean", "true");
  }

  const response = await axiosClient.post(
    "/api/v1/creator/storyboard/upload-image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const renderStoryboardVideoService = async (
  payload: RenderStoryboardPayload
): Promise<RenderStoryboardResponse> => {
  const response = await axiosClient.post<RenderStoryboardResponse>(
    "/api/v1/creator/storyboard/render-video",
    payload
  );
  return response.data;
};
