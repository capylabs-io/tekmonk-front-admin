import { AchievementType } from "@/types/achievement";
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
  actionType: z.string().optional(),
  requiredQuantity: z.coerce
    .number({
      invalid_type_error: "Số lượng yêu cầu phải là số",
    })
    .optional(),

  // Description is required with min length
  description: z
    .string()
    .min(1, "Nội dung bài viết là bắt buộc")
    .max(10000, "Nội dung bài viết không được vượt quá 10000 ký tự"),

  // Reward is required
  reward: z.coerce
    .number({ invalid_type_error: "Phần thưởng phải là số" })
    .min(1, "Phần thưởng phải lớn hơn 0")
    .max(50, "Phần thưởng không được vượt quá 50"),
  points: z.coerce
    .number({ invalid_type_error: "Điểm thưởng phải là số" })
    .min(1, "Điểm thưởng phải lớn hơn 0")
    .max(50, "Điểm thưởng không được vượt quá 50"),
});

export type AchievementFormData = z.infer<typeof achievementFormSchema>;

export const defaultAchievementValue: AchievementFormData = {
  title: "",
  imageUrl: null,
  type: AchievementType.MANUAL,
  description: "",
  reward: 1,
  points: 1,
  actionType: "",
  requiredQuantity: 1,
};
