import axiosClient from "@/src/core/api/axios-instance";
import { CopyrightCheckResult } from "../type/bgm.type";

export const checkCopyrightByFile = async (file: File): Promise<CopyrightCheckResult> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosClient.post<CopyrightCheckResult>(
    "/api/v1/creator/bgm/check-copyright",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

export const checkCopyrightByTrackId = async (trackId: string): Promise<CopyrightCheckResult> => {
  const res = await axiosClient.get<CopyrightCheckResult>(
    `/api/v1/creator/bgm/${trackId}/check-copyright`
  );
  return res.data;
};

