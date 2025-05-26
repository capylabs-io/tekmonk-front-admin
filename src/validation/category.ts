import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên danh mục")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự"),
  description: z
    .string()
    .min(1, "Vui lòng nhập mô tả danh mục")
    .refine((value) => {
      const strippedValue = value.replace(/<[^>]*>/g, "").trim();
      return strippedValue.length > 0;
    }, "Vui lòng nhập nội dung mô tả danh mục"),
  code: z
    .string()
    .min(1, "Vui lòng nhập mã danh mục")
    .max(50, "Mã danh mục không được vượt quá 50 ký tự"),
});
