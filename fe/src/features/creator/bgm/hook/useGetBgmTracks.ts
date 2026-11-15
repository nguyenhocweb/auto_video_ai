import { useQuery } from "@tanstack/react-query";
import { getBgmTracks } from "../service/bgm.get.service";
import { BgmListResponse } from "../type/bgm.type";

export const useGetBgmTracks = (mood?: string) => {
  return useQuery<BgmListResponse, Error>({
    queryKey: ["bgm_tracks", mood],
    queryFn: () => getBgmTracks(mood),
    staleTime: 60 * 1000,
  });
};

