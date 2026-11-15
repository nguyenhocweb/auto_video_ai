"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostedVideosService } from "../service/automation.service";
import { PostedVideoListResponse } from "../type/automation.type";

export const useGetPostedVideos = () => {
  return useQuery<PostedVideoListResponse, Error>({
    queryKey: ["creator", "automation-posted-videos"],
    queryFn: getPostedVideosService,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });
};

