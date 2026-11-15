import { useMutation } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";
import { DubbingTranscribePayload, DubbingTranscribeResponse } from "../type/dubbing.type";

export const useDubbingTranscribe = () => {
  return useMutation<DubbingTranscribeResponse, Error, DubbingTranscribePayload>({
    mutationFn: (payload: DubbingTranscribePayload) => dubbingService.transcribeVideo(payload),
  });
};

