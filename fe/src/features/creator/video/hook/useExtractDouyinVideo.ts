"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractDouyinVideoService } from "../service/video.download.service";
import { VideoExtractPayload, VideoMetadataResponse } from "../type/video.type";

export const useExtractDouyinVideo = () => {
  return useMutation<VideoMetadataResponse, Error, VideoExtractPayload>({
    mutationFn: (payload: VideoExtractPayload) => extractDouyinVideoService(payload),
    onSuccess: (data) => {
      toast.success("Bóc tách video Douyin thành công (Không logo)!");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.detail ||
        "Không thể trích xuất video. Vui lòng kiểm tra lại đường link!";
      toast.error(msg);
    },
  });
};

