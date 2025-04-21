"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Input } from "@/components/common/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { achievementFormSchema } from "@/validation/achievement";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { InputFileUpdload } from "../common/InputFileUpload";
import { useEffect } from "react";
import { Mission } from "@/types/mission";

export type AchievementFormData = {
  title: string;
  imageUrl: File | null;
  type: string;
  description: string;
  reward: string;
  points: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AchievementFormData) => void;
  isLoading?: boolean;
  achievement?: Mission;
};

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

  const methods = useForm<AchievementFormData>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      imageUrl: null,
      type: "Manual",
      description: "",
      reward: "",
      points: "",
    },
  });

  useEffect(() => {
    if (achievement && open) {
      methods.reset({
        title: achievement.title || "",
        imageUrl: null,
        type: "Manual",
        description: achievement.description || "",
        reward: achievement.reward?.toString() || "",
        points: achievement.points?.toString() || "",
      });
    } else if (!achievement && open) {
      methods.reset({
        title: "",
        imageUrl: null,
        type: "Manual",
        description: "",
        reward: "",
        points: "",
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
    trigger,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = methods;

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) setValue("imageUrl", file as any);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            {achievement ? "Cập nhật Thành tựu" : "Tạo Thành tựu mới"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4 p-4 h-[500px] overflow-y-auto hide-scrollbar">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">Tiêu đề</div>
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

              <div className="flex justify-between text-sm">
                <span className="w-[160px] text-SubheadMd">
                  Hình ảnh <span className="text-red-500">*</span>
                </span>
                <InputFileUpdload
                  value={getValues("imageUrl")}
                  onChange={handleImageUpload}
                  customClassNames="max-w-[424px]"
                  customInputClassNames="text-sm flex-1"
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
                        Tải lên ảnh/video
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
                  <div className="w-[160px] text-SubheadMd">Phần thưởng</div>
                  <Controller
                    name="reward"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="reward"
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
                  <div className="w-[160px] text-SubheadMd">Điểm thưởng</div>
                  <Controller
                    name="points"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="points"
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
        <DialogFooter>
          <div className="flex justify-between items-center mt-6 border-t pt-4 w-full">
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
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting || isLoading
                ? "Đang xử lý..."
                : achievement
                ? "Cập nhật"
                : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
