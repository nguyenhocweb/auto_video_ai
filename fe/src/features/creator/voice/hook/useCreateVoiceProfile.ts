"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVoiceProfileService } from "../service/voice.profile.service";
import { VoiceProfileCreatePayload } from "../type/voice.type";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useCreateVoiceProfile = (onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VoiceProfileCreatePayload) => {
      toast.loading("AI đang huấn luyện & trích xuất vector embedding kiểu giọng...", { id: "voice-train" });
      return createVoiceProfileService(data);
    },
    onSuccess: (data) => {
      toast.success("Huấn luyện & lưu kiểu giọng vào Database thành công!", { id: "voice-train" });
      queryClient.invalidateQueries({ queryKey: ["voice-profiles"] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, "Lỗi khi huấn luyện giọng nói!"), { id: "voice-train" });
    },
  });
};

