import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string({ required_error: "Tên bài viết không được để trống" })
    .min(1, "Tên bài viết phải có ít nhất 1 ký tự"),
  tags: z.string().optional(),
  image: z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Ảnh bìa là bắt buộc",
    }),
  content: z.string().min(1, "Mô tả không được để trống"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const newsSchema = z.object({
  title: z
    .string({ required_error: "Tên bài viết không được để trống" })
    .min(1, "Tên bài viết phải có ít nhất 1 ký tự"),
  tags: z.string().optional(),
  image: z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Ảnh bìa là bắt buộc",
    }),
  content: z.string().min(1, "Mô tả không được để trống"),
});

export const hiringSchema = z.object({
  title: z
    .string({ required_error: "Tên bài viết không được để trống" })
    .min(1, "Tên bài viết phải có ít nhất 1 ký tự"),
  tags: z.string().optional(),
  isDealt: z.boolean().optional(),
  maxSalary: z.string().optional(),
  minSalary: z.string().optional(),
  image: z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Ảnh bìa là bắt buộc",
    }),
  content: z.string().min(1, "Mô tả không được để trống"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});
