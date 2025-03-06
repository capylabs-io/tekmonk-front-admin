"use client";

import { CommonCard } from "@/components/common/CommonCard";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReqGetClasses, ReqUpdateClass } from "@/requests/class";
import {
  ReqCreateEnrollment,
  ReqDeleteEnrollment,
  ReqGetEnrollments,
} from "@/requests/enrollment";
import { ReqGetUsers } from "@/requests/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Check, Edit, Trash, UserRoundPlus } from "lucide-react";
import { useParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useLoadingStore } from "@/store/LoadingStore";
import { Input } from "@/components/common/Input";
import { ReqGetCourses } from "@/requests/course";
import { format } from "date-fns";
import { ReqGetClassSessions } from "@/requests/class-session";
import { CommonRadioCheck } from "@/components/common/CommonRadioCheck";
import { TeacherList } from "@/components/admin/teacher-list";
import { AddStudentToClass } from "@/components/admin/add-student-to-class";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import DateRangePicker from "@/components/common/date-picker/DatePicker";

// Define the DateRange type
type ValuePiece = Date | null;

type DateValue = ValuePiece | [ValuePiece, ValuePiece];

export default function ClassDetail() {
  const router = useCustomRouter();
  const { id: classId } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    courseName: "",
    classNames: "",
    duration: "",
    teacherName: "",
    status: "",
  });
  const { success, error } = useSnackbarStore();
  const { show, hide } = useLoadingStore();
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [dateValue, setDateValue] = useState<DateValue>([
    new Date(),
    new Date(),
  ]);

  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  const tabs = [
    { id: "info", label: "Thông tin chung" },
    { id: "students", label: "Học viên" },
    { id: "teachers", label: "Giảng viên" },
    { id: "progress", label: "Tiến trình" },
  ];

  /** UseQuery */
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

  const { data: enrollmentData, refetch: refetchEnrollmentData } = useQuery({
    queryKey: ["enrollment-data", classId],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            class: {
              id: {
                $eq: classId,
              },
            },
          },
          populate: "*",
        });

        return await ReqGetEnrollments(queryString);
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
      }
    },
  });

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
          page: 1,
          pageSize: 10,
        });
        return await ReqGetUsers(queryString);
      } catch (error) {
        console.log("error when fetching teacher list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  /**
   * React Query Mutations
   */
  const { mutate: removeStudentFromClassMutation } = useMutation({
    mutationFn: async (enrollmentId: number) => {
      return await ReqDeleteEnrollment(enrollmentId);
    },
    onSuccess: () => {
      success("Thành công", "Đã xóa học viên khỏi lớp học");
      // Refetch enrollment data
      refetchEnrollmentData();
    },
    onError: (err) => {
      console.error("Error removing student:", err);
      error("Lỗi", "Có lỗi xảy ra khi xóa học viên khỏi lớp học");
    },
    onSettled: () => {
      hide();
    },
  });

  // Add student mutation
  const { mutate: addStudentMutation } = useMutation({
    mutationFn: async (studentIds: string[]) => {
      const enrollmentData = studentIds.map((studentId) => ({
        student: Number(studentId),
        class: Number(classId),
      }));
      return await ReqCreateEnrollment(enrollmentData);
    },
    onSuccess: () => {
      success("Thành công", "Đã thêm học viên vào lớp học");
      // Refetch enrollment data
      refetchEnrollmentData();
      // Reset selected students
      setSelectedStudents([]);
      // Close dialog
      setAddStudentDialogOpen(false);
    },
    onError: (err) => {
      console.error("Error adding students:", err);
      error("Lỗi", "Có lỗi xảy ra khi thêm học viên vào lớp học");
    },
    onSettled: () => {
      hide();
    },
  });

  // Add update class mutation
  const { mutate: updateClassMutation } = useMutation({
    mutationFn: async (data: any) => {
      return await ReqUpdateClass(classId.toString(), { data: data });
    },
    onSuccess: () => {
      success("Thành công", "Đã cập nhật thông tin lớp học");
    },
    onError: (err) => {
      console.error("Error updating class:", err);
      error("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin lớp học");
    },
    onSettled: () => {
      hide();
    },
  });

  const { data: classSession } = useQuery({
    queryKey: ["class-session", classId],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            class: {
              id: {
                $eq: classId,
              },
            },
          },
          populate: "*",
        });
        return await ReqGetClassSessions(queryString);
      } catch (error) {
        console.log(error);
      }
    },
    refetchOnWindowFocus: false,
  });

  /**
   * Function handlers
   */
  const handleUpdateClass = () => {
    show();

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
  };

  const handleRemoveStudentFromClass = (enrollmentId: number) => {
    show();
    removeStudentFromClassMutation(enrollmentId);
  };

  const handleOpenAddStudentDialog = () => {
    setAddStudentDialogOpen(true);
  };

  const handleAddStudents = () => {
    if (selectedStudents.length === 0) {
      error("Lỗi", "Vui lòng chọn ít nhất một học viên");
      return;
    }

    show();
    addStudentMutation(selectedStudents);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          classDetail && (
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-SubheadSm text-gray-95 !w-40">
                    Khóa học
                  </div>
                  <select
                    className="flex-1 w-full py-2 border border-gray-300 rounded-md"
                    value={
                      courseId ||
                      (classDetail.course?.id
                        ? classDetail.course.id.toString()
                        : "")
                    }
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
                <div className="flex items-center gap-4">
                  <div className="text-SubheadSm text-gray-95 w-40">
                    Tên lớp
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={formData.classNames || classDetail.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, classNames: e })
                      }
                      customClassNames="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-SubheadSm text-gray-95 w-40">
                    Duration
                  </div>
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
                                        .includes(
                                          teacherSearchQuery.toLowerCase()
                                        )
                                    )
                                    .map((teacher) => (
                                      <div
                                        key={teacher.id}
                                        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                          setTeacherId(teacher.id.toString());
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
                                        {teacherId ===
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
                        )?.username ||
                          classDetail.teacher?.username ||
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
                  <div className="text-SubheadSm text-gray-95 w-40">
                    Trạng thái
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={
                        formData.status ||
                        (new Date(classDetail.endTime) > new Date()
                          ? "Đang diễn ra"
                          : "Đã kết thúc")
                      }
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={handleUpdateClass}
                  className="flex items-center gap-2 border cursor-pointer border-[#D0D5DD] rounded-lg px-4 py-2"
                >
                  <Edit width={16} height={16} />
                  <div>Cập nhật</div>
                </button>
              </div>
            </div>
          )
        );
      case "students":
        return (
          <div className="p-4">
            {enrollmentData?.data && enrollmentData.data.length > 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="text-SubheadSm text-gray-95">
                      <TableHead className="w-[100px]">STT</TableHead>
                      <TableHead>Tên học viên</TableHead>
                      <TableHead>Tên tài khoản</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-BodySm">
                    {enrollmentData.data.map((enrollment, index: number) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="text-right">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {enrollment.student?.fullName ||
                            enrollment.student?.username}
                        </TableCell>
                        <TableCell>{enrollment.student?.username}</TableCell>
                        <TableCell>{enrollment.student?.email}</TableCell>
                        <TableCell>
                          {enrollment.student?.blocked
                            ? "Đã vô hiệu hoá"
                            : "Đang hoạt động"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={() =>
                              handleRemoveStudentFromClass(enrollment.id)
                            }
                          >
                            <Trash width={16} height={16} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <button
                    className="flex items-center justify-center gap-1 h-9 px-4 border border-[#D0D5DD] rounded-lg hover:bg-gray-50"
                    onClick={handleOpenAddStudentDialog}
                  >
                    <span>Thêm học viên</span>
                    <UserRoundPlus width={16} height={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div
                  className="w-[300px] h-[200px] bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: "url('/admin/empty-data.png')" }}
                />
                <p className="text-gray-500 mt-4">Không có học viên</p>
                <p className="text-gray-500">
                  Thêm học viên vào lớp để bắt đầu
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                  onClick={handleOpenAddStudentDialog}
                >
                  Thêm học viên
                </button>
              </div>
            )}
          </div>
        );
      case "teachers":
        return (
          <div className="p-4">
            {classDetail && <TeacherList data={classDetail} />}
          </div>
        );
      case "progress":
        return (
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {classSession &&
                classSession.data.map((session, index) => (
                  <CommonCard key={session.id} className={`w-[200px] h-20 p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-SubheadMd text-gray-95">
                        Buổi {index + 1}
                      </span>
                      <CommonRadioCheck onChecked={session.status === "done"} />
                    </div>
                    <div className="text-BodySm">
                      Trạng thái:{" "}
                      {session.status === "done"
                        ? "Đã hoàn thành"
                        : "Chưa diễn ra"}
                    </div>
                  </CommonCard>
                ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full border-r border-gray-20 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <CommonCard
            size="small"
            className="w-8 h-8 !rounded-[6px] flex items-center justify-center cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft width={17} height={17} />
          </CommonCard>
          <div className="flex items-center justify-center">
            <div className="text-SubheadLg text-gray-95">Chi tiết lớp học</div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-4 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-60 text-primary-95"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">{renderTabContent()}</div>

      {/* Add Student Dialog */}
      <Dialog
        open={addStudentDialogOpen}
        onOpenChange={setAddStudentDialogOpen}
      >
        <DialogContent className="w-[680px] bg-white">
          <DialogHeader className="px-4">
            <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
              Thêm học viên vào lớp
            </DialogTitle>
          </DialogHeader>

          <div className="p-4">
            <AddStudentToClass
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              classId={classId as string}
            />

            {/* Actions */}
            <div className="flex justify-between mt-4">
              <div>
                <span className="text-sm text-gray-500">
                  Đã chọn {selectedStudents.length} học viên
                </span>
              </div>
              <div className="flex gap-2">
                <CommonButton
                  variant="secondary"
                  onClick={() => setAddStudentDialogOpen(false)}
                >
                  Hủy
                </CommonButton>
                <CommonButton
                  variant="primary"
                  onClick={handleAddStudents}
                  disabled={selectedStudents.length === 0}
                >
                  Thêm vào lớp
                </CommonButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
