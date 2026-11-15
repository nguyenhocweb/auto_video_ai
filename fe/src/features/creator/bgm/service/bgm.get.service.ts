import axiosClient from "@/src/core/api/axios-instance";
import { BgmListResponse } from "../type/bgm.type";

export const getBgmTracks = async (
  mood?: string,
  skip: number = 0,
  limit: number = 50
): Promise<BgmListResponse> => {
  const params = new URLSearchParams();
  if (mood && mood !== "all") params.append("mood", mood);
  params.append("skip", String(skip));
  params.append("limit", String(limit));

  const res = await axiosClient.get<BgmListResponse>(`/api/v1/creator/bgm?${params.toString()}`);
  return res.data;
};

