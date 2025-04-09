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
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  useForm,
  FormProvider,
  Controller
} from "react-hook-form";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { CommonSelect } from "../common/CommonSelect";
import { InputFileUpdload } from "../common/InputFileUpload"
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ReqGetCourses } from "@/requests/course";
import { Switch } from "../ui/switch";

export type CertificateFormData = {
  name?: string
  description?: string
  imgUrl?: File | null
  // type?: string,
  course?: string,
  isHasValidation?: boolean
  // issuer_type?: string,
  // certificate_form?: string
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CertificateFormData) => void;
  onChooseCertificateForm?: () => void;
};


export const CreateCertificateModal = ({ open, onOpenChange, onSubmit, onChooseCertificateForm }: Props) => {
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const methods = useForm({
    // resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      name: "",
      imgUrl: null,
      // type: "",
      description: "",
      course: "",
      isHasValidation: false
    },
  })
  const { data: courses } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      try {
        const queryString = qs.stringify(
          {
            populate: '*'
          }
        )
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
  const course = watch('course')
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
    if (file) setValue("imgUrl", file as any)
  }
  // const handleSelectChange = (value: string) => {
  //   setValue('type', value)
  // }
  const handleSelectCourseChange = (value: string) => {
    const selectedCourse = courses?.data.find((course) => course.id === parseInt(value))
    if (selectedCourse) {
      setValue('course', selectedCourse.id.toString())
    }
  }
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] h-[calc(100vh-10%)] bg-white">
        <DialogHeader className="px-4 overflow-y-auto hide-scrollbar">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            Tạo chứng chỉ mới
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
                    <div className="min-w-[160px] text-SubheadMd">Hình nền</div>
                    <InputFileUpdload
                      value={getValues("imgUrl")}
                      onChange={handleImageUpload}
                      customInputClassNames="text-sm min-h-[50px] max-h-max !items-start"
                      contentImageUpload={
                        <>
                          <p className="flex items-center gap-2 text-base  !font-light text-gray-70 w-full justify-start !self-start"><Plus size={16}></Plus>Thêm ảnh</p>
                        </>
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[160px] text-SubheadMd">Form chứng chỉ</div>
                    <Input
                      type="text"
                      placeholder="Chọn form chứng chỉ"
                      customClassNames="flex-1"
                      onClick={() => onChooseCertificateForm?.()}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[160px] text-SubheadMd">Chọn khoá học</div>
                    <CommonSelect className="w-full bg-grey-50" selectClassName="rounded-xl h-[50px] !bg-grey-50 border border-grey-300" placeholder="Chọn khoá học" options={courses ? courses.data.map((course) => {
                      return {
                        label: course.name,
                        value: course.id.toString()
                      }
                    }) : []} value={course} onChange={handleSelectCourseChange} />
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
                            <Switch checked={value} onCheckedChange={onChange} />
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
              {isSubmitting ? "Đang tạo..." : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
