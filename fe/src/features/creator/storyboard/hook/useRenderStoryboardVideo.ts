import { useMutation } from "@tanstack/react-query";
import { renderStoryboardVideoService } from "../service/storyboard.service";
import {
  RenderStoryboardPayload,
  RenderStoryboardResponse,
} from "../type/storyboard.type";

export const useRenderStoryboardVideo = () => {
  return useMutation<
    RenderStoryboardResponse,
    Error,
    RenderStoryboardPayload
  >({
    mutationFn: (payload: RenderStoryboardPayload) =>
      renderStoryboardVideoService(payload),
  });
};

