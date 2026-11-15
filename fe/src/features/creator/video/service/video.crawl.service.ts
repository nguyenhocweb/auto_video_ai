import axiosClient from "@/src/core/api/axios-instance";
import {
  ChannelCrawlPayload,
  ChannelTodayVideosResponse,
} from "../type/video.type";

export const crawlChannelTodayService = async (
  payload: ChannelCrawlPayload
): Promise<ChannelTodayVideosResponse> => {
  const response = await axiosClient.post<ChannelTodayVideosResponse>(
    "/api/v1/creator/video/channel/today",
    payload
  );
  return response.data;
};

