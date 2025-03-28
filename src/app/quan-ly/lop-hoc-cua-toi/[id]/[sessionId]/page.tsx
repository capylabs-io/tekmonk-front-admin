"use client";

import { ArrowLeft, PanelLeft } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { CommonButton } from "@/components/common/button/CommonButton";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { CommonCard } from "@/components/common/CommonCard";
import { ReqGetClassSessionDetail } from "@/requests/class-session-detail";
import qs from "qs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReqGetEnrollments } from "@/requests/enrollment";
import tekdojoAxios from "@/requests/axios.config";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { ReqUpdateClassSession } from "@/requests/class-session";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ReqGetCourseMissions } from "@/requests/course-mission";
import { useClassStore } from "@/store/class-store";
import { get } from "lodash";
import { CommonTable } from "@/components/common/CommonTable";
import { useLoadingStore } from "@/store/LoadingStore";
import { getMission } from "@/requests/mission";

export default function SessionDetailPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [initialAttendanceData, setInitialAttendanceData] = useState<any[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentClass] = useClassStore((state) => [state.currentClass]);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  /* UseStore */
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [showLoading, hideLoading] = useLoadingStore((state) => [
    state.show,
    state.hide,
  ]);

  const { data: studentAttendance, refetch: refetchStudentAttendance } =
    useQuery({
      queryKey: ["student-attendance", params.sessionId],
      queryFn: async () => {
        try {
          const queryString = qs.stringify({
            filters: {
              class_session: {
                id: {
                  $eq: params.sessionId,
                },
              },
            },
            populate: "*",
          });
          return await ReqGetClassSessionDetail(queryString);
        } catch (error) {
          console.log(error);
          return { data: [] };
        }
      },
      refetchOnWindowFocus: false,
    });

  const { data: studentList } = useQuery({
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
        console.log("Error fetching student list:", error);
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
  });
  const { data: everySessionMission } = useQuery({
    queryKey: ["course-mission", get(currentClass, ["course", "id"], 0)],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            type: {
              $eq: "EverySession",
            },
          },
        });
        return await getMission(queryString);
      } catch (error) {
        console.log("Error fetching course mission list:", error);
        return { data: [] };
      }
    },
    refetchOnWindowFocus: false,
  });
  // Create mutation for creating new attendance records
  const createAttendanceMutation = useMutation({
    mutationFn: async (data: any) => {
      return await tekdojoAxios.post("/class-session-student-details", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-attendance", params.sessionId],
      });
    },
  });
  const classMissionList = useMemo(() => {
    if (!everySessionMission) {
      return [];
    }
    return everySessionMission.data.filter(
      (item) => item.type === "EverySession"
    );
  }, [everySessionMission]);

  // Add updateClassSession mutation
  const updateClassSessionMutation = useMutation({
    mutationFn: async () => {
      return await ReqUpdateClassSession(params.sessionId, {
        data: {
          status: "done",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-session", params.sessionId],
      });
    },
  });

  // Initialize attendance data and check if should be readonly
  useEffect(() => {
    if (studentAttendance?.data && studentAttendance.data.length > 0) {
      // Merge attendance records by student.id
      const mergedAttendance = studentAttendance.data.reduce((acc, record) => {
        const studentId = record.student?.id;
        const existingRecord = acc.find(
          (item) => item.student.id === studentId
        );

        const missionKey = `mission${record.mission?.id}`;

        // If the mission exists in the record, mark it as checked and disabled
        const missionStatus = record.mission
          ? {
              [missionKey]: true,
              [`${missionKey}_disable`]: true,
            }
          : {};

        if (existingRecord) {
          // Merge missions into the existing record
          Object.assign(existingRecord, missionStatus);
        } else {
          // Create a new record with mission data
          acc.push({
            id: record.id,
            student: record.student,
            class_session: record.class_session,
            ...missionStatus,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          });
        }

        return acc;
      }, [] as any[]);

      // Get the list of student IDs from backend records
      const recordedStudentIds = mergedAttendance.map(
        (record) => record.student?.id
      );

      // If we have a student list, find students that aren't in the attendance records
      if (studentList?.data) {
        // Filter student list to get students not already in attendance records
        const missingStudents = studentList.data
          .filter(
            (student: any) => !recordedStudentIds.includes(student.student?.id)
          )
          .map((student: any) => ({
            id: null,
            student: student.student,
            class_session: params.sessionId,
            // Initialize all missions as unchecked and enabled for new students
            ...classMissionList.reduce((acc, mission) => {
              const missionKey = `mission${mission.id}`;
              return {
                ...acc,
                [missionKey]: false,
                [`${missionKey}_disable`]: false,
              };
            }, {}),
          }));

        // Combine recorded attendance with missing students
        const combinedData = [...mergedAttendance, ...missingStudents];

        setAttendanceData(combinedData);
        setInitialAttendanceData(JSON.parse(JSON.stringify(combinedData)));
      } else {
        setAttendanceData(mergedAttendance);
        setInitialAttendanceData(JSON.parse(JSON.stringify(mergedAttendance)));
      }
    } else if (studentList?.data) {
      // If no attendance data exists, create mock data from student list
      const mockData = studentList.data.map((student: any) => ({
        id: null,
        student: student.student,
        class_session: params.sessionId,
        // Initialize all missions as unchecked and enabled
        ...classMissionList.reduce((acc, mission) => {
          const missionKey = `mission${mission.id}`;
          return {
            ...acc,
            [missionKey]: false,
            [`${missionKey}_disable`]: false,
          };
        }, {}),
      }));

      setAttendanceData(mockData);
      setInitialAttendanceData(JSON.parse(JSON.stringify(mockData)));
    }
  }, [studentAttendance, studentList, params.sessionId, classMissionList]);

  // Function to check if a checkbox should be disabled
  const isCheckboxDisabled = (index: number, field: string) => {
    // Check if the specific mission is disabled in both current and initial data
    return (
      initialAttendanceData[index]?.[`${field}_disable`] === true ||
      attendanceData[index]?.[`${field}_disable`] === true
    );
  };

  const handleCheckboxChange = (index: number, field: string) => {
    // If checkbox is disabled for this specific mission, don't allow changes
    if (isCheckboxDisabled(index, field)) {
      return;
    }

    setAttendanceData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: !newData[index][field], // Toggle the checkbox
      };
      return newData;
    });

    setHasChanges(true);
  };

  const handleSaveConfirm = async () => {
    try {
      showLoading();
      // First, update class session status if there are new records
      const hasNewRecords = attendanceData.some((record) => record.id === null);
      if (hasNewRecords) {
        await updateClassSessionMutation.mutateAsync();
      }

      // Get all checkbox changes that need to be saved
      const newRecordsPromises = [];

      // Process each record
      for (const record of attendanceData) {
        // Get mission keys that are checked
        const checkedMissions = Object.keys(record).filter(
          (key) =>
            key.startsWith("mission") &&
            !key.includes("_disable") &&
            record[key] === true
        );

        // For each checked mission, determine if it's new and needs to be created
        for (const missionKey of checkedMissions) {
          // Skip if this mission is already in the database (has disable flag)
          if (record[`${missionKey}_disable`] === true) {
            continue;
          }

          // This is a new checked mission, create it
          const missionId = parseInt(missionKey.replace("mission", ""), 10);
          newRecordsPromises.push(
            createAttendanceMutation.mutateAsync({
              data: {
                student: record.student.id,
                class_session: params.sessionId,
                mission: missionId,
              },
            })
          );
        }
      }

      // Wait for all create operations to complete
      if (newRecordsPromises.length > 0) {
        await Promise.all(newRecordsPromises);
      }

      success("Xong", "Đã lưu dữ liệu điểm danh");
      setIsConfirmOpen(false);
      setHasChanges(false);

      // Update the initial data to match the current data after saving
      setInitialAttendanceData(JSON.parse(JSON.stringify(attendanceData)));

      // Refresh the data from the server to ensure we have the latest state
      queryClient.invalidateQueries({
        queryKey: ["student-attendance", params.sessionId],
      });

      // Refetch to get updated data
      refetchStudentAttendance();
    } catch (err) {
      console.error("Error saving attendance:", err);
      error("Lỗi", "Có lỗi xảy ra khi lưu dữ liệu điểm danh");
    } finally {
      hideLoading();
    }
  };
  const missionColumns: ColumnDef<any>[] = useMemo(() => {
    return classMissionList
      .map((item) => {
        if (!item.id) return null;
        const title = "mission" + item.id;
        return {
          header: item.title || "Nhiệm vụ",
          cell: ({ row }: { row: any }) => (
            <span>
              <input
                type="checkbox"
                checked={!!row.original[title]}
                onChange={() => handleCheckboxChange(row.index, title)}
                disabled={isCheckboxDisabled(row.index, title)}
                className="w-4 h-4 accent-primary-50 rounded border-gray-300 disabled:opacity-50"
              />
            </span>
          ),
        };
      })
      .filter(Boolean) as ColumnDef<any>[];
  }, [classMissionList, handleCheckboxChange, isCheckboxDisabled]);
  // console.log('classMissionList', classMissionList);
  // Base columns
  const baseColumns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Tên học viên",
      cell: ({ row }) => <span>{row.original.student?.fullName}</span>,
    },
    {
      header: "Mã học viên",
      cell: ({ row }) => <span>{row.original.student?.id}</span>,
    },
  ];

  // Combine base columns with dynamic mission columns
  const columns = useMemo(() => {
    return [...baseColumns, ...missionColumns];
  }, [missionColumns]);
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center justify-center">
            <CommonCard
              size="small"
              className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
            >
              <PanelLeft width={17} height={17} />
            </CommonCard>
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-70" />
            </button>
            <div className="text-SubheadLg text-gray-95">
              Thông tin buổi học
            </div>
          </div>
          <CommonButton
            onClick={() => setIsConfirmOpen(true)}
            className="ml-auto h-9 w-[58px]"
            disabled={!hasChanges}
          >
            Lưu
          </CommonButton>
        </div>

        <div className="space-y-6 p-4">
          <CommonTable
            data={attendanceData || ([] as any[])}
            isLoading={false}
            columns={[...columns]}
            page={page}
            totalPage={totalPage}
            totalDocs={totalDocs}
            onPageChange={setPage}
            docsPerPage={limit}
            onPageSizeChange={setLimit}
          />
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="w-[480px] bg-white">
          <DialogHeader>
            <DialogTitle>Xác nhận lưu điểm danh</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn lưu thông tin điểm danh này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <CommonButton
              variant="secondary"
              onClick={() => setIsConfirmOpen(false)}
            >
              Hủy
            </CommonButton>
            <CommonButton onClick={handleSaveConfirm}>Xác nhận</CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
