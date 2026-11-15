"use client";

import { useMutation } from "@tanstack/react-query";
import { checkCopyrightByFile, checkCopyrightByTrackId } from "../service/bgm.copyright.service";
import { CopyrightCheckResult } from "../type/bgm.type";

export const useCheckCopyrightFile = () => {
  return useMutation<CopyrightCheckResult, Error, File>({
    mutationFn: (file: File) => checkCopyrightByFile(file),
  });
};

export const useCheckCopyrightTrack = () => {
  return useMutation<CopyrightCheckResult, Error, string>({
    mutationFn: (trackId: string) => checkCopyrightByTrackId(trackId),
  });
};

