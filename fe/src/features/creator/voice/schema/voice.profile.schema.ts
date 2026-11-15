import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const voiceProfileSchema = z.object({
  profile_name: validator.string("Tên kiểu giọng không được để trống", 2, 50),
  ref_audio_path: validator.string("Vui lòng tải lên file âm thanh mẫu"),
  gender: z.enum(["MALE", "FEMALE", "NEUTRAL"]).default("NEUTRAL"),
  description: validator.optionalString(200),
  ref_text: validator.optionalString(1000),
});

export type VoiceProfileFormValues = z.infer<typeof voiceProfileSchema>;

