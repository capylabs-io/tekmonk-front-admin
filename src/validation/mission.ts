import { ActionType } from "@/contants/config/action-type";
import { z } from "zod";

export const missionFormSchema = z
  .object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
    imageUrl: z.any().nullable(),
    type: z.enum(["Manual", "System"], {
      required_error: "Vui lòng chọn loại nhiệm vụ",
    }),
    actionType: z.string().min(1, "Vui lòng chọn loại hành động"),
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
  })
  .refine(
    (data) => {
      if (data.type === "System") {
        return data.requiredQuantity !== undefined && data.requiredQuantity > 0;
      }
      return true;
    },
    {
      message: "Vui lòng nhập số lượng yêu cầu khi loại nhiệm vụ là System",
      path: ["requiredQuantity"],
    }
  );

export type MissionFormData = z.infer<typeof missionFormSchema>;

export const defaultMissionValue: MissionFormData = {
  title: "",
  description: "",
  imageUrl: null,
  type: "Manual",
  actionType: ActionType.Attendance,
  reward: 0,
  points: 0,
  requiredQuantity: 0,
  class: 0,
};
