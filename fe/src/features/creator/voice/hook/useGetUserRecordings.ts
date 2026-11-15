"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserRecordingsService } from "../service/voice.recordings.service";
import { AudioRecordingsResponse } from "../type/voice.recording.type";

export const useGetUserRecordings = (page: number = 1, pageSize: number = 10) => {
  return useQuery<AudioRecordingsResponse>({
    queryKey: ["my-audio-recordings", page, pageSize],
    queryFn: () => getUserRecordingsService(page, pageSize),
    staleTime: 60 * 1000,
    refetchInterval: 5000, // Poll fallback every 5s if socket reconnects
  });
};

