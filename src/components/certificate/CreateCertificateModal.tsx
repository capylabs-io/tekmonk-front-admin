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
import { useEffect, useMemo, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { CommonSelect } from "../common/CommonSelect";
import { InputFileUpdload } from "../common/InputFileUpload";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ReqGetCourses } from "@/requests/course";
import { Switch } from "../ui/switch";
import CertificateEditor, { CertificateField } from "./CustomCertificateEditor";
import React from "react";

export type CertificateFormData = {
  name?: string;
  description?: string;
  imgUrl?: File | null;
  // type?: string,
  course?: string;
  isHasValidation?: boolean;
  // issuer_type?: string,
  // certificate_form?: string
  certificateFields?: string;
  certificatePdfConfigId?: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CertificateFormData) => void;
  onChooseCertificateForm?: () => void;
  isEditMode?: boolean;
  editingCertificate?: any;
};

export const CreateCertificateModal = ({
  open,
  onOpenChange,
  onSubmit,
  onChooseCertificateForm,
  isEditMode = false,
  editingCertificate = null,
}: Props) => {
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Trạng thái theo dõi việc đã chọn form chứng chỉ chưa
  const [certificateFormSelected, setCertificateFormSelected] = useState(false);

  // Thêm state để lưu trữ thông tin từ CustomCertificateEditor
  const [certificateFields, setCertificateFields] = useState<
    CertificateField[]
  >([]);
  const [certificateBackground, setCertificateBackground] =
    useState<File | null>(null);

  // Refs để tránh vòng lặp vô hạn
  const fieldsUpdateRef = useRef<string | null>(null);
  const backgroundUpdateRef = useRef<boolean>(false);

  // Phương thức để xử lý khi component cha truyền dữ liệu form từ CustomCertificateEditor
  const updateFormWithCertificateData = (
    fields: CertificateField[],
    background: File | null
  ) => {
    // Chỉ cập nhật fields khi thực sự thay đổi
    const fieldsStr = JSON.stringify(fields);
    if (fieldsUpdateRef.current !== fieldsStr) {
      fieldsUpdateRef.current = fieldsStr;
      setCertificateFields(fields);
      // Lưu certificateFields dưới dạng JSON string
      setValue("certificateFields" as any, JSON.stringify(fields));
    }

    // Chỉ cập nhật background khi thực sự thay đổi
    if (background && !backgroundUpdateRef.current) {
      backgroundUpdateRef.current = true;
      setCertificateBackground(background);

      // Lưu thông tin vào form
      setValue("imgUrl", background as any);
      setUploadedImage(background);
    }

    // Cập nhật trạng thái form
    setCertificateFormSelected(true);
  };

  // Thông báo đến component cha rằng muốn chọn form
  const handleChooseCertificateForm = () => {
    if (onChooseCertificateForm) {
      onChooseCertificateForm();
    }
  };

  const methods = useForm({
    // resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      name: "",
      imgUrl: null,
      // type: "",
      description: "",
      course: "",
      isHasValidation: false,
      certificateFields: "",
      certificatePdfConfigId: undefined,
    },
  });
  const { data: courses } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          populate: "*",
        });
        return await ReqGetCourses(queryString);
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin khóa học");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted, // Only run query when component is mounted
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
  const course = watch("course");
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  // Điền dữ liệu từ editingCertificate vào form khi ở chế độ chỉnh sửa
  useEffect(() => {
    if (isEditMode && editingCertificate) {
      // Điền các trường cơ bản
      setValue("name", editingCertificate.name || "");
      setValue("description", editingCertificate.description || "");
      setValue("isHasValidation", editingCertificate.isHasValidation || false);

      // Điền trường course nếu có
      if (editingCertificate.course?.id) {
        setValue("course", editingCertificate.course.id.toString());
      }

      // Đánh dấu đã chọn form chứng chỉ nếu có certificatePdfConfig
      if (editingCertificate.certificatePdfConfig) {
        setCertificateFormSelected(true);
      }

      // Lưu ID của certificatePdfConfig nếu có
      if (editingCertificate.certificatePdfConfig?.id) {
        setValue(
          "certificatePdfConfigId",
          editingCertificate.certificatePdfConfig.id
        );
      }
    }
  }, [isEditMode, editingCertificate, setValue]);

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
      setCertificateFormSelected(false);
      // Reset các ref
      fieldsUpdateRef.current = null;
      backgroundUpdateRef.current = false;
      // Reset các state
      setCertificateFields([]);
      setCertificateBackground(null);
    }
    onOpenChange(open);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) setValue("imgUrl", file as any);
  };

  const handleSelectCourseChange = (value: string) => {
    const selectedCourse = courses?.data.find(
      (course) => course.id === parseInt(value)
    );
    if (selectedCourse) {
      setValue("course", selectedCourse.id.toString());
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Công khai phương thức để component cha có thể gọi
  // Sử dụng useImperativeHandle nếu dùng với forwardRef
  React.useEffect(() => {
    // Tạo một hàm tham chiếu mới để tránh vòng lặp vô hạn
    const publishedMethod = {
      updateFormWithCertificateData: (
        fields: CertificateField[],
        background: File | null
      ) => {
        updateFormWithCertificateData(fields, background);
      },
    };

    // @ts-ignore - Chấp nhận lỗi TypeScript để công khai phương thức
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.currentCertificateModal = publishedMethod;
    }

    return () => {
      // @ts-ignore
      if (typeof window !== "undefined") {
        // @ts-ignore
        delete window.currentCertificateModal;
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] h-[calc(100vh-10%)] bg-white">
        <DialogHeader className="px-4 overflow-y-auto hide-scrollbar">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            {isEditMode ? "Chỉnh sửa chứng chỉ" : "Tạo chứng chỉ mới"}
          </DialogTitle>
          <FormProvider {...methods}>
            <form className="space-y-4 p-4 h-max">
              <div className="space-y-6">
                {/* Course Name Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-[160px] text-SubheadMd">Tiêu đề</div>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="name"
                          type="text"
                          placeholder="Nhập dữ liệu"
                          customClassNames="flex-1"
                          error={errors.name?.message}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[160px] text-SubheadMd">
                      Form chứng chỉ
                    </div>
                    <Input
                      type="text"
                      placeholder="Chọn form chứng chỉ"
                      customClassNames="flex-1"
                      onClick={handleChooseCertificateForm}
                      value={
                        certificateFormSelected ? "Đã chọn form chứng chỉ" : ""
                      }
                      readOnly
                    />
                  </div>
                  {certificateFormSelected && (
                    <div className="ml-[160px] text-green-600 text-sm">
                      Form chứng chỉ đã được thiết lập. Nhấn vào để chỉnh sửa.
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[160px] text-SubheadMd">
                      Chọn khoá học
                    </div>
                    <CommonSelect
                      className="w-full bg-grey-50"
                      selectClassName="rounded-xl h-[50px] !bg-grey-50 border border-grey-300"
                      placeholder="Chọn khoá học"
                      options={
                        courses
                          ? courses.data.map((course) => {
                              return {
                                label: course.name,
                                value: course.id.toString(),
                              };
                            })
                          : []
                      }
                      value={course}
                      onChange={handleSelectCourseChange}
                    />
                  </div>
                </div>
                {/* Category Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <div className="min-w-[160px] text-SubheadMd">Mô tả</div>
                    <div className="flex-1">
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-col gap-2">
                            <ReactQuill
                              theme="snow"
                              className="w-full rounded-xl border-grey-300 bg-grey-50 outline-none !text-[20px] !min-h-[300px] transition-all ease-linear overflow-y-auto"
                              placeholder="Nhập mô tả chứng chỉ"
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <div className="min-w-[160px] text-SubheadMd">Đánh giá</div>
                    <div className="flex-1">
                      <Controller
                        name="isHasValidation"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <div className="flex gap-x-2 items-center text-sm">
                            <Switch
                              checked={value}
                              onCheckedChange={onChange}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </DialogHeader>
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
              {isSubmitting
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
