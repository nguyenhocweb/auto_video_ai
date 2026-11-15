import { useMutation } from "@tanstack/react-query";
import { douyinSessionService } from "../service/douyin-session.service";
import { DouyinSendCodePayload } from "../type/douyin-session.type";

export const useResendDouyinOtp = () => {
  return useMutation({
    mutationFn: (payload: DouyinSendCodePayload) => douyinSessionService.resendCode(payload),
  });
};

