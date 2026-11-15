import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBgmTrack } from "../service/bgm.delete.service";

export const useDeleteBgm = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => deleteBgmTrack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bgm_tracks"] });
    },
  });
};

