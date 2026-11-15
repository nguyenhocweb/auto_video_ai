import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const voiceCloneSchema = z.object({
  text: validator.textPrompt("Vui lòng nhập kịch bản cần đọc"),
  ref_audio_path: validator.string("Vui lòng tải lên file âm thanh mẫu"),
  ref_text: validator.optionalString(1000),
  speed: validator.speed(1.0, 2.0),
  num_step: validator.steps(8, 64),
  guidance_scale: validator.guidanceScale(1.0, 5.0),
});

export type VoiceCloneFormValues = z.infer<typeof voiceCloneSchema>;

