import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "../common/button/CommonButton";
import { Input } from "../common/Input";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputFileUpdload } from "../common/InputFileUpload";
import { ImagePlus, Plus } from "lucide-react";
import { quillFormats, quillModules } from "@/contants/config/react-quill";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { postMission } from "@/requests/mission";
import { useSnackbarStore } from "@/store/SnackbarStore";

const missionFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  imageUrl: z
    .any()
    .nullable()
    .refine((val) => val !== null, {
      message: "Vui lòng tải lên hình ảnh",
    }),
  type: z.string().min(1, "Vui lòng chọn loại nhiệm vụ"),
  reward: z.string().min(1, "Vui lòng nhập phần thưởng"),
  points: z.string().min(1, "Vui lòng nhập điểm thưởng"),
  class: z.number().min(1, "Vui lòng chọn lớp học"),
});

type MissionFormData = z.infer<typeof missionFormSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MissionFormData) => void;
  classId: number;
};

export const CreateMissionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  classId,
}: Props) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  // UseStore
  const [showSuccess, showError] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  const methods = useForm<MissionFormData>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: null,
      type: "Manual",
      reward: "",
      points: "",
      class: classId,
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const handleImageUpload = (file: File | null) => {
    if (file) setValue("imageUrl", file);
  };

  const createMissionMutation = useMutation({
    mutationFn: async (data: MissionFormData) => {
      console.log("data submit = ", data);
      const formData = new FormData();

      // Log the data to check what we're sending
      console.log("Submitting data:", data);

      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.imageUrl) formData.append("image", data.imageUrl);
      formData.append("type", data.type);
      formData.append("reward", data.reward);
      formData.append("points", data.points);
      formData.append("class", data.class.toString());
      console.log("Form data = ", formData);
      return postMission(formData);
    },
    onSuccess: () => {
      showSuccess("Thành công", "Tạo nhiệm vụ thành công");
      handleDialogChange(false);
      onSubmit(getValues());
    },
    onError: (error) => {
      console.error("Error details:", error);
      showError("Lỗi", "Tạo nhiệm vụ thất bại");
    },
  });

  const onSubmitForm = async (data: MissionFormData) => {
    try {
      // Validate form data before submission
      if (
        !data.title ||
        !data.description ||
        !data.imageUrl ||
        !data.reward ||
        !data.points
      ) {
        showError("Lỗi", "Vui lòng điền đầy đủ thông tin");
        return;
      }

      await createMissionMutation.mutate(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Lỗi", "Có lỗi xảy ra khi tạo nhiệm vụ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            Tạo nhiệm vụ mới
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4 p-4">
            <div className="space-y-6">
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

              <div className="flex justify-between text-sm">
                <span className="w-[160px] text-SubheadMd">
                  Hình ảnh <span className="text-red-500">*</span>
                </span>
                <InputFileUpdload
                  value={getValues("imageUrl")}
                  onChange={handleImageUpload}
                  customClassNames="max-w-[424px]"
                  customInputClassNames="text-sm"
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
                  <div className="w-[160px] text-SubheadMd">
                    Phần thưởng <span className="text-red-500">*</span>
                  </div>
                  <Controller
                    name="reward"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
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
                        type="text"
                        placeholder="Nhập điểm thưởng"
                        customClassNames="flex-1"
                        error={errors.points?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="text-SubheadMd mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </div>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-2">
                          <ReactQuill
                            theme="snow"
                            className="w-full max-w-[600px] rounded-xl border-grey-300 bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear overflow-y-auto"
                            placeholder="Nhập mô tả nhiệm vụ"
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
            </div>
          </form>
        </FormProvider>

        <DialogFooter className="px-4">
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
              onClick={handleSubmit(onSubmitForm)}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
