"use client";

import { useState } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { Plus, UserPlus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CourseMission } from "@/types/course";
import { AddItemDialog } from "@/components/admin/dialogs/add-item-dialog";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Mission } from "@/types/mission";
import { CommonButton } from "../common/button/CommonButton";
import { CreateMissionDialog } from "./create-mission-dialog";
import { Input } from "../common/Input";
import { SelectStudentListDialog } from "./SelectStudentListDialog";

interface CreateForeignMissionProps {
  courseMissionManualList: Mission[];
  refetchCourseMissionManualList: () => void;
  classId: number;
}

export const CreateForeignMission = ({
  courseMissionManualList,
  refetchCourseMissionManualList,
  classId,
}: CreateForeignMissionProps) => {
  // State for table pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
  const [limit, setLimit] = useState(10);

  // State for dialogs
  const [showStudentListDialog, setShowStudentListDialog] = useState(false);
  const [isCreateMissionDialogOpen, setIsCreateMissionDialogOpen] =
    useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Store hooks
  const [showLoading, hideLoading] = useLoadingStore((state) => [
    state.show,
    state.hide,
  ]);
  const [showError, showSuccess] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);

  // Handlers
  const handleAddStudents = (data: string[]) => {
    if (data.length === 0) {
      showError("Lỗi", "Vui lòng chọn ít nhất một học viên");
      return;
    }
    showLoading("Đang thêm học viên...");
    // TODO: Implement addStudentMutation
    // addStudentMutation(data);
    hideLoading();
  };

  const handleCreateMission = async (data: any) => {
    try {
      showLoading("Đang tạo nhiệm vụ...");
      // TODO: Implement create mission API call
      await refetchCourseMissionManualList();
      showSuccess("Thành công", "Tạo nhiệm vụ thành công");
    } catch (error) {
      showError("Lỗi", "Có lỗi xảy ra khi tạo nhiệm vụ");
    } finally {
      hideLoading();
      setIsCreateMissionDialogOpen(false);
    }
  };

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
      cell: ({ row }) => <span>{row.original.description}</span>,
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

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Tìm kiếm nhiệm vụ"
            type="text"
            customClassNames="w-[320px]"
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
          data={classMissionManualList}
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
      <SelectStudentListDialog
        title="Học viên hoàn thành nhiệm vụ"
        isOpen={showStudentListDialog}
        openDialogClick={setShowStudentListDialog}
        closeDialogClick={() => setShowStudentListDialog(false)}
        handleAddStudent={() => {}}
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
