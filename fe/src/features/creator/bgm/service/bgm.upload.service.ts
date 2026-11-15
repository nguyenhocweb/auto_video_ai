import axiosClient from "@/src/core/api/axios-instance";
import { BgmTrack, BgmUploadPayload } from "../type/bgm.type";

export const uploadBgmTrack = async (payload: BgmUploadPayload): Promise<BgmTrack> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.title) formData.append("title", payload.title);
  if (payload.mood) formData.append("mood", payload.mood);
  if (payload.tags) formData.append("tags", payload.tags);
  if (payload.start_time !== undefined && payload.start_time > 0) {
    formData.append("start_time", payload.start_time.toString());
  }
  if (payload.end_time !== undefined && payload.end_time > 0) {
    formData.append("end_time", payload.end_time.toString());
  }
  formData.append("sanitize_audio", (payload.sanitize_audio ?? true).toString());

  const res = await axiosClient.post<BgmTrack>("/api/v1/creator/bgm/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
