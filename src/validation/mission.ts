import { ActionType } from "@/contants/config/action-type";
import { MissionType } from "@/types/mission";
import { z } from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Define allowed file types
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg",
];
export const missionFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
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
  type: z.enum([MissionType.EVERY_SESSION, MissionType.MANUAL], {
    required_error: "Vui lòng chọn loại nhiệm vụ",
  }),
  actionType: z.string().optional(),
  reward: z.coerce
    .number({ invalid_type_error: "Phần thưởng phải là số" })
    .min(1, "Phần thưởng phải lớn hơn 0")
    .max(50, "Phần thưởng không được vượt quá 50"),
  points: z.coerce
    .number({ invalid_type_error: "Điểm thưởng phải là số" })
    .min(1, "Điểm thưởng phải lớn hơn 0")
    .max(50, "Điểm thưởng không được vượt quá 50"),
  requiredQuantity: z.coerce
    .number({
      invalid_type_error: "Số lượng yêu cầu phải là số",
    })
    .min(1, "Số lượng yêu cầu phải lớn hơn 0")
    .optional(),
  class: z.number().optional(),
});

export type MissionFormData = z.infer<typeof missionFormSchema>;

export const defaultMissionValue: MissionFormData = {
  title: "",
  description: "",
  imageUrl: null,
  type: MissionType.MANUAL,
  actionType: "",
  reward: 1,
  points: 1,
  requiredQuantity: 1,
  class: 0,
};
