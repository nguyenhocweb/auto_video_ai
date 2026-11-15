"use client";

import { useQuery } from "@tanstack/react-query";
import { getDownloadedVideosService } from "../service/video.download.service";
import { VideoPaginationResponse, VideoHistoryParams } from "../type/video.type";

export const useGetDownloadedVideos = (params?: VideoHistoryParams) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  return useQuery<VideoPaginationResponse>({
    queryKey: ["creator-downloaded-videos", page, limit],
    queryFn: () => getDownloadedVideosService({ page, limit }),
    staleTime: 60 * 1000,
  });
};

