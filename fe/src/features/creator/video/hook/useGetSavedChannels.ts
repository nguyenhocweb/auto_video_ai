"use client";

import { useQuery } from "@tanstack/react-query";
import { getSavedChannelsService } from "../service/channel.saved.service";
import { SavedChannelListResponse } from "../type/video.type";

export const useGetSavedChannels = () => {
  return useQuery<SavedChannelListResponse, Error>({
    queryKey: ["creator", "saved-channels"],
    queryFn: getSavedChannelsService,
    staleTime: 60 * 1000,
  });
};

