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
import { useEffect, useState } from "react";
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
import { AddItemDialog } from "./add-item-dialog";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { getMission } from "@/requests/mission";
import { Mission } from "@/types/mission";
import { Switch } from "@/components/ui/switch";
import { categorySchema } from "@/validation/category";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[600px] min-h-[200px] bg-gray-100 rounded-xl animate-pulse" />
  ),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormValues) => void;
  categoryToEdit?: CategoryFormValues | null;
  mode?: "create" | "edit";
};


type CategoryFormValues = z.infer<typeof categorySchema> & {
  missions?: Mission[];
};

// Form Fields Component
const CategoryFormFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CategoryFormValues>();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formContent = (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
      {/* Category Name Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-[160px] text-SubheadMd text-gray-60">
            Tên danh mục
          </div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                type="text"
                placeholder="Nhập tên danh mục"
                customClassNames="flex-1"
                error={errors.name?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  {isMounted && (
                    <ReactQuill
                      theme="snow"
                      className="w-full max-w-[600px] rounded-xl bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear overflow-auto"
                      placeholder="Nhập mô tả danh mục"
                      modules={quillModules}
                      formats={quillFormats}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
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
          <div className="w-[160px] text-SubheadMd text-gray-60">Mã danh mục</div>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="type"
                type="text"
                placeholder="Nhập mã danh mục"
                customClassNames="flex-1"
                error={errors.code?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );

  return formContent;
};

export const CreateCategoryDialog = ({
  open,
  onOpenChange,
  onSubmit,
  categoryToEdit,
  mode = "create",
}: Props) => {
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [isClient, setIsClient] = useState(false);

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      code: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize from courseToEdit when in edit mode
  useEffect(() => {
    if (categoryToEdit && mode === "edit") {
      reset(categoryToEdit);
    } else {
      // Reset form and clear missions in create mode
      reset({
        name: "",
        description: "",
        code: "",
      });
    }
  }, [categoryToEdit, mode, reset]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const handleSubmitForm = (data: CategoryFormValues) => {
    // Include selected missions in the form data
    const formData = {
      ...data,
    };
    onSubmit(formData);
  };

  const dialogContent = (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="w-[680px] bg-white">
          <DialogHeader className="px-4">
            <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
              {mode === "create" ? "Tạo danh mục mới" : "Chỉnh sửa danh mục"}
            </DialogTitle>
            <div className="text-BodyMd text-gray-60 mb-4">
              Vui lòng điền đầy đủ thông tin danh mục
            </div>
          </DialogHeader>

          <FormProvider {...methods}>
            <form className="space-y-4 p-4">
              <CategoryFormFields />

              <div className="flex justify-between items-center mt-6 border-t pt-4">
                <CommonButton
                  variant="secondary"
                  className="h-11"
                  onClick={() => handleDialogChange(false)}
                  disabled={isSubmitting}
                >
                  Thoát
                </CommonButton>
                <CommonButton
                  className="h-11 w-[139px]"
                  disabled={isSubmitting}
                  onClick={handleSubmit(handleSubmitForm)}
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : mode === "create"
                      ? "Tạo"
                      : "Cập nhật"}
                </CommonButton>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );

  if (!isClient) {
    return null;
  }

  return dialogContent;
};
