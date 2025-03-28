"use client";

import { useState, useEffect } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { UserPlus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AddItemDialog } from "@/components/admin/dialogs/add-item-dialog";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Mission } from "@/types/mission";
import { CommonButton } from "../common/button/CommonButton";
import { CreateMissionDialog } from "./create-mission-dialog";
import { Input } from "../common/Input";
import { useClassStore } from "@/store/class-store";
import { useQuery } from "@tanstack/react-query";
import { ReqGetUserHaveNotAchievedMission } from "@/requests/user";
import qs from "qs";
import { ReqCreateMissionHistory } from "@/requests/mission-history";

interface CreateMissionProps {
  courseMissionManualList: Mission[];
  refetchCourseMissionManualList: () => void;
  classId: number;
}

export const CreateMission = ({
  courseMissionManualList,
  refetchCourseMissionManualList,
  classId,
}: CreateMissionProps) => {
  // State for table pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Calculate total pages based on data length
  const totalDocs = courseMissionManualList?.length || 0;
  const totalPage = Math.ceil(totalDocs / limit);

  // State for dialogs
  const [showStudentListDialog, setShowStudentListDialog] = useState(false);
  const [isCreateMissionDialogOpen, setIsCreateMissionDialogOpen] =
    useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Students dialog state
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [studentItemsPerPage, setStudentItemsPerPage] = useState(2);

  // Store hooks
  const [showLoading, hideLoading] = useLoadingStore((state) => [
    state.show,
    state.hide,
  ]);
  const [showError, showSuccess] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);

  // Student data fetching
  const { data: studentList } = useQuery({
    queryKey: ["studentList", studentCurrentPage, studentItemsPerPage, classId],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          mission: selectedMission?.id,
          page: studentCurrentPage,
          pageSize: studentItemsPerPage,
        });
        return await ReqGetUserHaveNotAchievedMission(queryString);
      } catch (error) {
        console.log("error when fetching student list", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    enabled: showStudentListDialog, // Only fetch when dialog is open
  });

  // Reset selected students when dialog closes
  useEffect(() => {
    if (!showStudentListDialog) {
      setSelectedStudents([]);
    }
  }, [showStudentListDialog]);

  // Handlers
  const handleAddStudents = () => {
    try {
      if (selectedStudents.length === 0) {
        showError("Lỗi", "Vui lòng chọn ít nhất một học viên");
        return;
      }
      showLoading("Đang thêm học viên...");

      // Handle call api to create mission history with each student
      selectedStudents.forEach(async (studentId) => {
        await ReqCreateMissionHistory({
          data: {
            mission: selectedMission?.id,
            user: Number(studentId),
          },
        });
      });

      showSuccess("Thành công", "Đã thêm học viên hoàn thành nhiệm vụ");
      setShowStudentListDialog(false);
    } catch (error) {
      showError("Lỗi", "Có lỗi xảy ra khi thêm học viên");
    } finally {
      hideLoading();
    }
  };

  const handleCreateMission = async (data: any) => {
    try {
      showLoading("Đang tạo nhiệm vụ...");
      await refetchCourseMissionManualList();
      showSuccess("Thành công", "Tạo nhiệm vụ thành công");
    } catch (error) {
      showError("Lỗi", "Có lỗi xảy ra khi tạo nhiệm vụ");
    } finally {
      hideLoading();
      setIsCreateMissionDialogOpen(false);
    }
  };

  // UseQuery

  const columnsMission: ColumnDef<Mission>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Icon",
      cell: ({ row }) => (
        <div
          className="bg-center bg-no-repeat bg-cover h-[80px] rounded-xl w-[130px]"
          style={{
            backgroundImage: `url(${row.original?.imageUrl})`,
          }}
        ></div>
      ),
    },
    {
      header: "Tên nhiệm vụ",
      cell: ({ row }) => <span>{row.original.title}</span>,
    },
    {
      header: "Mô tả",
      cell: ({ row }) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.original.description || "",
          }}
        />
      ),
    },
    {
      header: "Số học viên đạt được",
      cell: ({ row }) => <span>{row.original.numberOfUserAchieved}</span>,
    },
    {
      header: "Loại",
      cell: ({ row }) => <span>{row.original.type}</span>,
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => {
            setSelectedMission(row.original);
            setShowStudentListDialog(true);
          }}
        >
          <UserPlus className="h-4 w-4" color="#7C6C80" />
        </button>
      ),
    },
  ];

  const classMissionManualList = courseMissionManualList.filter(
    (item) => item.type === "Manual"
  );

  // Apply pagination to the mission list
  const paginatedMissionList = classMissionManualList.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Tìm kiếm nhiệm vụ"
            type="text"
            customClassNames="max-w-[320px]"
            isSearch
          />
          <CommonButton
            onClick={() => setIsCreateMissionDialogOpen(true)}
            className=""
            variant="secondary"
          >
            Thêm nhiệm vụ
          </CommonButton>
        </div>

        <CommonTable
          data={paginatedMissionList}
          isLoading={false}
          columns={columnsMission}
          page={page}
          totalPage={totalPage}
          totalDocs={totalDocs}
          onPageChange={setPage}
          docsPerPage={limit}
          onPageSizeChange={setLimit}
        />
      </div>

      {/* Dialogs */}
      <AddItemDialog
        open={showStudentListDialog}
        onOpenChange={setShowStudentListDialog}
        title="Học viên hoàn thành nhiệm vụ"
        items={studentList?.data || []}
        selectedItems={selectedStudents}
        setSelectedItems={setSelectedStudents}
        searchPlaceholder="Tìm kiếm học viên"
        nameKey="username"
        descriptionKey="email"
        onSubmit={handleAddStudents}
        onCancel={() => setShowStudentListDialog(false)}
        totalItems={studentList?.meta?.pagination?.total || 0}
        currentPage={studentCurrentPage}
        itemsPerPage={studentItemsPerPage}
        onPageChange={setStudentCurrentPage}
        onItemsPerPageChange={setStudentItemsPerPage}
        showSelectedTags={false}
      />

      <CreateMissionDialog
        open={isCreateMissionDialogOpen}
        onOpenChange={setIsCreateMissionDialogOpen}
        onSubmit={handleCreateMission}
        classId={classId}
      />
    </>
  );
};
