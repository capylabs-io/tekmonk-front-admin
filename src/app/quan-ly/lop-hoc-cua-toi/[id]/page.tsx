"use client";
import StudentList from "@/components/admin/student-list";
import { TeacherList } from "@/components/admin/teacher-list";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonRadioCheck } from "@/components/common/CommonRadioCheck";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { cn } from "@/lib/utils";
import { ReqGetClasses } from "@/requests/class";
import { ReqGetClassSessions } from "@/requests/class-session";
import { ReqGetEnrollments } from "@/requests/enrollment";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, PanelLeft } from "lucide-react";
import qs from "qs";
import { useState } from "react";

export default function ClassDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useCustomRouter();
  const [activeTab, setActiveTab] = useState("progress");

  const [currentPageStudent, setCurrentPageStudent] = useState(1);

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

  const handleSessionClick = (sessionId: number) => {
    // Get current path and append session route
    const currentPath = window.location.pathname;
    router.push(`${currentPath}/${sessionId}`);
  };

  return (
    <div className="">
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
      <div className="flex gap-4 border-b border-gray-20 h-9">
        {[
          { id: "progress", label: "Tiến trình" },
          { id: "students", label: "Danh sách học viên" },
          { id: "teacher", label: "Giảng viên" },
          { id: "info", label: "Thông tin khóa học" },
        ].map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "px-5 py-1 cursor-pointer text-SubheadSm",
              activeTab === tab.id
                ? "text-gray-95 border-b-4 border-primary-60"
                : "text-gray-50"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content Section */}
      {activeTab === "progress" && (
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

      {/* Students List Section */}
      {activeTab === "students" && StudentData && (
        <StudentList
          data={StudentData}
          currentPage={currentPageStudent}
          onPageChange={(page) => setCurrentPageStudent(page)}
        />
      )}

      {/* Teacher List Section */}
      {activeTab === "teacher" && classData && (
        <TeacherList data={classData.data[0]} />
      )}
    </div>
  );
}
