"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { designVoiceService } from "../service/voice.design.service";
import { VoiceDesignPayload, AudioGenerationResponse } from "../type/voice.type";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useDesignVoice = (onSuccessCallback?: (data: AudioGenerationResponse) => void) => {
  return useMutation({
    mutationFn: (data: VoiceDesignPayload) => {
      toast.loading("AI đang thiết kế và tổng hợp chất giọng mới...", { id: "voice-action" });
      return designVoiceService(data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Thiết kế giọng nói thành công!", { id: "voice-action" });
      onSuccessCallback?.(res);
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, "Lỗi khi thiết kế giọng nói!"), { id: "voice-action" });
    },
  });
};

