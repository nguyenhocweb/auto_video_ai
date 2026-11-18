import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tiktokService } from "../service/tiktok.service";

export const useDisconnectTikTokChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      tiktokService.disconnectChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiktok-channels"] });
    },
  });
};
