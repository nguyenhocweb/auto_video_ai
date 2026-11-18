import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tiktokService } from "../service/tiktok.service";
import { PublishTikTokRequest } from "../type/tiktok.type";

export const usePublishTikTok = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PublishTikTokRequest) => tiktokService.publishVideo(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiktok-channels"] });
    },
  });
};
