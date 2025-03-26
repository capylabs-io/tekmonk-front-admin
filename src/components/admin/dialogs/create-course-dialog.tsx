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
import { courseSchema } from "@/validation/course";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { AddItemDialog } from "./add-item-dialog";
import { CommonTag } from "@/components/common/CommonTag";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { getMission } from "@/requests/mission";
import { Mission } from "@/types/mission";
import { StrapiResponse } from "@/requests/strapi-response-pattern";

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
  onSubmit: (data: CourseFormValues) => void;
  courseToEdit?: CourseFormValues | null;
  mode?: "create" | "edit";
};

type FormProps = {
  onClickSearchCertificate: () => void;
  onClickSearchMission: () => void;
  selectedMissions: Mission[];
  isLoadingMissions: boolean;
};

type CourseFormValues = z.infer<typeof courseSchema> & {
  missions?: Mission[];
};

// Form Fields Component
const CourseFormFields = ({
  onClickSearchCertificate,
  onClickSearchMission,
  selectedMissions,
  isLoadingMissions,
}: FormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CourseFormValues>();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const removeMission = (missionId: string) => {
    const customEvent = new CustomEvent("removeMission", { detail: missionId });
    window.dispatchEvent(customEvent);
  };

  const formContent = (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
      {/* Course Name Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="w-[160px] text-SubheadMd text-gray-60">
            Tên khoá học
          </div>
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

      {/* Description Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
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
                      placeholder="Nhập mô tả khóa học"
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
      <div className="flex items-start gap-2">
        <div className="w-[160px] text-SubheadMd text-gray-60">Số buổi học</div>
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
      {/* Category Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="w-[160px] text-SubheadMd text-gray-60">Loại</div>
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
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="w-[160px] text-SubheadMd text-gray-60">
            Chứng chỉ của khoá học
          </div>
          <Input
            isSearch={true}
            type="text"
            placeholder="Chọn chứng chỉ"
            onClick={onClickSearchCertificate}
            customClassNames="w-full cursor-pointer"
            customInputClassNames="w-full pl-8"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="w-[160px] text-SubheadMd text-gray-60">
            Nhiệm vụ của khoá học
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Input
              isSearch={true}
              type="text"
              placeholder="Chọn nhiệm vụ"
              onClick={onClickSearchMission}
              customClassNames="w-full cursor-pointer"
              customInputClassNames="w-full pl-8"
              readOnly
              disabled={isLoadingMissions}
              rightIcon={
                isLoadingMissions ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-60"></div>
                ) : undefined
              }
            />
            {selectedMissions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMissions.map((mission) => (
                  <CommonTag
                    key={mission.id}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {mission.title}
                    <button
                      onClick={() => removeMission(mission.id.toString())}
                      className="text-gray-500 hover:text-gray-700 ml-1"
                      type="button"
                    >
                      ×
                    </button>
                  </CommonTag>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return formContent;
};

export const CreateCourseDialog = ({
  open,
  onOpenChange,
  onSubmit,
  courseToEdit,
  mode = "create",
}: Props) => {
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [isClient, setIsClient] = useState(false);
  const [openListCertificate, setOpenListCertificate] = useState(false);
  const [openListMission, setOpenListMission] = useState(false);
  const [selectedMissions, setSelectedMissions] = useState<Mission[]>([]);
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);

  const { data: missionsResponse, isLoading: isLoadingMissions } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            type: {
              $eq: "auto",
            },
          },
        });
        const response = await getMission(queryString);
        return response;
      } catch (err) {
        error("Lỗi", "Không thể lấy dữ liệu nhiệm vụ");
        console.error("error when get missions", err);
      }
    },
  });

  // Extract missions data from the Strapi response
  const missions = missionsResponse?.data || [];

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      numberSession: 0,
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

  // Add event listener for removing missions
  useEffect(() => {
    const handleRemoveMission = (event: Event) => {
      const missionId = (event as CustomEvent<string>).detail;
      setSelectedMissionIds((prev) => prev.filter((id) => id !== missionId));
      setSelectedMissions((prev) =>
        prev.filter((mission) => mission.id.toString() !== missionId)
      );
    };

    window.addEventListener(
      "removeMission",
      handleRemoveMission as EventListener
    );

    return () => {
      window.removeEventListener(
        "removeMission",
        handleRemoveMission as EventListener
      );
    };
  }, []);

  // Initialize from courseToEdit when in edit mode
  useEffect(() => {
    if (courseToEdit && mode === "edit") {
      reset(courseToEdit);

      // Set selected missions if available in courseToEdit
      if (courseToEdit.missions && courseToEdit.missions.length > 0) {
        setSelectedMissions(courseToEdit.missions);
        setSelectedMissionIds(
          courseToEdit.missions.map((mission) => mission.id.toString())
        );
      }
    } else {
      // Reset form and clear missions in create mode
      reset({
        name: "",
        description: "",
        type: "",
        numberSession: 0,
      });
      setSelectedMissions([]);
      setSelectedMissionIds([]);
    }
  }, [courseToEdit, mode, reset]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedMissions([]);
      setSelectedMissionIds([]);
    }
    onOpenChange(open);
  };

  const handleClickSearchMission = () => {
    if (!missions.length) {
      error("Lỗi", "Không có nhiệm vụ tự động nào");
      return;
    }

    setOpenListMission(true);
  };

  const handleMissionSubmit = () => {
    // Update the selectedMissions array based on selectedMissionIds
    const selectedMissionsData = missions.filter((mission) =>
      selectedMissionIds.includes(mission.id.toString())
    );
    setSelectedMissions(selectedMissionsData);
  };

  const handleSubmitForm = (data: CourseFormValues) => {
    // Include selected missions in the form data
    const formData = {
      ...data,
      missions: selectedMissions,
    };
    onSubmit(formData);
  };

  const dialogContent = (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="w-[680px] bg-white">
          <DialogHeader className="px-4">
            <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
              {mode === "create" ? "Tạo khóa học mới" : "Chỉnh sửa khóa học"}
            </DialogTitle>
            <div className="text-BodyMd text-gray-60 mb-4">
              Vui lòng điền đầy đủ thông tin khóa học
            </div>
          </DialogHeader>

          <FormProvider {...methods}>
            <form className="space-y-4 p-4">
              <CourseFormFields
                onClickSearchCertificate={() => {
                  setOpenListCertificate(true);
                }}
                onClickSearchMission={handleClickSearchMission}
                selectedMissions={selectedMissions}
                isLoadingMissions={isLoadingMissions}
              />

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

      <AddItemDialog
        open={openListMission}
        onOpenChange={setOpenListMission}
        title="Chọn nhiệm vụ"
        description="Vui lòng chọn nhiệm vụ cho khóa học"
        items={missions}
        selectedItems={selectedMissionIds}
        setSelectedItems={setSelectedMissionIds}
        searchPlaceholder="Tìm kiếm nhiệm vụ"
        nameKey="title"
        descriptionKey="actionType"
        onSubmit={handleMissionSubmit}
        totalItems={missions.length}
      />
    </>
  );

  if (!isClient) {
    return null;
  }

  return dialogContent;
};
