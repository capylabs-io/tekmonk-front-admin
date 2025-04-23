"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postMission, updateMission } from "@/requests/mission";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { CommonButton } from "../common/button/CommonButton";
import { Input } from "../common/Input";
import { InputFileUpdload } from "../common/InputFileUpload";
import { Mission } from "@/types/mission";
import { ReqGetClasses } from "@/requests/class";
import { ActionTypeSelector } from "../common/ActionTypeSelector";
import { ActionTypeMap } from "@/contants/config/action-type";

const missionFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  imageUrl: z.any().nullable(),
  type: z.string().min(1, "Vui lòng chọn loại nhiệm vụ"),
  actionType: z.string().min(1, "Vui lòng chọn loại hành động"),
  reward: z.string().min(1, "Vui lòng nhập phần thưởng"),
  points: z.string().min(1, "Vui lòng nhập điểm thưởng"),
  class: z.number().optional(),
});

type MissionFormData = z.infer<typeof missionFormSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MissionFormData) => void;
  classId: number;
  mission?: Mission;
};

export const CreateMissionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  classId,
  mission,
}: Props) => {
  // UseStore
  const [showSuccess, showError] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  const methods = useForm<MissionFormData>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: null,
      type: "Manual",
      actionType: "",
      reward: "",
      points: "",
      class: classId,
    },
    mode: "onChange",
  });

  // Update form when mission data changes or when opening in edit mode
  useEffect(() => {
    if (mission && open) {
      methods.reset({
        title: mission.title || "",
        description: mission.description || "",
        imageUrl: null,
        type: "Manual",
        actionType: mission.actionType || "",
        reward: mission.reward?.toString() || "",
        points: mission.points?.toString() || "",
        class: mission.class?.id || classId,
      });
    } else if (!mission && open) {
      // Reset form for create mode
      methods.reset({
        title: "",
        description: "",
        imageUrl: null,
        type: "Manual",
        actionType: "",
        reward: "",
        points: "",
        class: classId,
      });
    }
  }, [mission, open, methods, classId]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) {
      setValue("imageUrl", file);
    }
  };

  const handleActionTypeChange = (value: string) => {
    setValue("actionType", value);
  };

  const createMissionMutation = useMutation({
    mutationFn: async (data: MissionFormData) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", "Manual");
      formData.append("actionType", data.actionType);
      formData.append("reward", data.reward);
      formData.append("points", data.points);
      formData.append("class", data.class?.toString() || "");

      // Handle image upload
      if (data.imageUrl instanceof File) {
        formData.append("image", data.imageUrl);
      } else if (mission?.imageUrl && typeof data.imageUrl === "string") {
        // If editing and no new image, keep the existing image URL
        formData.append("imageUrl", mission.imageUrl);
      }

      if (mission) {
        return await updateMission(mission.id, formData);
      }
      return await postMission(formData);
    },
    onSuccess: () => {
      showSuccess(
        "Thành công",
        mission ? "Cập nhật nhiệm vụ thành công" : "Tạo nhiệm vụ thành công"
      );
      handleDialogChange(false);
      onSubmit(getValues());
    },
    onError: (error) => {
      console.error("Error details:", error);
      showError(
        "Lỗi",
        mission ? "Cập nhật nhiệm vụ thất bại" : "Tạo nhiệm vụ thất bại"
      );
    },
  });

  const onSubmitForm = async (data: MissionFormData) => {
    try {
      if (
        !data.title ||
        !data.description ||
        !data.actionType ||
        !data.reward ||
        !data.points ||
        (!mission && !data.imageUrl) // Only require image for new missions
      ) {
        showError("Lỗi", "Vui lòng điền đầy đủ thông tin");
        return;
      }

      // Force Manual type for missions edited through this dialog
      data.type = "Manual";
      createMissionMutation.mutate(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Lỗi", "Có lỗi xảy ra khi tạo nhiệm vụ");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center w-screen bg-black/80"
      onClick={() => handleDialogChange(false)}
    >
      <div
        className="w-[680px] bg-white rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4">
          <div className="!text-HeadingSm !font-semibold text-gray-95">
            {mission ? "Cập nhật nhiệm vụ" : "Tạo nhiệm vụ mới"}
          </div>
        </div>

        <FormProvider {...methods}>
          <form className="space-y-4 p-4">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">
                    Tiêu đề <span className="text-red-500">*</span>
                  </div>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Nhập tiêu đề"
                        customClassNames="flex-1"
                        error={errors.title?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">
                    Loại hành động <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="actionType"
                      control={control}
                      render={({ field }) => (
                        <ActionTypeSelector
                          data={ActionTypeMap}
                          value={field.value}
                          onChange={handleActionTypeChange}
                          error={errors.actionType?.message}
                          placeholder="Chọn loại hành động"
                          searchPlaceholder="Tìm kiếm loại hành động..."
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm gap-2">
                <div className="w-[160px] text-SubheadMd">
                  Hình ảnh {!mission && <span className="text-red-500">*</span>}
                </div>
                <InputFileUpdload
                  value={getValues("imageUrl")}
                  onChange={handleImageUpload}
                  customClassNames="flex-1"
                  customInputClassNames="text-sm"
                  error={errors.imageUrl?.message as string}
                  contentImageUpload={
                    <>
                      <div className="rounded-full p-5 w-max mx-auto flex items-center justify-center relative bg-gray-20">
                        <ImagePlus
                          size={20}
                          className="absolute text-gray-50"
                        />
                      </div>
                      <div className="mt-2 text-gray-70 text-SubheadSm">
                        {mission ? "Cập nhật ảnh" : "Tải lên ảnh/video"}
                      </div>
                      <p className="text-gray-70 !text-xs font-normal">
                        Hoặc kéo và thả
                      </p>
                    </>
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">
                    Phần thưởng <span className="text-red-500">*</span>
                  </div>
                  <Controller
                    name="reward"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Nhập phần thưởng"
                        customClassNames="flex-1"
                        error={errors.reward?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">
                    Điểm thưởng <span className="text-red-500">*</span>
                  </div>
                  <Controller
                    name="points"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Nhập điểm thưởng"
                        customClassNames="flex-1"
                        error={errors.points?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">
                    Mô tả <span className="text-red-500">*</span>
                  </div>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Nhập mô tả nhiệm vụ"
                        customClassNames="flex-1"
                        error={errors.description?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>

        <DialogFooter className="px-4">
          <div className="flex justify-between items-center mt-6 border-t pt-4 w-full">
            <CommonButton
              variant="secondary"
              className="h-11"
              onClick={() => handleDialogChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </CommonButton>
            <CommonButton
              className="h-11 w-[139px]"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmitForm)}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : mission
                ? "Cập nhật"
                : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </div>
    </div>
  );
};
