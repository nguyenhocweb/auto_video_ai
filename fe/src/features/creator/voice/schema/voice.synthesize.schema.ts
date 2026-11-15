import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const voiceSynthesizeSchema = z.object({
  profile_id_or_path: validator.string("Vui lòng chọn một hồ sơ giọng nói"),
  text: validator.textPrompt("Vui lòng nhập nội dung kịch bản cần đọc"),
  speed: validator.speed(1.0, 2.0),
  num_step: validator.steps(8, 64),
});

export type VoiceSynthesizeFormValues = z.infer<typeof voiceSynthesizeSchema>;

