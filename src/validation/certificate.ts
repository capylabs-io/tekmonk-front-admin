import { z } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Define allowed file types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
export const certificateFormSchema = z.object({
  name: z.string().min(1, "Tiêu đề nhiệm vụ là bắt buộc").max(100, "Tiêu đề nhiệm vụ không được vượt quá 100 ký tự"),
  description: z.string().min(1, "Mô tả nhiệm vụ là bắt buộc"),
  imgUrl: z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Kích thước tệp không được vượt quá 5MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Chỉ chấp nhận các định dạng .jpg, .jpeg, .png và .webp",
  )
  .nullable(),
})
