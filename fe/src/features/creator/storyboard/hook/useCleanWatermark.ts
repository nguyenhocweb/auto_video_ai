import { useMutation } from "@tanstack/react-query";
import {
  cleanSceneWatermarkService,
  batchCleanWatermarksService,
} from "../service/cleanWatermark.service";
import {
  CleanWatermarkPayload,
  CleanWatermarkResponse,
  BatchCleanPayload,
  BatchCleanResponse,
} from "../type/storyboard.type";

export const useCleanWatermark = () => {
  return useMutation<CleanWatermarkResponse, Error, CleanWatermarkPayload>({
    mutationFn: (payload) => cleanSceneWatermarkService(payload),
  });
};

export const useBatchCleanWatermarks = () => {
  return useMutation<BatchCleanResponse, Error, BatchCleanPayload>({
    mutationFn: (payload) => batchCleanWatermarksService(payload),
  });
};

