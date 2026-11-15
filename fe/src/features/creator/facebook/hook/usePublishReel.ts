import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facebookService } from "../service/facebook.service";
import { PublishReelPayload, PublishReelResponse } from "../type/facebook.type";

export const usePublishReel = () => {
  const queryClient = useQueryClient();

  const publishFromPathMutation = useMutation<
    PublishReelResponse,
    Error,
    PublishReelPayload
  >({
    mutationFn: (payload: PublishReelPayload) => facebookService.publishReel(payload),
    onSuccess: (_, variables) => {
      if (variables.page_id) {
        queryClient.invalidateQueries({
          queryKey: ["facebook_page_videos", variables.page_id],
        });
      }
    },
  });

  const uploadAndPublishMutation = useMutation<
    PublishReelResponse,
    Error,
    FormData
  >({
    mutationFn: (formData: FormData) => facebookService.uploadAndPublishReel(formData),
    onSuccess: (_, formData) => {
      const pageId = formData.get("page_id") as string | null;
      if (pageId) {
        queryClient.invalidateQueries({
          queryKey: ["facebook_page_videos", pageId],
        });
      }
    },
  });

  return {
    publishFromPath: publishFromPathMutation,
    uploadAndPublish: uploadAndPublishMutation,
    isPublishing:
      publishFromPathMutation.isPending || uploadAndPublishMutation.isPending,
  };
};

