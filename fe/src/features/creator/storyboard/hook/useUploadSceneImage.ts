import { useMutation } from "@tanstack/react-query";
import { uploadSceneImageService } from "../service/storyboard.service";

interface UploadSceneImagePayload {
  jobId: string;
  sceneIdx: number;
  file: File;
  autoClean?: boolean;
}

export const useUploadSceneImage = () => {
  return useMutation<
    { success: boolean; url: string; path: string; scene_idx: number; cleaned?: boolean },
    Error,
    UploadSceneImagePayload
  >({
    mutationFn: ({ jobId, sceneIdx, file, autoClean }) =>
      uploadSceneImageService(jobId, sceneIdx, file, !!autoClean),
  });
};
