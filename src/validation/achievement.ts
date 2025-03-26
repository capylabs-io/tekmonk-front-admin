import { z } from "zod";
// Define the maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Define allowed file types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg"]
export const achievementFormSchema = z.object({
  // Name is required with min and max length
  title: z.string().min(1, "Tiêu đề dự án là bắt buộc").max(100, "Tiêu đề dự án không được vượt quá 100 ký tự"),

  // URL is optional but must be a valid URL if provided
  url: z.string().url("Đường dẫn không hợp lệ").optional().or(z.literal("")),

  // Image is optional but must be valid if provided
  icon: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Kích thước tệp không được vượt quá 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Chỉ chấp nhận các định dạng .jpg, .jpeg, .png và .webp",
    )
    .nullable(),
  // Tags is a string (will be processed as comma-separated values)
  type: z.string().min(1, "Loại thành tích là bắt buộc"),

  // Content is required with min length
  content: z
    .string()
    .min(1, "Nội dung bài viết là bắt buộc")
    .max(10000, "Nội dung bài viết không được vượt quá 10000 ký tự"),
})
