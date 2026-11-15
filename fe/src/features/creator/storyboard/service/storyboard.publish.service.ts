import axiosClient from "@/src/core/api/axios-instance";
import {
  PublishStoryboardPayload,
  PublishStoryboardResponse,
} from "../type/storyboard.type";

export const publishStoryboardVideoService = async (
  payload: PublishStoryboardPayload
): Promise<PublishStoryboardResponse> => {
  const response = await axiosClient.post<PublishStoryboardResponse>(
    "/api/v1/creator/storyboard/publish-video",
    payload
  );
  return response.data;
};
