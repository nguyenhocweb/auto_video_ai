import { useQuery } from "@tanstack/react-query";
import { geminiKeyService } from "../service/gemini-key.service";

export const useGeminiKeys = () => {
  return useQuery({
    queryKey: ["gemini-api-keys"],
    queryFn: () => geminiKeyService.getKeys(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

