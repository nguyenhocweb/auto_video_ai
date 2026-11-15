import axiosClient from "@/src/core/api/axios-instance";
import { UploadSampleResponse } from "../type/voice.type";

export const uploadVoiceSampleService = async (file: File): Promise<UploadSampleResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post<UploadSampleResponse>(
    "/api/v1/creator/voice/upload-sample",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

