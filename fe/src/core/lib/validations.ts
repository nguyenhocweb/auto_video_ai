import { z } from "zod";

export const validator = {
  string: (message = "Trường này không được để trống", min = 1, max = 255) =>
    z
      .string({ required_error: message })
      .trim()
      .min(min, message)
      .max(max, `Độ dài tối đa ${max} ký tự`),

  optionalString: (max = 500) =>
    z.string().trim().max(max, `Độ dài tối đa ${max} ký tự`).optional().or(z.literal("")),

  textPrompt: (message = "Nội dung văn bản không được để trống", min = 2, max = 2000) =>
    z
      .string({ required_error: message })
      .trim()
      .min(min, message)
      .max(max, `Nội dung tối đa ${max} ký tự`),

  speed: (min = 1.0, max = 2.0) =>
    z.number().min(min, `Tốc độ tối thiểu ${min}x`).max(max, `Tốc độ tối đa ${max}x`).default(1.0),

  steps: (min = 8, max = 64) =>
    z.number().int().min(min, `Số bước tối thiểu ${min}`).max(max, `Số bước tối đa ${max}`).default(32),

  guidanceScale: (min = 1.0, max = 5.0) =>
    z.number().min(min).max(max).default(2.0),
};

