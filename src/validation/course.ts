import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên khóa học")
    .max(100, "Tên khóa học không được vượt quá 100 ký tự"),
  numberSession: z
    .number()
    .min(1, "Vui lòng nhập số buổi học")
    .max(100, "Số buổi học không được vượt quá 100"),
  description: z
    .string()
    .min(1, "Vui lòng nhập mô tả khóa học")
    .refine((value) => {
      const strippedValue = value.replace(/<[^>]*>/g, "").trim();
      return strippedValue.length > 0;
    }, "Vui lòng nhập nội dung mô tả khóa học"),
  isDisabled: z.boolean().optional(),
  type: z
    .string()
    .min(1, "Vui lòng nhập loại khóa học")
    .max(50, "Loại khóa học không được vượt quá 50 ký tự"),
});
