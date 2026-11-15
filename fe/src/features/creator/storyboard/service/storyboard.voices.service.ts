import axiosClient from "@/src/core/api/axios-instance";
import { StoryboardVoicesResponse, StoryboardVoiceOption } from "../type/storyboard.type";

export const getStoryboardVoicesService = async (): Promise<StoryboardVoiceOption[]> => {
  const response = await axiosClient.get<StoryboardVoicesResponse>(
    "/api/v1/creator/storyboard/voices"
  );
  return response.data?.voices || [];
};

