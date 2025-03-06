"use client";

import { ArrowLeft, ArrowDown, ArrowUp, PanelLeft } from "lucide-react";
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";

export default function SessionDetailPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const router = useCustomRouter();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const queryClient = useQueryClient();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  /* UseStore */
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  const { data: studentAttendance } = useQuery({
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
      setAttendanceData(studentAttendance.data);
      setIsReadOnly(true); // Set readonly if we have existing data
    } else if (studentList?.data) {
      // Create mock data from student list if no attendance data exists
      const mockData = studentList.data.map((student: any) => ({
        id: null,
        student: student.student,
        attendance: false,
        discuss: false,
        homeworkDone: false,
        workSpeed: false,
        class_session: params.sessionId,
      }));
      setAttendanceData(mockData);
      setIsReadOnly(false);
    }
  }, [studentAttendance, studentList, params.sessionId]);

  const handleCheckboxChange = (index: number, field: string) => {
    if (isReadOnly) return; // Prevent changes if readonly
    setAttendanceData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: !newData[index][field],
      };
      return newData;
    });
  };

  const handleSaveConfirm = async () => {
    try {
      // First, update class session status if there are new records
      const hasNewRecords = attendanceData.some((record) => record.id === null);
      if (hasNewRecords) {
        await updateClassSessionMutation.mutateAsync();
      }

      // Then handle attendance records
      const promises = attendanceData.map((record) => {
        if (record.id === null) {
          return createAttendanceMutation.mutateAsync({
            data: {
              student: record.student.id,
              class_session: params.sessionId,
              attendance: record.attendance,
              discuss: record.discuss,
              homeworkDone: record.homeworkDone,
              workSpeed: record.workSpeed,
            },
          });
        }
      });

      await Promise.all(promises);
      success("Xong", "Đã lưu dữ liệu điểm danh");
      setIsConfirmOpen(false);
    } catch (err) {
      console.error("Error saving attendance:", err);
      error("Lỗi", "Có lỗi xảy ra khi lưu dữ liệu điểm danh");
    }
  };

  return (
    <>
      <div className="">
        <div className="flex items-center gap-4 p-4 border-b">
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
            <div className="text-SubheadLg text-gray-95">Buổi 1</div>
          </div>
          {!isReadOnly && (
            <CommonButton
              onClick={() => setIsConfirmOpen(true)}
              className="ml-auto h-9 w-[58px]"
            >
              Lưu
            </CommonButton>
          )}
        </div>

        <div className="space-y-6 p-4">
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-20">
            <table className="w-full rounded-lg">
              <thead>
                <tr className="text-SubheadSm text-gray-95">
                  <th className="py-4 text-center cursor-pointer select-none">
                    <div className="flex items-center gap-2 text-SubheadSm text-gray-95 justify-center">
                      STT
                      {sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-SubheadSm text-gray-95">
                    Tên học viên
                  </th>
                  <th className="py-4 px-6 text-left text-SubheadSm text-gray-95">
                    Mã học viên
                  </th>
                  <th className="py-4 px-6 text-center text-SubheadSm text-gray-95">
                    Điểm danh
                  </th>
                  <th className="py-4 px-6 text-center text-SubheadSm text-gray-95">
                    Phát biểu
                  </th>
                  <th className="py-4 px-6 text-center text-SubheadSm text-gray-95">
                    Bài tập
                  </th>
                  <th className="py-4 px-6 text-center text-SubheadSm text-gray-95">
                    Tốc độ
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((item, index) => (
                  <tr
                    key={item.student?.id || index}
                    className="border-t border-gray-100"
                  >
                    <td className="py-4 px-6 text-BodySm text-gray-95 text-right">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 text-BodySm text-gray-95 ">
                      {item.student?.fullName}
                    </td>
                    <td className="py-4 px-6 text-BodySm text-gray-95">
                      {item.student?.id}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={item.attendance}
                        onChange={() =>
                          handleCheckboxChange(index, "attendance")
                        }
                        disabled={isReadOnly}
                        className="w-4 h-4 accent-primary-50 rounded border-gray-300 disabled:opacity-50"
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={item.discuss}
                        onChange={() => handleCheckboxChange(index, "discuss")}
                        disabled={isReadOnly}
                        className="w-4 h-4 accent-primary-50 rounded border-gray-300 disabled:opacity-50"
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={item.homeworkDone}
                        onChange={() =>
                          handleCheckboxChange(index, "homeworkDone")
                        }
                        disabled={isReadOnly}
                        className="w-4 h-4 accent-primary-50 rounded border-gray-300 disabled:opacity-50"
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={item.workSpeed}
                        onChange={() =>
                          handleCheckboxChange(index, "workSpeed")
                        }
                        disabled={isReadOnly}
                        className="w-4 h-4 accent-primary-50 rounded border-gray-300 disabled:opacity-50"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
