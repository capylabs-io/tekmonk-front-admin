/** This code will include the dialog for managing the news (event, hiring)
 *
 *
 */
"use client";

import { eventSchema, hiringSchema } from "@/validation/news";
import { newsSchema } from "@/validation/news";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ZodSchema } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { InputField } from "../contest/InputField";
import { InputImgUploadContest } from "../contest/InputImgUploadContest";
import { InputTags } from "../contest/InputTags";
import { CommonButton } from "../common/button/CommonButton";
import { TNews } from "@/types/common-types";
import { quillModules, quillFormats } from "@/contants/config/react-quill";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  ReqCreateNews,
  ReqUpdateNews,
  ReqUpdateImage,
  ReqDeleteNews,
} from "@/requests/news";
import DateRangePicker from "@/components/common/date-picker/DatePicker";

// Define a form data type that includes all possible fields from all schemas
type NewsFormData = {
  title: string;
  tags: string;
  content: string;
  thumbnail?: string;
  uploadImage?: File | null;
  salary?: string;
  startTime?: Date;
  endTime?: Date;
};

// Define the TNews type with proper date fields if not already defined elsewhere
type TNewsWithDates = TNews & {
  startTime?: string;
  endTime?: string;
  salary?: string;
  uploadedImage?: File | null;
};

type Props = {
  type: "news" | "event" | "hiring";
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: TNewsWithDates, status: "draft" | "public") => void;
  onDelete?: (id: string | null) => void;
  initialData?: TNewsWithDates | null;
  isEditing?: boolean;
  // New props for standalone mode
  standalone?: boolean;
  queryKey?: string[];
};

