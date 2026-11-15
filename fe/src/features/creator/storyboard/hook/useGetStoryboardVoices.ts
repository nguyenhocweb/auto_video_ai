"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoryboardVoicesService } from "../service/storyboard.voices.service";

export const useGetStoryboardVoices = () => {
  return useQuery({
    queryKey: ["storyboard-voices"],
    queryFn: () => getStoryboardVoicesService(),
    staleTime: 60 * 1000,
  });
};

