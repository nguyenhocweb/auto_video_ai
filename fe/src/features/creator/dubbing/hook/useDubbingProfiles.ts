import { useQuery } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";

export const useDubbingProfiles = () => {
  return useQuery({
    queryKey: ["user_voice_profiles_for_dubbing"],
    queryFn: () => dubbingService.getUserVoiceProfiles(),
    staleTime: 60 * 1000,
  });
};

