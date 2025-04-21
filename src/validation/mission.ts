import { z } from "zod";

export const misionFormSchema = z.object({
  // Name is required with min and max length
  title: z
    .string()
    .min(1, "Tiêu đề nhiệm vụ là bắt buộc")
    .max(100, "Tiêu đề nhiệm vụ không được vượt quá 100 ký tự"),
  description: z.string().min(1, "Mô tả nhiệm vụ là bắt buộc"),
  // URL is optional but must be a valid URL if provided
  // Image is optional but must be valid if provided
  type: z.string().min(1, "Loại Thành tựu là bắt buộc"),
  reward: z.string().optional(),
  requiredQuantity: z.string().optional(),
  points: z.string().optional(),
  // Content is required with min length
});
