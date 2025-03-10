"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Input } from "@/components/common/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { quillFormats } from "@/contants/config/react-quill";
import { quillModules } from "@/contants/config/react-quill";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { courseSchema } from "@/validation/course";
import { ReqCreateCourse } from "@/requests/course";
import { useSnackbarStore } from "@/store/SnackbarStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormValues) => void;
};

type CourseFormValues = z.infer<typeof courseSchema>;

// Form Fields Component
const CourseFormFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Course Name Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-[160px] text-SubheadMd">Tên khoá học</div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                type="text"
                placeholder="Nhập tên khóa học"
                customClassNames="flex-1"
                error={errors.name?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-[160px] text-SubheadMd">Số buổi học</div>
          <Controller
            name="numberSession"
            control={control}
            render={({ field: { value, onChange, ...restField } }) => (
              <Input
                {...restField}
                id="numberSession"
                type="number"
                value={value?.toString() || ""}
                onChange={(e) => onChange(Number(e) || 0)}
                placeholder="Nhập số buổi học"
                customClassNames="flex-1"
                error={errors.numberSession?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <ReactQuill
                    theme="snow"
                    className="w-full rounded-xl bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear"
                    placeholder="Nhập mô tả khóa học"
                    modules={quillModules}
                    formats={quillFormats}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-BodySm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Category Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-[160px] text-SubheadMd">Loại</div>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="type"
                type="text"
                placeholder="Nhập loại khóa học"
                customClassNames="flex-1"
                error={errors.type?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export const CreateCourseDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            Tạo khóa học mới
          </DialogTitle>
          <div className="text-BodyMd text-gray-60 mb-4">
            Vui lòng điền đầy đủ thông tin khóa học
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4 p-4">
            <CourseFormFields />

            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <div className="flex gap-2">
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
                  {isSubmitting ? "Đang tạo..." : "Tạo"}
                </CommonButton>
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