export const NewsDialogManager = ({
  type,
  isOpen = false,
  onClose,
  onSubmit,
  onDelete,
  initialData = null,
  isEditing = false,
  standalone = false,
  queryKey = ["news"],
}: Props) => {
  const [schema, setSchema] = useState<ZodSchema>(newsSchema);
  const [toggleNewsDialog, setToggleNewsDialog] = useState(isOpen);
  const [currentNews, setCurrentNews] = useState<TNewsWithDates | null>(
    initialData
  );
  const [isEditingState, setIsEditing] = useState(isEditing);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  // State management hooks for standalone mode
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const queryClient = useQueryClient();

  // Helper function to convert string dates to Date objects
  const convertToDate = (
    dateValue: string | Date | undefined
  ): Date | undefined => {
    if (!dateValue) return undefined;
    try {
      return dateValue instanceof Date ? dateValue : new Date(dateValue);
    } catch (error) {
      console.error("Invalid date format:", dateValue);
      return undefined;
    }
  };

  // Update schema based on type and reset form with appropriate defaults
  useEffect(() => {
    let selectedSchema;
    switch (type) {
      case "news":
        selectedSchema = newsSchema;
        break;
      case "event":
        selectedSchema = eventSchema;
        break;
      case "hiring":
        selectedSchema = hiringSchema;
        break;
      default:
        selectedSchema = newsSchema;
        break;
    }

    setSchema(selectedSchema);

    // Clear any previous validation errors when schema changes
    methods.clearErrors();
  }, [type]);

  // Update form when initialData or type changes
  useEffect(() => {
    if (initialData) {
      // Convert string dates to Date objects for the form
      const startDate = convertToDate(initialData.startTime);
      const endDate = convertToDate(initialData.endTime);

      reset({
        title: initialData.title || "",
        tags: initialData.tags || "",
        content: initialData.content || "",
        thumbnail: initialData.thumbnail || "",
        salary: initialData.salary || "",
        startTime: startDate || undefined,
        endTime: endDate || undefined,
        uploadImage: null,
      });
    } else {
      // For new items, initialize with default values
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      reset({
        title: "",
        tags: "",
        content: "",
        thumbnail: "",
        salary: "",
        startTime: type === "event" || type === "hiring" ? today : undefined,
        endTime: type === "event" || type === "hiring" ? tomorrow : undefined,
        uploadImage: null,
      });
    }
  }, [initialData, type]);

  // Update dialog state when isOpen prop changes
  useEffect(() => {
    setToggleNewsDialog(isOpen);

    // When dialog opens, update current news and editing state
    if (isOpen) {
      setCurrentNews(initialData);
      setIsEditing(isEditing);

      // Reset form with initialData when dialog opens
      if (initialData) {
        reset({
          title: initialData.title || "",
          tags: initialData.tags || "",
          content: initialData.content || "",
          thumbnail: initialData.thumbnail || "",
          salary: initialData.salary || "",
          startTime: convertToDate(initialData.startTime),
          endTime: convertToDate(initialData.endTime),
          uploadImage: null,
        });
      }
    }
  }, [isOpen, initialData, isEditing]);

  // Update editing state and current news when initialData changes
  useEffect(() => {
    if (initialData) {
      setCurrentNews(initialData);
      setIsEditing(isEditing);
    }
  }, [initialData, isEditing]);

  const methods = useForm<NewsFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit", // Change to onSubmit to only show errors when submitting
    defaultValues: {
      title: initialData?.title || "",
      tags: initialData?.tags || "",
      content: initialData?.content || "",
      thumbnail: initialData?.thumbnail || "",
      salary: initialData?.salary || "",
      startTime: convertToDate(initialData?.startTime),
      endTime: convertToDate(initialData?.endTime),
      uploadImage: null,
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

  // Watch required fields based on type
  const title = watch("title");
  const content = watch("content");
  const salary = watch("salary");

  // Determine if form is valid for submission based on type
  const isFormValidForSubmission = () => {
    const hasTitle = !!title && title.trim().length > 0;
    const hasContent = !!content && content.trim().length > 0;
    const hasThumbnail = !!initialData?.thumbnail || !!uploadedImage;

    if (type === "hiring") {
      const hasSalary = !!salary && salary.trim().length > 0;
      return hasTitle && hasContent && hasSalary && hasThumbnail;
    }

    return hasTitle && hasContent && hasThumbnail;
  };

  // Handle image upload
  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    setValue("uploadImage", file);

    // Clear any existing image validation errors when a new image is uploaded
    if (file) {
      // Manually clear the error for the image field if it exists
      const currentErrors = methods.formState.errors;
      if (currentErrors.uploadImage || currentErrors.thumbnail) {
        methods.clearErrors(["uploadImage", "thumbnail"]);
      }
    }
  };

  // Format date for API submission
  const formatDateForSubmission = (date?: Date): string => {
    if (!date) return "";
    return date.toISOString();
  };

  // Handle standalone submission to server
  const handleStandaloneSubmit = async (
    data: TNewsWithDates,
    status: "draft" | "public"
  ) => {
    try {
      show();

      // Extract uploadedImage from data
      const { uploadedImage, ...newsData } = data;

      // Create FormData for submission if needed
      const formData = new FormData();

      // Always include the type in the submission data
      const submissionData = {
        ...newsData,
        type: type,
        status: status,
      };

      // For drafts, we allow incomplete data
      if (status === "draft") {
        // Ensure we have at least a title for drafts
        if (!submissionData.title) {
          submissionData.title = `Bản nháp ${new Date().toLocaleString(
            "vi-VN"
          )}`;
        }
      }

      // Handle create or update based on whether we're editing
      if (data.id) {
        // Update existing content
        await ReqUpdateNews(data.id.toString(), submissionData);

        // If there's a new image, update it separately
        if (uploadedImage) {
          const imageFormData = new FormData();
          imageFormData.append("image", uploadedImage);
          await ReqUpdateImage(data.id.toString(), imageFormData);
        }

        success(
          "Thành công",
          status === "draft"
            ? `Đã lưu bản nháp ${
                type === "news"
                  ? "tin tức"
                  : type === "event"
                  ? "sự kiện"
                  : "tuyển dụng"
              }`
            : `Cập nhật ${
                type === "news"
                  ? "tin tức"
                  : type === "event"
                  ? "sự kiện"
                  : "tuyển dụng"
              } thành công`
        );
      } else {
        // Create new content
        // If there's an image, use FormData for the entire submission
        if (uploadedImage) {
          // Add all fields to FormData
          Object.entries(submissionData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              // Convert objects to JSON strings
              if (typeof value === "object" && !(value instanceof File)) {
                formData.append(key, JSON.stringify(value));
              } else {
                formData.append(key, value as string);
              }
            }
          });

          // Add the image
          formData.append("image", uploadedImage);

          // Send the request with FormData
          await ReqCreateNews(formData);
        } else {
          // No image, send as JSON
          await ReqCreateNews(submissionData);
        }

        success(
          "Thành công",
          status === "draft"
            ? `Đã lưu bản nháp ${
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
              } thành công`
        );
      }

      // Refresh the data
      queryClient.invalidateQueries({ queryKey });

      // Reset form if not editing
      if (!isEditingState) {
        reset();
        setUploadedImage(null);
      }

      // Close dialog
      setToggleNewsDialog(false);
    } catch (err) {
      console.error(`Error submitting ${type}:`, err);
      error(
        "Không thành công",
        status === "draft"
          ? "Không thể lưu bản nháp"
          : data.id
          ? `Cập nhật ${
              type === "news"
                ? "tin tức"
                : type === "event"
                ? "sự kiện"
                : "tuyển dụng"
            } thất bại`
          : `Tạo ${
              type === "news"
                ? "tin tức"
                : type === "event"
                ? "sự kiện"
                : "tuyển dụng"
            } thất bại`
      );
    } finally {
      hide();
    }
  };

  // Handle standalone delete/trash
  const handleStandaloneDelete = async (id: string | null) => {
    if (!id && !currentNews) return;

    try {
      show();

      const newsId = id || currentNews?.id?.toString();
      if (!newsId) return;

      // Check if it's already in trash
      const isInTrash = currentNews?.status === "trash";

      if (isInTrash) {
        // Permanently delete
        await ReqDeleteNews(newsId);
        success(
          "Thành công",
          `Đã xóa ${
            type === "news"
              ? "tin tức"
              : type === "event"
              ? "sự kiện"
              : "tuyển dụng"
          }`
        );
      } else {
        // Move to trash
        const dataUpdate = {
          status: "trash",
        };
        await ReqUpdateNews(newsId, dataUpdate);
        success(
          "Thành công",
          `Đã chuyển ${
            type === "news"
              ? "tin tức"
              : type === "event"
              ? "sự kiện"
              : "tuyển dụng"
          } vào thùng rác`
        );
      }

      // Refresh the data
      queryClient.invalidateQueries({ queryKey });
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      error(
        "Không thành công",
        `Không thể xóa ${
          type === "news"
            ? "tin tức"
            : type === "event"
            ? "sự kiện"
            : "tuyển dụng"
        }`
      );
    } finally {
      hide();
      setToggleNewsDialog(false);
      setIsEditing(false);
      setCurrentNews(null);
      reset();
      setUploadedImage(null);
    }
  };

  // Handle news submission with validation first
  const handleNewsSubmit = (status: "draft" | "public") => {
    // For draft, we don't need strict validation
    if (status === "draft") {
      // Just submit with current values
      handleSubmit((formData) => {
        submitContent(formData, status);
      })();
    } else {
      // For public, trigger form validation through handleSubmit
      // This will automatically validate all fields and show validation errors

      // Manually check for image before form validation
      if (!uploadedImage && !initialData?.thumbnail) {
        methods.setError("uploadImage", {
          type: "manual",
          message: "Vui lòng tải lên ảnh bìa",
        });
      }

      handleSubmit(
        // Success callback - only runs if validation passes
        (formData) => {
          submitContent(formData, status);
        },
        // Error callback - runs if validation fails
        (errors) => {
          // Validation failed, but we don't show a snackbar
          // The form will automatically show validation errors on the fields
          console.log("Validation errors:", errors);

          // Scroll to the first error if needed
          const firstErrorField = Object.keys(errors)[0];
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          } else if (errors.uploadImage) {
            // Special handling for image upload field which doesn't have a name attribute
            const imageElement = document.querySelector(".mt-b");
            if (imageElement) {
              imageElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        }
      )();
    }
  };

  // Separate function to handle the actual submission
  const submitContent = (
    formData: NewsFormData,
    status: "draft" | "public"
  ) => {
    // For drafts, ensure we have at least a title
    if (status === "draft" && !formData.title) {
      formData.title = `Bản nháp ${new Date().toLocaleString("vi-VN")}`;
    }

    // Validate image for public submissions
    if (status === "public" && !uploadedImage && !initialData?.thumbnail) {
      // Set a manual error for the image
      methods.setError("uploadImage", {
        type: "manual",
        message: "Vui lòng tải lên ảnh bìa",
      });

      // Scroll to the image upload field
      const imageElement = document.querySelector(".mt-b");
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return; // Stop submission
    }

    // Create base news object with common fields
    const baseNews = {
      title: formData.title,
      tags: formData.tags,
      content: formData.content,
      type: type,
      status: status,
    } as TNewsWithDates;

    // Add type-specific fields
    if (type === "hiring" || type === "event") {
      // Ensure we have valid dates
      if (formData.startTime && formData.endTime) {
        // Convert Date objects to strings for API submission
        baseNews.startTime = formatDateForSubmission(formData.startTime);
        baseNews.endTime = formatDateForSubmission(formData.endTime);
      } else if (formData.startTime) {
        // If only start time is provided, use it for both
        baseNews.startTime = formatDateForSubmission(formData.startTime);
        baseNews.endTime = formatDateForSubmission(formData.startTime);
      } else {
        // Default to current date if no dates provided
        const now = new Date();
        baseNews.startTime = formatDateForSubmission(now);
        baseNews.endTime = formatDateForSubmission(now);
      }

      // Add salary for hiring type
      if (type === "hiring") {
        baseNews.salary = formData.salary || "";
      }
    }

    // Handle image upload
    if (uploadedImage) {
      baseNews.uploadedImage = uploadedImage;
    }

    // If editing, merge with existing data but preserve the ID
    const finalNews =
      isEditingState && currentNews
        ? {
            ...baseNews,
            id: currentNews.id, // Ensure ID is preserved for updates
          }
        : baseNews;

    // Handle submission based on mode
    if (standalone) {
      // Handle submission internally
      handleStandaloneSubmit(finalNews, status);
    } else if (onSubmit) {
      // Call parent's onSubmit handler
      onSubmit(finalNews, status);

      // Reset form if not editing
      if (!isEditingState) {
        reset();
        setUploadedImage(null);
      }

      // Close dialog
      setToggleNewsDialog(false);
    }
  };

  // Handle moving to trash
  const handleMoveToTrash = (id: string | null) => {
    if (standalone) {
      // Handle deletion internally
      handleStandaloneDelete(id);
    } else if (onDelete) {
      // Call parent's onDelete handler
      onDelete(id);
      setToggleNewsDialog(false);
      setIsEditing(false);
      reset();
      setUploadedImage(null);
    }
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
      setCurrentNews(null);
      reset({
        title: "",
        tags: "",
        content: "",
        thumbnail: "",
        salary: "",
        startTime: undefined,
        endTime: undefined,
        uploadImage: null,
      });
      setUploadedImage(null);
      setToggleNewsDialog(false);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={toggleNewsDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[800px] max-h-full bg-gray-00 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditingState
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
              methods.formState.errors.uploadImage?.message ||
              (!uploadedImage &&
              !initialData?.thumbnail &&
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
          {(type === "event" || type === "hiring") && (
            <div className="flex w-full">
              <div className="text-sm font-medium mb-2 w-1/4">
                Thời gian diễn ra
              </div>
              <div className="flex items-center w-full">
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field }) => (
                    <DateRangePicker
                      onChange={(dateRange) => {
                        if (dateRange.startDate) {
                          setValue("startTime", dateRange.startDate);
                        }
                        if (dateRange.endDate) {
                          setValue("endTime", dateRange.endDate);
                        }
                      }}
                      initialDateRange={{
                        startDate: getValues("startTime") || new Date(),
                        endDate: getValues("endTime") || new Date(),
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
          )}

          <Controller
            control={control}
            name="content"
            render={({ field: { value, onChange }, fieldState }) => (
              <div className="flex flex-col gap-1">
                <ReactQuill
                  theme="snow"
                  className="w-full rounded-xl bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear"
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
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setToggleNewsDialog(false);
                setIsEditing(false);
                reset();
                setUploadedImage(null);
                if (onClose) {
                  onClose();
                }
              }}
              disabled={isSubmitting}
            >
              Thoát
            </CommonButton>
            <div className="flex items-center gap-2">
              {isEditingState && (
                <CommonButton
                  variant="secondary"
                  className="h-[48px]"
                  childrenClassName="!text-[#AD3C34]"
                  onClick={() =>
                    handleMoveToTrash(currentNews?.id?.toString() || null)
                  }
                  disabled={isSubmitting}
                >
                  Xoá
                </CommonButton>
              )}
              <CommonButton
                variant="secondary"
                className="h-[48px]"
                onClick={() => handleNewsSubmit("draft")}
                disabled={isSubmitting}
              >
                {isSubmitting && status === "draft"
                  ? "Đang lưu..."
                  : isEditingState
                  ? "Đưa về bản nháp"
                  : "Lưu bản nháp"}
              </CommonButton>
              <CommonButton
                className={`text-white h-[48px] w-[133px] ${
                  !isFormValidForSubmission() && !isSubmitting
                    ? "opacity-50"
                    : ""
                }`}
                onClick={() => {
                  setIsEditing(false);
                  handleNewsSubmit("public");
                }}
                disabled={isSubmitting}
              >
                {isSubmitting && status === "public"
                  ? "Đang xử lý..."
                  : isEditingState
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
