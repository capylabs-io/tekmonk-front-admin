import { z } from "zod";
// Define the maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Define allowed file types
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg",
];
export const achievementFormSchema = z.object({
  // Name is required with min and max length
  title: z
    .string()
    .min(1, "Tiêu đề dự án là bắt buộc")
    .max(100, "Tiêu đề dự án không được vượt quá 100 ký tự"),

  // URL is optional but must be a valid URL if provided
  url: z.string().url("Đường dẫn không hợp lệ").optional().or(z.literal("")),

  // Image is optional but must be valid if provided
  imageUrl: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Kích thước tệp không được vượt quá 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Chỉ chấp nhận các định dạng .jpg, .jpeg, .png và .webp"
    )
    .nullable(),

  // Type is required
  type: z.string().min(1, "Loại Thành tựu là bắt buộc"),

  // Description is required with min length
  description: z
    .string()
    .min(1, "Nội dung bài viết là bắt buộc")
    .max(10000, "Nội dung bài viết không được vượt quá 10000 ký tự"),

  // Reward is required
  reward: z
    .string()
    .min(1, "Phần thưởng là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Điểm thưởng phải là số"),

  // Points is required and must be a number
  points: z
    .string()
    .min(1, "Điểm thưởng là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Điểm thưởng phải là số"),
});
