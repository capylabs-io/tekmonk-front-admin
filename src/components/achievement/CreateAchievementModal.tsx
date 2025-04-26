"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Input } from "@/components/common/Input";
import { DialogFooter } from "@/components/ui/dialog";
import { useSnackbarStore } from "@/store/SnackbarStore";
import {
  AchievementFormData,
  achievementFormSchema,
  defaultAchievementValue,
} from "@/validation/achievement";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { InputFileUpdload } from "../common/InputFileUpload";
import { useEffect } from "react";
import { TAchievement, AchievementType } from "@/types/achievement";
import { cn } from "@/lib/utils";
import { ComboboxSelector } from "@/components/common/combo-box-selecter";
import { useLoadingStore } from "@/store/LoadingStore";
import { ActionTypeMap } from "@/contants/config/action-type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AchievementFormData) => void;
  isLoading?: boolean;
  achievement?: TAchievement;
};

const explainEverySession =
  "Tạo thành tựu thuộc hệ thống, hệ thống sẽ tự động tính điểm cho học viên khi hoàn thành thành tựu";

const explainManual =
  "Tạo thành tựu thủ công, dùng để tạo thành tựu cho học viên thực hiện một lần";

export const CreateAchievementDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  achievement,
}: Props) => {
  const [showSuccess, showError] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);

  const methods = useForm<AchievementFormData>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: defaultAchievementValue,
  });

  useEffect(() => {
    if (achievement && open) {
      methods.reset({
        title: achievement.title || "",
        imageUrl: null,
        type:
          achievement.type === AchievementType.EVERY_SESSION
            ? AchievementType.EVERY_SESSION
            : AchievementType.MANUAL,
        description: achievement.description || "",
        reward: achievement.reward || 0,
        points: achievement.points || 0,
        actionType: achievement.actionType || "",
        requiredQuantity: achievement.requiredQuantity || 0,
      });
    } else if (!achievement && open) {
      methods.reset({
        title: "",
        imageUrl: null,
        type: AchievementType.MANUAL,
        description: "",
        reward: 0,
        points: 0,
        actionType: "",
        requiredQuantity: 0,
      });
    }
  }, [achievement, open, methods]);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const achievementType = watch("type");

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) setValue("imageUrl", file as any);
  };

  const handleTypeChange = (value: string) => {
    if (
      value === AchievementType.MANUAL ||
      value === AchievementType.EVERY_SESSION
    ) {
      setValue("type", value);
    }
  };

  const handleActionTypeChange = (value: string) => {
    setValue("actionType", value);
  };

  const handleFormSubmit = async (data: AchievementFormData) => {
    try {
      show();
      if (
        !data.title ||
        !data.description ||
        (!achievement && !data.imageUrl)
      ) {
        showError("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Lỗi", "Có lỗi xảy ra khi tạo thành tựu");
    } finally {
      hide();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center w-screen bg-black/80 transition-opacity duration-200 p-4",
        open ? "opacity-100 z-50" : "opacity-0 pointer-events-none -z-10"
      )}
      onClick={() => handleDialogChange(false)}
    >
      <div
        className="w-full max-w-[680px] max-h-[90vh] bg-white rounded-xl transform transition-transform duration-200 flex flex-col"
        style={{
          transform: open ? "scale(1)" : "scale(0.95)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-4 flex-shrink-0 border-b">
          <div className="!text-HeadingSm !font-semibold text-gray-95">
            {achievement ? "Cập nhật Thành tựu" : "Tạo Thành tựu mới"}
          </div>
        </div>

        <FormProvider {...methods}>
          <form className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-6 p-4 overflow-y-auto">
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
                        id="name"
                        type="text"
                        placeholder="Nhập dữ liệu"
                        customClassNames="flex-1"
                        error={errors.title?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-[160px] text-SubheadMd mt-3">
                    Loại thành tựu <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1 flex flex-col items-start justify-start">
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <ComboboxSelector
                          data={[
                            {
                              value: AchievementType.MANUAL,
                              label: "Tạo thủ công",
                            },
                            {
                              value: AchievementType.EVERY_SESSION,
                              label: "Thuộc hệ thống",
                            },
                          ]}
                          value={field.value}
                          onChange={handleTypeChange}
                          error={errors.type?.message}
                          placeholder="Chọn loại thành tựu"
                          searchPlaceholder="Tìm kiếm loại..."
                        />
                      )}
                    />
                    <div className="text-gray-70 text-SubheadSm">
                      {achievementType === AchievementType.EVERY_SESSION
                        ? explainEverySession
                        : explainManual}
                    </div>
                  </div>
                </div>
              </div>
              {watch("type") === AchievementType.EVERY_SESSION && (
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
                          <ComboboxSelector
                            data={ActionTypeMap}
                            value={field.value || ""}
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
              )}

              {achievementType === AchievementType.EVERY_SESSION && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-[160px] text-SubheadMd">
                      Số lượng yêu cầu <span className="text-red-500">*</span>
                    </div>
                    <Controller
                      name="requiredQuantity"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value?.toString() ?? ""}
                          type="number"
                          placeholder="Nhập số lượng yêu cầu"
                          customClassNames="flex-1"
                          error={errors.requiredQuantity?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm gap-2">
                <div className="w-[160px] text-SubheadMd">
                  Hình ảnh <span className="text-red-500">*</span>
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
                        {achievement ? "Cập nhật ảnh" : "Tải lên ảnh/video"}
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
                    render={({ field: { value, onChange, ...restField } }) => (
                      <Input
                        {...restField}
                        id="reward"
                        type="number"
                        placeholder="Nhập phần thưởng"
                        value={value?.toString() || ""}
                        onChange={(e) => onChange(Number(e) || 0)}
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
                    render={({ field: { value, onChange, ...restField } }) => (
                      <Input
                        {...restField}
                        id="points"
                        type="number"
                        placeholder="Nhập điểm thưởng"
                        value={value?.toString() || ""}
                        onChange={(e) => onChange(Number(e) || 0)}
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
                        placeholder="Nhập mô tả thành tựu"
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

        <DialogFooter className="px-4 flex-shrink-0">
          <div className="flex justify-between items-center p-4 w-full">
            <CommonButton
              variant="secondary"
              className="h-11"
              onClick={() => handleDialogChange(false)}
              disabled={isSubmitting || isLoading}
            >
              Hủy
            </CommonButton>
            <CommonButton
              className="h-11 w-[139px]"
              disabled={isSubmitting || isLoading}
              onClick={handleSubmit(handleFormSubmit)}
            >
              {isSubmitting || isLoading
                ? "Đang xử lý..."
                : achievement
                ? "Cập nhật"
                : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </div>
    </div>
  );
};
