import { useMutation } from "@tanstack/react-query";
import { dubbingService } from "../service/dubbing.service";
import { DubbingTranslatePayload, DubbingTranslateResponse } from "../type/dubbing.type";

export const useDubbingTranslate = () => {
  return useMutation<DubbingTranslateResponse, Error, DubbingTranslatePayload>({
    mutationFn: (payload: DubbingTranslatePayload) => dubbingService.translateSegments(payload),
  });
};

