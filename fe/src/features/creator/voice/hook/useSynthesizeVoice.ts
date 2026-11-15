"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { synthesizeVoiceService } from "../service/voice.synthesize.service";
import { VoiceSynthesizePayload, AudioGenerationResponse } from "../type/voice.type";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useSynthesizeVoice = (
  onSuccessCallback?: (data: AudioGenerationResponse) => void
) => {
  return useMutation({
    mutationFn: (data: VoiceSynthesizePayload) => {
      toast.loading("AI đang đọc thuyết minh kịch bản bằng hồ sơ giọng...", { id: "voice-action" });
      return synthesizeVoiceService(data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Đọc thuyết minh kịch bản thành công!", { id: "voice-action" });
      onSuccessCallback?.(res);
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, "Lỗi khi đọc thuyết minh kịch bản!"), { id: "voice-action" });
    },
  });
};

