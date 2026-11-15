"use client";

import { useQuery } from "@tanstack/react-query";
import { getVoiceProfilesService } from "../service/voice.profile.service";

export const useGetVoiceProfiles = () => {
  return useQuery({
    queryKey: ["voice-profiles"],
    queryFn: () => getVoiceProfilesService(),
    staleTime: 60 * 1000, // 1 phút chống gọi API dư thừa
  });
};

