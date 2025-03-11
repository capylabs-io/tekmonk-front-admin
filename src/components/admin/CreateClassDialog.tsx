"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CommonButton } from "../common/button/CommonButton";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { Input } from "../common/Input";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ReqGetUsers } from "@/requests/user";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { ReqCreateClass } from "@/requests/class";
import { ReqGetCourses } from "@/requests/course";
import { Check } from "lucide-react";
import { ReqCreateEnrollment } from "@/requests/enrollment";
import { ReqCreateClassSession } from "@/requests/class-session";
import { AddStudentToClass } from "./add-student-to-class";
import DateRangePicker from "@/components/common/date-picker/DatePicker";
import { Course, DateValue } from "@/types/common-types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2;

// Step 1 validation schema
const step1Schema = z.object({
  courseId: z.string().min(1, "Vui lòng chọn khóa học"),
  dateRange: z
    .object({
      startDate: z.date({
        required_error: "Vui lòng chọn ngày bắt đầu",
      }),
      endDate: z.date({
        required_error: "Vui lòng chọn ngày kết thúc",
      }),
    })
    .refine(
      (data) => {
        // Ensure start date is not after end date
        return data.startDate <= data.endDate;
      },
      {
        message: "Ngày bắt đầu phải trước hoặc cùng ngày với ngày kết thúc",
        path: ["startDate"],
      }
    )
    .refine(
      (data) => {
        // Ensure start date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.startDate >= today;
      },
      {
        message: "Ngày bắt đầu không thể là ngày trong quá khứ",
        path: ["startDate"],
      }
    )
    .refine(
      (data) => {
        // Ensure there's at least one day between start and end date
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 1;
      },
      {
        message: "Khóa học phải kéo dài ít nhất 1 ngày",
        path: ["endDate"],
      }
    ),
  className: z.string().min(1, "Vui lòng nhập tên lớp"),
  teacherId: z.string().min(1, "Vui lòng chọn giảng viên"),
});

// Step 2 validation schema
const step2Schema = z.object({
  selectedStudents: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một học viên"),
});

// Combined schema for the entire form
const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
});

type Step1FormValues = z.infer<typeof step1Schema>;
type Step2FormValues = z.infer<typeof step2Schema>;
type FormValues = z.infer<typeof formSchema>;

