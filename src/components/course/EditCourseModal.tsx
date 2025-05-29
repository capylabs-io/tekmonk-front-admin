import { Class, Course, User } from "@/types/common-types";
import React, { useState } from "react";
import DateRangePicker from "../common/date-picker/DatePicker";
import { Input } from "../common/Input";
import { Check, Edit } from "lucide-react";
import { useLoadingStore } from "@/store/LoadingStore";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReqGetClasses, ReqUpdateClass } from "@/requests/class";
import { useSnackbarStore } from "@/store/SnackbarStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qs from "qs";
type ValuePiece = Date | null;

type DateValue = ValuePiece | [ValuePiece, ValuePiece];
type EditCourseModalProps = {
  classId?: string;
  courseList?: Course[];
  teacherList?: User[];
  open: boolean;
  setOpen: (open: boolean) => void;
};
export const EditCourseModal = ({
  classId,
  courseList,
  teacherList,
  open,
  setOpen,
}: EditCourseModalProps) => {
  const [teacherId, setTeacherId] = useState("");
  const [courseId, setCourseId] = useState("");

  const [dateValue, setDateValue] = useState<DateValue>([
    new Date(),
    new Date(),
  ]);
  const { success, error } = useSnackbarStore();
  const [showLoading, hideLoading] = useLoadingStore((state) => [
    state.show,
    state.hide,
  ]);
  const [formData, setFormData] = useState({
    courseName: "",
    classNames: "",
    duration: "",
    teacherName: "",
    status: "",
  });
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const { data: classDetail } = useQuery({
    queryKey: ["class-detail", classId],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          populate: "*",
        });
        const response = await ReqGetClasses(
          `${queryString}&filters[id][$eq]=${classId}`
        );
        if (response.data && response.data.length > 0) {
          const classDetail = response.data[0];
          // Update form data with class details
          setFormData({
            courseName: classDetail.course?.name || "",
            classNames: classDetail.name || "",
            duration: `${classDetail.startTime || ""} - ${
              classDetail.endTime || ""
            }`,
            teacherName: classDetail.teacher?.fullName || "",
            status:
              new Date(classDetail.endTime) > new Date()
                ? "Đang diễn ra"
                : "Đã kết thúc",
          });

          // Set default values for courseId and teacherId
          if (classDetail.course?.id) {
            setCourseId(classDetail.course.id.toString());
          }

          if (classDetail.teacher?.id) {
            setTeacherId(classDetail.teacher.id.toString());
            setTeacherSearchQuery(
              classDetail.teacher.username || classDetail.teacher.fullName || ""
            );
          }

          // Initialize date range picker with class start and end dates
          if (classDetail.startTime && classDetail.endTime) {
            try {
              const startDate = new Date(classDetail.startTime);
              const endDate = new Date(classDetail.endTime);
              setDateValue([startDate, endDate]);
            } catch (err) {
              console.error("Error parsing dates:", err);
            }
          }

          return classDetail;
        }
        return null;
      } catch (error) {
        console.error("Error fetching class details:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
  const { mutate: updateClassMutation } = useMutation({
    mutationFn: async (data: any) => {
      return await ReqUpdateClass(classDetail?.id?.toString() || "", {
        data: data,
      });
    },
    onSuccess: () => {
      success("Thành công", "Đã cập nhật thông tin lớp học");
    },
    onError: (err) => {
      console.error("Error updating class:", err);
      error("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin lớp học");
    },
    onSettled: () => {
      hideLoading();
    },
  });
  const handleUpdateClass = () => {
    showLoading();

    // Extract start and end dates from dateValue
    let startDate, endDate;
    if (Array.isArray(dateValue) && dateValue.length === 2) {
      startDate = dateValue[0] ? format(dateValue[0], "yyyy-MM-dd") : undefined;
      endDate = dateValue[1] ? format(dateValue[1], "yyyy-MM-dd") : undefined;
    }

    // Prepare update data
    const updateData = {
      name: formData.classNames,
      startTime: startDate,
      endTime: endDate,
      course: courseId ? parseInt(courseId) : undefined,
      teacher: teacherId ? parseInt(teacherId) : undefined,
    };

    updateClassMutation(updateData);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            Cập nhật thông tin lớp học
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-w-2xl mt-3">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-SubheadSm text-gray-95 !w-40">Khóa học</div>
              <select
                className="flex-1 w-full py-2 border border-gray-300 rounded-md"
                value={
                  courseId ||
                  (classDetail && classDetail.course?.id
                    ? classDetail.course.id.toString()
                    : "")
                }
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Chọn khóa</option>
                {courseList?.map((course) => (
                  <option
                    key={course.id.toString()}
                    value={course.id.toString()}
                  >
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-SubheadSm text-gray-95 w-40">Tên lớp</div>
              <div className="flex-1">
                <Input
                  type="text"
                  value={formData.classNames || classDetail?.name || ""}
                  onChange={(e) => setFormData({ ...formData, classNames: e })}
                  customClassNames="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-SubheadSm text-gray-95 w-40">Duration</div>
              <div className="flex-1">
                {/* <DateRangePicker
                      value={dateValue}
                      onChange={setDateValue}
                      className="w-full"
                      format="dd/MM/yyyy"
                      clearIcon={null}
                    /> */}
                <DateRangePicker
                  onChange={(dateRange) => {
                    setDateValue([dateRange.startDate, dateRange.endDate]);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-SubheadMd text-gray-95 w-40 cursor-pointer">
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
                          {teacherList?.filter((teacher) =>
                            teacher.username
                              .toLowerCase()
                              .includes(teacherSearchQuery.toLowerCase())
                          ).length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-500">
                              Không tìm thấy giảng viên
                            </div>
                          ) : (
                            <div className="py-2">
                              {teacherList
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
                    {teacherList?.find(
                      (teacher) => teacher.id.toString() === teacherId
                    )?.username ||
                      classDetail?.teacher?.username ||
                      ""}
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

            <div className="flex items-center gap-4">
              <div className="text-SubheadSm text-gray-95 w-40">Trạng thái</div>
              <div className="flex-1">
                <Input
                  type="text"
                  value={
                    formData.status ||
                    (new Date(classDetail?.endTime || "") > new Date()
                      ? "Đang diễn ra"
                      : "Đã kết thúc")
                  }
                  readOnly={true}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border cursor-pointer border-[#D0D5DD] rounded-lg px-4 py-2"
            >
              <div>Hủy</div>
            </button>
            <button
              onClick={handleUpdateClass}
              className="flex items-center gap-2 border cursor-pointer border-[#D0D5DD] bg-primary-60 text-gray-00 rounded-lg px-4 py-2"
            >
              <div>Cập nhật</div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
