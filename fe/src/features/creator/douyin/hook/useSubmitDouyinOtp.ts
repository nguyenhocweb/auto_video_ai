import { useMutation } from "@tanstack/react-query";
import { douyinSessionService } from "../service/douyin-session.service";
import { DouyinSubmitCodePayload } from "../type/douyin-session.type";

export const useSubmitDouyinOtp = () => {
  return useMutation({
    mutationFn: (payload: DouyinSubmitCodePayload) => douyinSessionService.submitCode(payload),
  });
};

