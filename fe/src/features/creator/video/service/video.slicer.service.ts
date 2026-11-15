import axiosClient from "@/src/core/api/axios-instance";
import {
  SliceVideoToTemplatePayload,
  SliceVideoToTemplateResponse,
} from "../type/slicer.type";

export const sliceVideoToTemplateService = async (
  payload: SliceVideoToTemplatePayload
): Promise<SliceVideoToTemplateResponse> => {
  const response = await axiosClient.post<SliceVideoToTemplateResponse>(
    "/api/v1/creator/video/slice-to-template",
    payload
  );
  return response.data;
};

