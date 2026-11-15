"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cloneVoiceService } from "../service/voice.clone.service";
import { VoiceClonePayload, AudioGenerationResponse } from "../type/voice.type";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useCloneVoice = (onSuccessCallback?: (data: AudioGenerationResponse) => void) => {
  return useMutation({
    mutationFn: (data: VoiceClonePayload) => {
      toast.loading("AI đang phân tích mẫu và tổng hợp giọng nói...", { id: "voice-action" });
      return cloneVoiceService(data);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Tạo giọng nói thành công!", { id: "voice-action" });
      onSuccessCallback?.(res);
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, "Lỗi khi clone giọng nói!"), { id: "voice-action" });
    },
  });
};

