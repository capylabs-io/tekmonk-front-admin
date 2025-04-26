"use client";
import { DialogFooter } from "@/components/ui/dialog";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { CommonButton } from "../common/button/CommonButton";
import { Input } from "../common/Input";
import { InputFileUpdload } from "../common/InputFileUpload";
import { Mission, MissionType } from "@/types/mission";
import { ComboboxSelector } from "../common/combo-box-selecter";
import { ActionType, ActionTypeMap } from "@/contants/config/action-type";
import {
  defaultMissionValue,
  MissionFormData,
  missionFormSchema,
} from "@/validation/mission";
import { useLoadingStore } from "@/store/LoadingStore";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MissionFormData) => void;
  classId: number;
  mission?: Mission;
};

const explainEverySession =
  "Tạo nhiệm vụ thuộc hệ thống, hệ thống sẽ tự động tính điểm cho học viên khi hoàn thành nhiệm vụ";

const explainManual =
  "Tạo nhiệm vụ tạo thủ công, dùng để tạo nhiệm vụ cho học viên thực hiện một lần";

export const CreateMissionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  classId,
  mission,
}: Props) => {
  // UseStore
  const [showError] = useSnackbarStore((state) => [state.error]);

  const methods = useForm<MissionFormData>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: defaultMissionValue,
    mode: "onChange",
  });
  // Update form when mission data changes or when opening in edit mode
  useEffect(() => {
    if (mission && open) {
      methods.reset({
        title: mission.title || "",
        description: mission.description || "",
        imageUrl: null,
        type:
          mission.type === MissionType.EVERY_SESSION
            ? MissionType.EVERY_SESSION
            : MissionType.MANUAL,
        actionType: mission.actionType || ActionType.Attendance,
        reward: mission.reward,
        points: mission.points,
        requiredQuantity: mission.requiredQuantity,
        class: mission.class?.id || classId,
      });
    } else if (!mission && open) {
      methods.reset({
        ...defaultMissionValue,
        class: classId,
      });
    }
  }, [mission, open, methods, classId]);

  const {
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const missionType = watch("type");

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Only reset when closing to avoid losing entered data when re-opening
      reset({
        ...defaultMissionValue,
        class: classId,
      });
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

  const handleTypeChange = (value: string) => {
    if (value === MissionType.MANUAL || value === MissionType.EVERY_SESSION) {
      setValue("type", value);
      if (value === MissionType.MANUAL) {
        setValue("requiredQuantity", undefined);
      }
    }
  };

  const onSubmitForm = async (data: MissionFormData) => {
    try {
      if (!data.title || !data.description || (!mission && !data.imageUrl)) {
        showError("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Lỗi", "Có lỗi xảy ra khi tạo nhiệm vụ");
    } finally {
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
            {mission ? "Cập nhật nhiệm vụ" : "Tạo nhiệm vụ mới"}
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
                        type="text"
                        placeholder="Nhập tiêu đề"
                        customClassNames="flex-1"
                        error={errors.title?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {!classId && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-[160px] text-SubheadMd mt-3">
                      Loại nhiệm vụ <span className="text-red-500">*</span>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-start">
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <ComboboxSelector
                            data={[
                              {
                                value: MissionType.MANUAL,
                                label: "Tạo thủ công",
                              },
                              {
                                value: MissionType.EVERY_SESSION,
                                label: "Thuộc hệ thống",
                              },
                            ]}
                            value={field.value}
                            onChange={handleTypeChange}
                            error={errors.type?.message}
                            placeholder="Chọn loại nhiệm vụ"
                            searchPlaceholder="Tìm kiếm loại..."
                          />
                        )}
                      />
                      <div className="text-gray-70 text-SubheadSm">
                        {missionType === MissionType.EVERY_SESSION
                          ? explainEverySession
                          : explainManual}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {watch("type") === MissionType.EVERY_SESSION && (
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

              {missionType === MissionType.EVERY_SESSION && (
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

              <div className="flex justify-center items-center text-sm gap-2">
                <div className="w-[160px] text-SubheadMd">
                  Hình ảnh {!mission && <span className="text-red-500">*</span>}
                </div>
                <InputFileUpdload
                  value={getValues("imageUrl")}
                  onChange={handleImageUpload}
                  customClassNames="flex-1"
                  customInputClassNames="text-sm"
                  error={errors.imageUrl?.message as string}
                  onRemove={() => setValue("imageUrl", null)}
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
                        value={field.value?.toString() ?? ""}
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
                        value={field.value?.toString() ?? ""}
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

        <DialogFooter className="px-4 flex-shrink-0">
          <div className="flex justify-between items-center p-4 w-full">
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
              onClick={() => onSubmitForm(getValues())}
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