export function CreateClassDialog({
  open,
  onOpenChange,
}: CreateClassDialogProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [value, onChange] = useState<DateValue>([new Date(), new Date()]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);

  // React Hook Form setup for step 1
  const step1Form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      courseId: "",
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
      },
      className: "",
      teacherId: "",
    },
  });

  // React Hook Form setup for step 2
  const step2Form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      selectedStudents: [],
    },
  });

  // Update form values when selectedStudents changes
  useEffect(() => {
    step2Form.setValue("selectedStudents", selectedStudents);
  }, [selectedStudents, step2Form]);

  //Use Store
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  /** UseQuery*/
  const { data: courseList } = useQuery({
    queryKey: ["courseList"],
    queryFn: async () => {
      try {
        return await ReqGetCourses();
      } catch (error) {
        console.log("error when fetching course list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: teacherList } = useQuery({
    queryKey: ["teacherList", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            user_role: {
              code: {
                $eq: "TEACHER",
              },
            },
          },
          populate: "user_role",
          page: currentPage,
          pageSize: itemsPerPage,
        });
        return await ReqGetUsers(queryString);
      } catch (error) {
        console.log("error when fetching teacher list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  // Add this useEffect to handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("teacher-dropdown");
      const input = document.getElementById("teacher-input");
      if (
        dropdown &&
        input &&
        !dropdown.contains(event.target as Node) &&
        !input.contains(event.target as Node)
      ) {
        setIsTeacherDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Function fetching
   */
  const handleCreateClass = async (formData: FormValues) => {
    try {
      show();

      const { courseId, dateRange, className, teacherId } = formData;

      // Format dates
      const startTime = dateRange.startDate.toISOString();
      const endTime = dateRange.endDate.toISOString();

      // Create class data
      const classData = {
        data: {
          name: className,
          code: `CLASS-${Math.floor(Math.random() * 10000)}`,
          startTime,
          endTime,
          teacher: teacherId,
          course: courseId,
        },
      };

      const newClass = await ReqCreateClass(classData);

      //create enrollment
      const enrollmentData = formData.selectedStudents.map((studentId) => ({
        student: Number(studentId),
        class: newClass.data.id,
      }));
      await ReqCreateEnrollment(enrollmentData);

      //create new Class session with numberClassSession
      await ReqCreateClassSession({
        class: newClass.data.id,
        numberClassSession: course?.numberSession || 0,
      });
      success("Thành công", "Tạo mới lớp học thành công");
      onOpenChange(false);
    } catch (err) {
      console.error("Error creating class:", err);
      error("Lỗi", "Có lỗi xảy ra khi tạo mới lớp học, vui lòng thử lại sau");
    } finally {
      hide();
    }
  };

  /**
   * Handle function
   */
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onOpenChange(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await step1Form.trigger();
      if (isValid) {
        setStep(2);
      }
    } else {
      // Handle form submission for step 2
      const step2Valid = await step2Form.trigger();
      if (step2Valid) {
        const step1Data = step1Form.getValues();
        const step2Data = step2Form.getValues();

        // Combine data from both steps
        const formData = {
          ...step1Data,
          ...step2Data,
        };

        await handleCreateClass(formData);
      }
    }
  };

  useEffect(() => {
    const courseId = step1Form.watch("courseId");
    if (courseId) {
      const selectedCourse = courseList?.data?.find(
        (course) => course.id.toString() === courseId
      );
      if (selectedCourse) {
        setCourse(selectedCourse);
      }
    }
  }, [step1Form.watch("courseId"), courseList?.data]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      step1Form.reset();
      step2Form.reset();
      setSelectedStudents([]);
      setStep(1);
    }
  }, [open, step1Form, step2Form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] bg-white rounded-lg p-6">
        <DialogHeader>
          <div className="flex gap-4 mb-6">
            <DialogTitle className="text-xl font-semibold flex flex-col">
              <div>Tạo lớp học mới</div>
              <div>
                <span className="text-gray-500 text-sm font-normal">
                  B{step}:{" "}
                  {step === 1 ? "Thông tin chung" : "Thông tin học viên"}
                </span>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        {step === 1 ? (
          <form
            className="space-y-4 w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-start justify-center">
              <div className="text-SubheadMd text-gray-60 w-[160px]">
                Khóa học
              </div>
              <div className="flex-1">
                <Controller
                  name="courseId"
                  control={step1Form.control}
                  render={({ field }) => (
                    <select
                      className={`flex-1 w-full p-2 border ${
                        step1Form.formState.errors.courseId
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <option value="">Chọn khóa</option>
                      {courseList?.data?.map((course) => (
                        <option
                          key={course.id.toString()}
                          value={course.id.toString()}
                        >
                          {course.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {step1Form.formState.errors.courseId && (
                  <p className="text-red-500 text-sm mt-1">
                    {step1Form.formState.errors.courseId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start justify-center">
              <div className="text-SubheadMd text-gray-60 w-[160px]">
                Thời gian bắt đầu - kết thúc
              </div>
              <div className="flex-1 items-center gap-2">
                <Controller
                  name="dateRange"
                  control={step1Form.control}
                  render={({ field }) => (
                    <DateRangePicker
                      onChange={(dateRange) => {
                        field.onChange(dateRange);
                        onChange([dateRange.startDate, dateRange.endDate]);
                      }}
                    />
                  )}
                />
                {step1Form.formState.errors.dateRange && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof step1Form.formState.errors.dateRange.message ===
                    "string"
                      ? step1Form.formState.errors.dateRange.message
                      : step1Form.formState.errors.dateRange?.startDate
                          ?.message ||
                        step1Form.formState.errors.dateRange?.endDate
                          ?.message ||
                        "Vui lòng chọn thời gian bắt đầu và kết thúc hợp lệ"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start justify-center w-full">
              <div className="text-SubheadMd text-gray-60 w-[160px]">
                Số buổi học
              </div>
              <Input
                type="number"
                value={course?.numberSession?.toString() || ""}
                readOnly={true}
                customClassNames="flex-1 border-gray-300 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-start justify-center w-full">
              <div className="text-SubheadMd text-gray-60 w-[160px] ">
                Tên lớp
              </div>
              <div className="flex-1">
                <Controller
                  name="className"
                  control={step1Form.control}
                  render={({ field }) => (
                    <Input
                      placeholder="Nhập thông tin"
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                      customClassNames={`flex-1 border-${
                        step1Form.formState.errors.className
                          ? "red-500"
                          : "gray-300"
                      } focus:ring-purple-500 focus:border-transparent`}
                    />
                  )}
                />
                {step1Form.formState.errors.className && (
                  <p className="text-red-500 text-sm mt-1">
                    {step1Form.formState.errors.className.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start justify-center">
              <div className="text-SubheadMd text-gray-60 w-[160px] cursor-pointer">
                Giảng viên
              </div>
              <div className="flex-1 relative">
                <Controller
                  name="teacherId"
                  control={step1Form.control}
                  render={({ field }) => (
                    <>
                      {!field.value ? (
                        <div>
                          <div
                            id="teacher-input"
                            onClick={() => setIsTeacherDropdownOpen(true)}
                          >
                            <Input
                              isSearch={true}
                              placeholder="Chọn giảng viên"
                              type="text"
                              value={teacherSearchQuery}
                              onChange={(value) => {
                                setTeacherSearchQuery(value);
                                setIsTeacherDropdownOpen(true);
                              }}
                              customClassNames={`flex-1 !w-[464px] border-${
                                step1Form.formState.errors.teacherId
                                  ? "red-500"
                                  : "gray-300"
                              } focus:ring-purple-500 focus:border-transparent cursor-pointer`}
                            />
                          </div>
                          {isTeacherDropdownOpen && (
                            <div
                              id="teacher-dropdown"
                              className="absolute z-50 w-[464px] bg-white shadow-lg rounded-md border mt-1"
                            >
                              <div className="w-full">
                                <div className="max-h-[300px] overflow-y-auto">
                                  {teacherList?.data?.filter((teacher) =>
                                    teacher.username
                                      .toLowerCase()
                                      .includes(
                                        teacherSearchQuery.toLowerCase()
                                      )
                                  ).length === 0 ? (
                                    <div className="py-6 text-center text-sm text-gray-500">
                                      Không tìm thấy giảng viên
                                    </div>
                                  ) : (
                                    <div className="py-2 max-h-[200px] overflow-auto">
                                      {teacherList?.data
                                        ?.filter((teacher) =>
                                          teacher.username
                                            .toLowerCase()
                                            .includes(
                                              teacherSearchQuery.toLowerCase()
                                            )
                                        )
                                        .map((teacher) => (
                                          <div
                                            key={teacher.id}
                                            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                              field.onChange(
                                                teacher.id.toString()
                                              );
                                              setTeacherSearchQuery(
                                                teacher.username
                                              );
                                              setIsTeacherDropdownOpen(false);
                                            }}
                                          >
                                            <div className="flex-1">
                                              <div className="font-medium">
                                                {teacher.username}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {teacher.email}
                                              </div>
                                            </div>
                                            {field.value ===
                                              teacher.id.toString() && (
                                              <Check className="h-4 w-4 text-primary-600 ml-2 flex-shrink-0" />
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 w-[464px]">
                          <div className="flex-1 p-2 bg-primary-60 rounded-md text-gray-00">
                            {teacherList?.data?.find(
                              (teacher) => teacher.id.toString() === field.value
                            )?.username || ""}
                          </div>
                          <button
                            onClick={() => {
                              field.onChange("");
                              setTeacherSearchQuery("");
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            x
                          </button>
                        </div>
                      )}
                    </>
                  )}
                />
                {step1Form.formState.errors.teacherId && (
                  <p className="text-red-500 text-sm mt-1">
                    {step1Form.formState.errors.teacherId.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        ) : (
          /**
           * This is step 2 of create class and add student and teacher
           */
          <form onSubmit={(e) => e.preventDefault()}>
            <AddStudentToClass
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
            />
            {step2Form.formState.errors.selectedStudents && (
              <p className="text-red-500 text-sm mt-2">
                {step2Form.formState.errors.selectedStudents.message}
              </p>
            )}
          </form>
        )}

        <div className="flex justify-between gap-3 mt-8 ">
          <CommonButton onClick={handleBack} variant="secondary">
            <ArrowLeft />
            Quay lại
          </CommonButton>
          <CommonButton
            variant="primary"
            onClick={handleNext}
            className="flex items-center justify-center gap-1"
          >
            <div>{step === 1 ? "Tiếp theo" : "Tạo lớp"}</div>
            {step === 1 && <ArrowRight size={20} />}
          </CommonButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
