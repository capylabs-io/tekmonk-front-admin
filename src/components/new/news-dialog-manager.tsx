"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ZodSchema } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "../contest/InputField";
import { InputImgUploadContest } from "../contest/InputImgUploadContest";
import { InputTags } from "../contest/InputTags";
import { CommonButton } from "../common/button/CommonButton";
import { quillModules, quillFormats } from "@/contants/config/react-quill";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import DateRangePicker from "@/components/common/date-picker/DatePicker";
import dynamic from "next/dynamic";
import {
  ReqCreateNews,
  ReqDeleteNews,
  ReqUpdateImage,
  ReqUpdateNews,
} from "@/requests/news";

type Props = {
  type: "news" | "event" | "hiring";
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (id: string | null) => void;
  initialData?: any;
  isEditing?: boolean;
  schema: ZodSchema;
};

export const NewsDialogManager = ({
  type,
  isOpen = false,
  onClose,
  initialData,
  isEditing = false,
  schema,
}: Props) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const [isEditingState, setIsEditing] = useState(isEditing);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // State management hooks for standalone mode
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  // Helper function to parse date strings or return current date
  const parseDate = (dateString: string | undefined | null): Date => {
    if (!dateString) return new Date();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      tags: initialData?.tags || "",
      content: initialData?.content || "",
      image: initialData?.image || "",
      salary: initialData?.salary || "",
      startTime: initialData?.startTime || new Date().toISOString(),
      endTime: initialData?.endTime || new Date().toISOString(),
    },
    mode: "onChange",
  });

  const {
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  // Update form when initialData changes
  useEffect(() => {
    console.log("init data", initialData);
    if (initialData) {
      reset({
        title: initialData.title || "",
        tags: initialData.tags || "",
        content: initialData.content || "",
        image: initialData.image || "",
        salary: initialData.salary || "",
        startTime: initialData.startTime || new Date().toISOString(),
        endTime: initialData.endTime || new Date().toISOString(),
      });
    }
  }, [initialData, reset]);

  const handleUpdateNews = async (values: any, status: string) => {
    try {
      // Handle image upload separately if there's a new image
      if (uploadedImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", uploadedImage);
        await ReqUpdateImage(initialData.id.toString(), imageFormData);
      }

      // Update news with JSON data
      const updateData = {
        title: values.title,
        content: values.content,
        startTime: values.startTime,
        endTime: values.endTime,
        type: type,
        status: status,
        tags: values.tags,
        ...(values.salary && { salary: values.salary }),
      };

      await ReqUpdateNews(initialData.id.toString(), updateData);
      success("Xong", "Cập nhật bài viết thành công");

      // Invalidate queries after successful update
      await queryClient.invalidateQueries({ queryKey: [type] });
      await queryClient.invalidateQueries({
        queryKey: [`${type}-detail`, initialData.id],
      });
    } catch (err) {
      throw err;
    }
  };

  const handleCreateNews = async (values: any, status: string) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("startTime", values.startTime);
      formData.append("endTime", values.endTime);
      formData.append("type", type);
      formData.append("status", status);
      formData.append("tags", values.tags);
      if (values.salary) formData.append("salary", values.salary);
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      await ReqCreateNews(formData);
      success("Xong", "Tạo mới bài viết thành công");

      // Invalidate queries after successful creation
      await queryClient.invalidateQueries({ queryKey: [type] });
    } catch (err) {
      throw err;
    }
  };

  const handleNewsSubmit = async (status: string) => {
    try {
      show();
      // Handle check is Valid form here
      const isValid = await methods.trigger();
      if (!isValid) {
        error("Lỗi", "Vui lòng nhập đầy đủ và chính xác các thông tin");
        hide();
        return;
      }
      const values = methods.getValues();

      if (initialData?.id) {
        await handleUpdateNews(values, status);
      } else {
        await handleCreateNews(values, status);
      }
      hide();

      // Only close the dialog after successful submission
      if (onClose) {
        onClose();
      }
    } catch (err) {
      hide();
      error(
        "Lỗi",
        initialData?.id
          ? "Cập nhật không thành công"
          : "Đăng tải không thành công"
      );
    }
  };

  const handleDelete = async () => {
    try {
      show();
      if (initialData?.id) {
        // Check if the news is already in trash
        if (initialData.status === "trash") {
          // Permanently delete the news
          await ReqDeleteNews(initialData.id.toString());
          success("Xong", "Xóa bài viết thành công");
        } else {
          // Move to trash by updating status
          const updateData = {
            ...initialData,
            status: "trash",
          };
          await ReqUpdateNews(initialData.id.toString(), updateData);
          success("Xong", "Đã chuyển bài viết vào thùng rác");
        }

        // Invalidate queries after successful operation
        await queryClient.invalidateQueries({ queryKey: [type] });
        await queryClient.invalidateQueries({
          queryKey: [`${type}-detail`, initialData.id],
        });

        // Only close the dialog after successful deletion
        if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      error(
        "Lỗi",
        initialData?.status === "trash"
          ? "Xóa bài viết không thành công"
          : "Chuyển vào thùng rác không thành công"
      );
    } finally {
      hide();
    }
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
      reset({
        title: "",
        tags: "",
        content: "",
        image: "",
        salary: "",
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      });
      setUploadedImage(null);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleImageUpload = (file: File | null) => {
    console.log("file", file as any);
    setUploadedImage(file);
    // Update the form value for validation
    setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Function to validate date range
  const validateDateRange = (
    startDate: Date | null,
    endDate: Date | null
  ): boolean => {
    if (!startDate || !endDate) return false;
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
    if (startDate > endDate) return false;
    return true;
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[800px] max-h-full bg-gray-00 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {initialData
                ? `Chỉnh sửa ${
                    type === "news"
                      ? "tin tức"
                      : type === "event"
                      ? "sự kiện"
                      : "tuyển dụng"
                  }`
                : `Tạo ${
                    type === "news"
                      ? "tin tức"
                      : type === "event"
                      ? "sự kiện"
                      : "tuyển dụng"
                  } mới`}
            </DialogTitle>
          </DialogHeader>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange }, fieldState }) => (
              <InputField
                value={value}
                onChange={onChange}
                title="Tiêu đề"
                type="text"
                error={fieldState && fieldState.error?.message}
                placeholder="Nhập tiêu đề bài viết"
              />
            )}
          />
          {/* news image */}
          <InputImgUploadContest
            title="Đăng tải ảnh bìa"
            value={uploadedImage}
            onChange={handleImageUpload}
            customClassNames="mt-b"
            error={
              (methods.formState.errors.image?.message as string) ||
              (!uploadedImage &&
              !initialData?.image &&
              methods.formState.isSubmitted
                ? "Vui lòng tải lên ảnh bìa"
                : undefined)
            }
          />

          <Controller
            control={control}
            name="tags"
            render={({ field: { value, onChange }, fieldState }) => (
              <InputTags
                value={value}
                error={fieldState?.error?.message}
                onValueChange={(tagsString: string) => {
                  onChange(tagsString);

                  // Validate tags format if needed
                  if (tagsString && !tagsString.match(/^[^,]+(?:,[^,]+)*$/)) {
                    methods.setError("tags", {
                      type: "manual",
                      message:
                        "Định dạng tags không hợp lệ. Vui lòng sử dụng dấu phẩy để phân tách các tags.",
                    });
                  } else {
                    methods.clearErrors("tags");
                  }
                }}
              />
            )}
          />

          {/* Salary field for hiring type */}
          {type === "hiring" && (
            <Controller
              control={control}
              name="salary"
              render={({ field: { value, onChange }, fieldState }) => (
                <InputField
                  value={value || ""}
                  onChange={onChange}
                  title="Mức lương"
                  type="text"
                  error={fieldState && fieldState.error?.message}
                  placeholder="Nhập mức lương"
                />
              )}
            />
          )}

          {/* Date fields for event and hiring types */}
          {type !== "news" && (
            <div className="flex w-full">
              <div className="text-sm font-medium mb-2 w-1/4">
                Thời gian diễn ra
              </div>
              <div className="w-full">
                <div className="flex items-center w-full">
                  <Controller
                    control={control}
                    name="startTime"
                    render={() => (
                      <DateRangePicker
                        onChange={(dateRange) => {
                          if (!dateRange.startDate || !dateRange.endDate) {
                            error("Lỗi", "Vui lòng chọn đầy đủ thời gian");
                            return;
                          }

                          if (
                            !validateDateRange(
                              dateRange.startDate,
                              dateRange.endDate
                            )
                          ) {
                            error("Lỗi", "Thời gian không hợp lệ");
                            return;
                          }

                          setValue(
                            "startTime",
                            dateRange.startDate.toISOString()
                          );
                          setValue("endTime", dateRange.endDate.toISOString());
                        }}
                        initialDateRange={{
                          startDate: parseDate(getValues("startTime")),
                          endDate: parseDate(getValues("endTime")),
                        }}
                        mode="range"
                        placeholder="DD / MM / YYYY - DD / MM / YYYY"
                      />
                    )}
                  />
                </div>
                {(errors.startTime || errors.endTime) && (
                  <p className="text-sm text-red-500 mt-1">
                    Vui lòng chọn thời gian hợp lệ
                  </p>
                )}
              </div>
            </div>
          )}

          <Controller
            control={control}
            name="content"
            render={({ field: { value, onChange }, fieldState }) => (
              <div className="flex flex-col gap-1">
                <ReactQuill
                  theme="snow"
                  className="w-full rounded-xl bg-grey-50 outline-none !text-[20px] max-h-[200px] transition-all ease-linear"
                  value={value}
                  onChange={onChange}
                  placeholder="Nội dung bài viết"
                  modules={quillModules}
                  formats={quillFormats}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Dialog Footer */}
          <DialogFooter className="mt-10 flex items-center justify-between sm:justify-between">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                handleDialogClose(false);
              }}
              disabled={isSubmitting}
            >
              Thoát
            </CommonButton>
            <div className="flex items-center gap-2">
              {initialData && (
                <CommonButton
                  variant="secondary"
                  className="h-[48px]"
                  childrenClassName="!text-[#AD3C34]"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {initialData?.status === "trash"
                    ? "Xóa vĩnh viễn"
                    : "Chuyển vào thùng rác"}
                </CommonButton>
              )}
              <CommonButton
                variant="secondary"
                className="h-[48px]"
                onClick={() => handleNewsSubmit("draft")}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : initialData
                  ? "Đưa về bản nháp"
                  : "Lưu bản nháp"}
              </CommonButton>
              <CommonButton
                className={`text-white h-[48px] w-[133px]`}
                onClick={() => {
                  setIsEditing(false);
                  handleNewsSubmit("public");
                }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : initialData
                  ? "Cập nhật"
                  : `Đăng ${
                      type === "news"
                        ? "tin tức"
                        : type === "event"
                        ? "sự kiện"
                        : "tuyển dụng"
                    }`}
              </CommonButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
