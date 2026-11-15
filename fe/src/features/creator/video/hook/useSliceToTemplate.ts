import { useMutation } from "@tanstack/react-query";
import { sliceVideoToTemplateService } from "../service/video.slicer.service";
import {
  SliceVideoToTemplatePayload,
  SliceVideoToTemplateResponse,
} from "../type/slicer.type";

export const useSliceToTemplate = () => {
  return useMutation<
    SliceVideoToTemplateResponse,
    Error,
    SliceVideoToTemplatePayload
  >({
    mutationFn: (payload: SliceVideoToTemplatePayload) =>
      sliceVideoToTemplateService(payload),
  });
};

