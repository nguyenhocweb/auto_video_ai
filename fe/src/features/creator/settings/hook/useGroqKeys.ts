import { useQuery } from "@tanstack/react-query";
import { groqKeyService } from "../service/groq-key.service";

export const useGroqKeys = () => {
  return useQuery({
    queryKey: ["groq-api-keys"],
    queryFn: () => groqKeyService.getKeys(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

