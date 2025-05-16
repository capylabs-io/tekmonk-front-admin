"use client";

import { CommonCard } from "@/components/common/CommonCard";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ReqGetClasses, ReqUpdateClass } from "@/requests/class";
import {
  ReqCreateEnrollment,
  ReqDeleteEnrollment,
  ReqGetEnrollments,
} from "@/requests/enrollment";
import { ReqGetUsers } from "@/requests/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useLoadingStore } from "@/store/LoadingStore";
import { ReqGetCourses } from "@/requests/course";
import { format } from "date-fns";
import { ReqGetClassSessions } from "@/requests/class-session";
import { CommonRadioCheck } from "@/components/common/CommonRadioCheck";
import { TeacherList } from "@/components/admin/teacher-list";
import { CreateMission } from "@/components/class/create-mission";
import { getMission } from "@/requests/mission";
import StudentList from "@/components/admin/student-list";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit, UserRoundPlus } from "lucide-react";
import { AddStudentToClass } from "@/components/admin/add-student-to-class";
import { CommonButton } from "@/components/common/button/CommonButton";
import { EditCourseModal } from "@/components/course/EditCourseModal";
import { Class } from "@/types/common-types";
// Define the DateRange type
type ValuePiece = Date | null;

type DateValue = ValuePiece | [ValuePiece, ValuePiece];

export default function ClassManagementDetail() {
  const router = useCustomRouter();
  const { id: classId } = useParams();
  const [activeTab, setActiveTab] = useState("progress");
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
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [dateValue, setDateValue] = useState<DateValue>([
    new Date(),
    new Date(),
  ]);
  const [currentPageStudent, setCurrentPageStudent] = useState(1);

  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  // const tabs = [
  //   { id: "info", label: "Thông tin chung" },
  //   { id: "students", label: "Học viên" },
  //   { id: "teachers", label: "Giảng viên" },
  //   { id: "progress", label: "Tiến trình" },
  // ];
  const tabs = [
    { id: "progress", label: "Tiến trình" },
    { id: "mission", label: "Nhiệm vụ ngoài" },
    { id: "students", label: "Danh sách học viên" },
    { id: "teacher", label: "Giảng viên" },
    { id: "info", label: "Thông tin khóa học" },
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
          pagination: {
            page: 1,
            pageSize: 10,
          },
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
  const {
    data: studentMissionManualList,
    refetch: refetchStudentMissionManualList,
  } = useQuery({
    queryKey: ["course-mission"],
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
        return await getMission(queryString);
      } catch (error) {
        console.log("Error fetching course mission list:", error);
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
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
  const handleSessionClick = (sessionId: number) => {
    // Get current path and append session route
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${sessionId}`);
  };
  const handleEditCourse = () => {
    setEditCourseModalOpen(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return (
          <div className="space-y-6 p-4">
            <div className="flex flex-wrap gap-4">
              {classSession &&
                classSession.data.map((session, index) => (
                  <CommonCard
                    key={session.id}
                    className={`w-[200px] h-20 p-4`}
                    onClick={() => handleSessionClick(session.id)}
                  >
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
      case "mission":
        return (
          studentMissionManualList && (
            <CreateMission
              courseMissionManualList={studentMissionManualList.data}
              refetchCourseMissionManualList={refetchStudentMissionManualList}
              classId={Number(classId)}
            />
          )
        );
      case "students":
        return (
          enrollmentData && (
            <div className="relative">
              <button
                className="flex items-center justify-center gap-1 h-9 px-4 border border-[#D0D5DD] rounded-lg hover:bg-gray-50 absolute top-4 right-4"
                onClick={handleOpenAddStudentDialog}
              >
                <span>Thêm học viên</span>
                <UserRoundPlus width={16} height={16} />
              </button>
              <StudentList
                data={enrollmentData}
                currentPage={currentPageStudent}
                onPageChange={(page) => setCurrentPageStudent(page)}
                handleRemoveStudentFromClass={handleRemoveStudentFromClass}
                isAllowDeleteStudent
              />
            </div>
          )
        );
      case "teacher":
        return classDetail && <TeacherList data={classDetail} />;
      case "info":
        return (
          classDetail && (
            <div className="flex justify-between">
              <div className="p-6 flex gap-4">
                <Image
                  alt="course Image"
                  src={classDetail.course?.thumbnail || "/image/app-logox3.png"}
                  width={300}
                  height={200}
                  className="w-[300px] h-[200px] object-contain rounded-xl border border-gray-20"
                />
                <div className="flex flex-col gap-2">
                  {/* <div >
                  
                </div> */}
                  <span className="text-SubheadLg text-gray-95">
                    {classDetail.course?.name}
                  </span>
                  <span
                    className="text-BodyMd text-gray-95"
                    dangerouslySetInnerHTML={{
                      __html: classDetail.course?.description || "",
                    }}
                  />
                </div>
              </div>
              <div>
                <CommonButton
                  variant="secondary"
                  className="!h-max"
                  onClick={handleEditCourse}
                >
                  <Edit width={16} height={16} />
                  <div>Cập nhật</div>
                </CommonButton>
              </div>
            </div>
          )
        );
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
      <EditCourseModal
        open={editCourseModalOpen}
        setOpen={setEditCourseModalOpen}
        classId={classId as string}
        courseList={(courseList && courseList.data) || []}
        teacherList={(teacherList && teacherList.data) || []}
      />
    </div>
  );
}
