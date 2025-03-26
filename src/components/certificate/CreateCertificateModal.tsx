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
  type: string;
  icon: File | null;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AchievementFormData) => void;
};


export const CreateCertificateModal = ({ open, onOpenChange, onSubmit }: Props) => {
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
  const handleImageUpload = (file: File | null) => {
    if (file) setValue("icon", file as any)
  }
  const handleSelectChange = (value: string) => {
    setValue('type', value)
  }
  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            Tạo chứng chỉ mới
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4 p-4 h-max overflow-y-auto hide-scrollbar">
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
                  <div className="min-w-[160px] text-SubheadMd">Form chứng chỉ</div>
                  <CommonSelect className="w-full" selectClassName="rounded-xl h-[50px] bg-grey-50 border border-grey-300" placeholder="Chọn loại thành tích" options={[]} value={getValues('type')} onChange={handleSelectChange} />
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
