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
import { CommonTag } from "../common/CommonTag";
import StudentTablePagination from "./student-table-pagination";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { ReqCreateClass } from "@/requests/class";
import { ReqGetCourses } from "@/requests/course";
import { Check } from "lucide-react";
import { ReqCreateEnrollment } from "@/requests/enrollment";
import { ReqCreateClassSession } from "@/requests/class-session";
import { AddStudentToClass } from "./add-student-to-class";
import DateRangePicker from "@/components/common/date-picker/DatePicker";
import { Course } from "@/types/common-types";

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export function CreateClassDialog({
  open,
  onOpenChange,
}: CreateClassDialogProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, onChange] = useState<Value>([new Date(), new Date()]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [className, setClassName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [numberClassSession, setNumberClassSession] = useState(1);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);

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
    queryKey: ["teacherList"],
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
  const handleCreateClass = async () => {
    if (step == 1) return;
    try {
      /**
       * Class (startTime, endTime, className, teacherId)
       * Enrollments (userId, classId)[]
       */
      show();

      // Validate required fields
      if (!className) {
        error("Lỗi", "Vui lòng nhập tên lớp");
        return;
      }

      if (!courseId) {
        error("Lỗi", "Vui lòng chọn khóa học");
        return;
      }
      if (!course) {
        error("Lỗi", "Khóa học không tồn tại");
        return;
      }

      if (!teacherId) {
        error("Lỗi", "Vui lòng chọn giảng viên");
        return;
      }

      if (!value || !Array.isArray(value) || !value[0] || !value[1]) {
        error("Lỗi", "Vui lòng chọn thời gian bắt đầu và kết thúc");
        return;
      }

      // Format dates
      const startTime = value[0].toISOString();
      const endTime = value[1].toISOString();

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
      const enrollmentData = selectedStudents.map((studentId) => ({
        student: Number(studentId),
        class: newClass.data.id,
      }));
      await ReqCreateEnrollment(enrollmentData);

      //create new Class session with numberClassSession
      await ReqCreateClassSession({
        class: newClass.data.id,
        numberClassSession: numberClassSession,
      });
      success("Thành công", "Tạo mới lớp học thành công");
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
      setStep(2);
    } else {
      // Handle form submission
      console.log("Form submitted");
      await handleCreateClass();
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      const course = courseList?.data?.find(
        (course) => course.id.toString() === courseId
      );
      if (course) {
        setCourse(course);
      }
    }
  }, [courseId]);

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
          <div className="space-y-4 w-full ">
            <div className="flex items-start justify-center">
              <div className="text-SubheadMd text-gray-60 w-[160px]">
                Khóa học
              </div>
              <select
                className="flex-1 w-full p-2 border border-gray-300 rounded-md"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
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
            </div>

            <div className="flex items-start justify-center">
              <div className="text-SubheadMd text-gray-60 w-[160px]">
                Thời gian bắt đầu - kết thúc
              </div>
              <div className="flex-1 items-center gap-2">
                <DateRangePicker
                  onChange={(dateRange) => {
                    onChange([dateRange.startDate, dateRange.endDate]);
                  }}
                />
              </div>
            </div>

            <div className="flex items-start justify-center w-full">
              <div className="text-SubheadMd text-gray-60 w-[160px] ">
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
              <Input
                placeholder="Nhập thông tin"
                type="text"
                value={className}
                onChange={(e) => setClassName(e)}
                customClassNames="flex-1 border-gray-300 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-start justify-center">
              <div className="text-SubheadMd text-gray-60 w-[160px] cursor-pointer">
                Giảng viên
              </div>
              {teacherId === "" ? (
                <div className="flex-1 relative">
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
                      customClassNames="flex-1 !w-[464px] border-gray-300 focus:ring-purple-500 focus:border-transparent cursor-pointer"
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
                              .includes(teacherSearchQuery.toLowerCase())
                          ).length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-500">
                              Không tìm thấy giảng viên
                            </div>
                          ) : (
                            <div className="py-2">
                              {teacherList?.data
                                ?.filter((teacher) =>
                                  teacher.username
                                    .toLowerCase()
                                    .includes(teacherSearchQuery.toLowerCase())
                                )
                                .map((teacher) => (
                                  <div
                                    key={teacher.id}
                                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      setTeacherId(teacher.id.toString());
                                      setTeacherSearchQuery(teacher.username);
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
                                    {teacherId === teacher.id.toString() && (
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
                  {!teacherId && (
                    <p className="text-sm text-red-500 mt-1">
                      Vui lòng chọn giảng viên
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 w-[464px]">
                  <div className="flex-1 p-2 bg-primary-60 rounded-md text-gray-00">
                    {teacherList?.data?.find(
                      (teacher) => teacher.id.toString() === teacherId
                    )?.username || ""}
                  </div>
                  <button
                    onClick={() => {
                      setTeacherId("");
                      setTeacherSearchQuery("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    x
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /**
           * This is step 2 of create class and add student and teacher
           */
          <AddStudentToClass
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />
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
