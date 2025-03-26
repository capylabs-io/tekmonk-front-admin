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
import { quillFormats } from "@/contants/config/react-quill";
import { quillModules } from "@/contants/config/react-quill";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { InputImgUploadContest } from "../contest/InputImgUploadContest";
import { achievementFormSchema } from "@/validation/achievement";
import { CommonSelect } from "../common/CommonSelect";
import { InputFileUpdload } from "../common/InputFileUpload";
import { Plus } from "lucide-react";

export type AchievementFormData = {
  title: string;
  icon: File | null;
  type: string;
  content: string
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AchievementFormData) => void;
};


export const CreateMissionModal = ({ open, onOpenChange, onSubmit }: Props) => {
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const methods = useForm<AchievementFormData>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      icon: null,
      type: "",
      content: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    trigger, // Add trigger to manually validate fields
    formState: { errors, isValid, isDirty, isSubmitting },
  } = methods;
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };
  const handleSelectChange = (value: string) => {
    setValue('type', value)
  }
  const handleImageUpload = (file: File | null) => {
    if (file) setValue("icon", file as any)
  }
  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            Tạo nhiệm vụ mới
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4 p-4 h-[500px] overflow-y-auto hide-scrollbar">
            <div className="space-y-6">
              {/* Course Name Field */}
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="min-w-[160px] text-SubheadMd">Icon</div>
                  <InputFileUpdload
                    value={getValues("icon")}
                    onChange={handleImageUpload}
                    customInputClassNames="text-sm !max-h-[50px] !items-start"
                    contentImageUpload={
                      <>
                        <p className="flex items-center gap-2 text-base  !font-light text-gray-70 w-full justify-start"><Plus size={16}></Plus>Thêm ảnh</p>
                      </>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="min-w-[160px] text-SubheadMd">Loại hành động</div>
                  <CommonSelect className="w-full" selectClassName="rounded-xl h-[50px] bg-grey-50 border border-grey-300" placeholder="Chọn loại thành tích" options={[]} value={getValues('type')} onChange={handleSelectChange} />
                </div>
              </div>
              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-2">
                          <ReactQuill
                            theme="snow"
                            className="w-full rounded-xl border-grey-300 bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear overflow-y-auto"
                            placeholder="Nhập mô tả khóa học"
                            modules={quillModules}
                            formats={quillFormats}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {errors.content && (
                            <p className="text-red-500 text-BodySm">
                              {errors.content.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Category Field */}

            </div>
          </form>
        </FormProvider>
        <DialogFooter>
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
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
