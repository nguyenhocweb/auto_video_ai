import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const voiceDesignSchema = z.object({
  text: validator.textPrompt("Vui lòng nhập kịch bản cần đọc"),
  instruct: validator.string(
    "Vui lòng nhập mô tả phong cách giọng (vd: 'female, young adult, warm tone, vietnamese accent')"
  ),
  speed: validator.speed(1.0, 2.0),
  num_step: validator.steps(8, 64),
  guidance_scale: validator.guidanceScale(1.0, 5.0),
});

export type VoiceDesignFormValues = z.infer<typeof voiceDesignSchema>;

