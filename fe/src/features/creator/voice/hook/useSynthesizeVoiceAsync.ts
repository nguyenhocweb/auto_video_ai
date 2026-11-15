"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { synthesizeVoiceAsyncService } from "../service/voice.recordings.service";
import { VoiceSynthesizePayload } from "../type/voice.type";
import { AsyncSynthesizeResponse } from "../type/voice.recording.type";
import { toast } from "sonner";

export const useSynthesizeVoiceAsync = (onSuccessCallback?: (data: AsyncSynthesizeResponse) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, voiceName }: { payload: VoiceSynthesizePayload; voiceName?: string }) =>
      synthesizeVoiceAsyncService(payload, voiceName),
    onSuccess: (data) => {
      toast.success(data.message || "Đã đưa vào hàng đợi xử lý ngầm!", {
        description: `Vị trí trong hàng đợi: #${data.queue_position}. Bạn có thể theo dõi tiến độ bên dưới.`,
      });
      queryClient.invalidateQueries({ queryKey: ["my-audio-recordings"] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || "Không thể gửi yêu cầu tạo giọng nói!";
      toast.error(msg);
    },
  });
};

