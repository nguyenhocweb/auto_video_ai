"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteVoiceProfileService } from "../service/voice.profile.service";
import { extractErrorMessage } from "@/src/core/lib/errorHandle";

export const useDeleteVoiceProfile = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => deleteVoiceProfileService(profileId),
    onSuccess: () => {
      toast.success("Đã xóa hồ sơ giọng nói thành công!");
      queryClient.invalidateQueries({ queryKey: ["voice-profiles"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error, "Lỗi khi xóa hồ sơ giọng nói!"));
    },
  });
};

