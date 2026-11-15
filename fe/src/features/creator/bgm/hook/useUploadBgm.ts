import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadBgmTrack } from "../service/bgm.upload.service";
import { BgmTrack, BgmUploadPayload } from "../type/bgm.type";

export const useUploadBgm = () => {
  const queryClient = useQueryClient();

  return useMutation<BgmTrack, Error, BgmUploadPayload>({
    mutationFn: (payload: BgmUploadPayload) => uploadBgmTrack(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bgm_tracks"] });
    },
  });
};

