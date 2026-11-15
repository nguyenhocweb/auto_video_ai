import { useMutation } from "@tanstack/react-query";
import { generateScriptService } from "../service/storyboard.service";
import {
  ScriptGeneratePayload,
  ScriptGenerateResponse,
} from "../type/storyboard.type";

export const useGenerateScript = () => {
  return useMutation<ScriptGenerateResponse, Error, ScriptGeneratePayload>({
    mutationFn: (payload: ScriptGeneratePayload) => generateScriptService(payload),
  });
};

