"use client";
import StudentList from "@/components/admin/student-list";
import { TeacherList } from "@/components/admin/teacher-list";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonRadioCheck } from "@/components/common/CommonRadioCheck";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { Tabs } from "@/components/new/tabs";
import { ReqGetClasses } from "@/requests/class";
import { ReqGetClassSessions } from "@/requests/class-session";
import { ReqGetEnrollments } from "@/requests/enrollment";
import { useClassStore } from "@/store/class-store";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, PanelLeft } from "lucide-react";
import Image from "next/image";
import qs from "qs";
import { useState } from "react";
import { CreateForeignMission } from "@/components/class/create-foreign-mission";
import { getMission } from "@/requests/mission";

export default function ClassDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useCustomRouter();
  const [activeTab, setActiveTab] = useState<{ id: string; label: string }>({
    id: "progress",
    label: "Tiến trình",
  });
  const [currentPageStudent, setCurrentPageStudent] = useState(1);
  const [currentClass] = useClassStore((state) => [state.currentClass]);

  const tabs = [
    { id: "progress", label: "Tiến trình" },
    { id: "mission", label: "Nhiệm vụ ngoài" },
    { id: "students", label: "Danh sách học viên" },
    { id: "teacher", label: "Giảng viên" },
    { id: "info", label: "Thông tin khóa học" },
  ];

  /**
   * UseQuery
   */
  const { data: classData } = useQuery({
    queryKey: ["class", params.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            id: {
              $eq: params.id,
            },
          },
          populate: "*",
        });
        return await ReqGetClasses(queryString);
      } catch (error) {
        console.log(error);
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: classSession } = useQuery({
    queryKey: ["class-session", params.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            class: {
              id: {
                $eq: params.id,
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

  const { data: StudentData } = useQuery({
    queryKey: ["student-list", params.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            class: {
              id: {
                $eq: params.id,
              },
            },
          },
          populate: "*",
        });
        return await ReqGetEnrollments(queryString);
      } catch (error) {
        console.log(error);
      }
    },
    refetchOnWindowFocus: false,
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
                $eq: params.id,
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

  const handleSessionClick = (sessionId: number) => {
    // Get current path and append session route
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${sessionId}`);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center gap-4 p-4 border-b ">
        <div className="flex items-center justify-center gap-4">
          <CommonCard
            size="small"
            className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
          >
            <PanelLeft width={17} height={17} />
          </CommonCard>
          <div className="flex items-center justify-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-70" />
            </button>
            <div className="text-SubheadLg text-gray-95">Chi tiết lớp học</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs
        tabs={tabs}
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        className="max-w-[600px] gap-6"
      />

      {/* Content Section */}
      {activeTab.id === "progress" && (
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      )}
      {activeTab.id === "mission" && studentMissionManualList && (
        <CreateForeignMission
          courseMissionManualList={studentMissionManualList.data}
          refetchCourseMissionManualList={refetchStudentMissionManualList}
          classId={Number(params.id)}
        />
      )}
      {/* Students List Section */}
      {activeTab.id === "students" && StudentData && (
        <StudentList
          data={StudentData}
          currentPage={currentPageStudent}
          onPageChange={(page) => setCurrentPageStudent(page)}
        />
      )}

      {/* Teacher List Section */}
      {activeTab.id === "teacher" && classData && (
        <TeacherList data={classData.data[0]} />
      )}

      {/* Info */}
      {activeTab.id === "info" && classData && (
        <div className="p-6 flex gap-4">
          <Image
            alt="course Image"
            src={
              classData.data[0].course?.thumbnail || "/placeholder-image.jpg"
            }
            width={400}
            height={300}
            className=" object-cover rounded-xl border border-gray-20"
          />
          <div className="flex flex-col gap-2">
            <span className="text-SubheadLg text-gray-95">
              {classData.data[0].course?.name}
            </span>
            <span className="text-BodyMd text-gray-95">
              {classData.data[0].course?.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
