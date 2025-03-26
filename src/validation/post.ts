import { z } from "zod";


import { PostVerificationType } from "@/types"

// Define the maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Define allowed file types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const profileFormSchema = z.object({
  // Name is required with min and max length
  name: z.string().min(1, "Tiêu đề dự án là bắt buộc").max(100, "Tiêu đề dự án không được vượt quá 100 ký tự"),

  // URL is optional but must be a valid URL if provided
  url: z.string().url("Đường dẫn không hợp lệ").optional().or(z.literal("")),

  // Image is optional but must be valid if provided
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Kích thước tệp không được vượt quá 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Chỉ chấp nhận các định dạng .jpg, .jpeg, .png và .webp",
    )
    .nullable(),
  // Tags is a string (will be processed as comma-separated values)
  tags: z.string().max(200, "Tags không được vượt quá 200 ký tự"),

  // Content is required with min length
  content: z
    .string()
    .min(1, "Nội dung bài viết là bắt buộc")
    .max(10000, "Nội dung bài viết không được vượt quá 10000 ký tự"),
})

// Define the type based on the schema
export type ProfileFormValues = z.infer<typeof profileFormSchema>

// You can extend the schema for the API if needed
export const profileApiSchema = profileFormSchema.extend({
  isVerified: z.nativeEnum(PostVerificationType),
})