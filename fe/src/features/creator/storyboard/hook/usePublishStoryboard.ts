import { useMutation } from "@tanstack/react-query";
import { publishStoryboardVideoService } from "../service/storyboard.publish.service";
import {
  PublishStoryboardPayload,
  PublishStoryboardResponse,
} from "../type/storyboard.type";

export const usePublishStoryboard = () => {
  return useMutation<
    PublishStoryboardResponse,
    Error,
    PublishStoryboardPayload
  >({
    mutationFn: (payload: PublishStoryboardPayload) =>
      publishStoryboardVideoService(payload),
  });
};
