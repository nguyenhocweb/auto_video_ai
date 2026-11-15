"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserRecordingService } from "../service/voice.recordings.service";
import { toast } from "sonner";

export const useDeleteRecording = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserRecordingService(id),
    onSuccess: () => {
      toast.success("Đã xóa bản thu âm thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-audio-recordings"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.detail || "Không thể xóa bản thu âm!";
      toast.error(msg);
    },
  });
};

