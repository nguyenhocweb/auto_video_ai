import axiosClient from "@/src/core/api/axios-instance";
import {
  CleanWatermarkPayload,
  CleanWatermarkResponse,
  BatchCleanPayload,
  BatchCleanResponse,
} from "../type/storyboard.type";

export const cleanSceneWatermarkService = async (
  payload: CleanWatermarkPayload
): Promise<CleanWatermarkResponse> => {
  const response = await axiosClient.post<CleanWatermarkResponse>(
    "/api/v1/creator/storyboard/clean-watermark",
    payload
  );
  return response.data;
};

export const batchCleanWatermarksService = async (
  payload: BatchCleanPayload
): Promise<BatchCleanResponse> => {
  const response = await axiosClient.post<BatchCleanResponse>(
    "/api/v1/creator/storyboard/batch-clean-watermarks",
    payload
  );
  return response.data;
};

