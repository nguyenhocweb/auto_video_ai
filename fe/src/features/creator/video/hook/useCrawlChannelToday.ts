"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { crawlChannelTodayService } from "../service/video.crawl.service";
import {
  ChannelCrawlPayload,
  ChannelTodayVideosResponse,
} from "../type/video.type";

export const useCrawlChannelToday = () => {
  return useMutation<ChannelTodayVideosResponse, Error, ChannelCrawlPayload>({
    mutationFn: (payload) => crawlChannelTodayService(payload),
    onSuccess: (data) => {
      toast.success(
        `Đã quét thành công kênh "${data.creator_name}"! Tìm thấy ${data.today_count} video.`
      );
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.detail ||
        error?.message ||
        "Không thể quét dữ liệu kênh này. Vui lòng kiểm tra lại link!";
      toast.error(errMsg);
    },
  });
};

