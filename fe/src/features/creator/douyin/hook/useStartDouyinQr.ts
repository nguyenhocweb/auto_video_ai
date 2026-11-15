import { useMutation } from "@tanstack/react-query";
import { douyinSessionService } from "../service/douyin-session.service";
import { DouyinQrStartResponse } from "../type/douyin-session.type";

export const useStartDouyinQr = () => {
  return useMutation<DouyinQrStartResponse, Error>({
    mutationFn: () => douyinSessionService.startQr(),
  });
};

