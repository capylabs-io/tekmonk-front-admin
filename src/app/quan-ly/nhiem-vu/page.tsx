"use client";

import { Edit, PanelLeft, UserPlus } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { getMission, postMission, updateMission } from "@/requests/mission";
import { useMutation, useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Tabs } from "@/components/new/tabs";
import { useMission } from "@/hooks/useMission";
import { Mission, MissionType, MissionTypeToText } from "@/types/mission";
import { Input } from "@/components/common/Input";
import { CreateMissionDialog } from "@/components/class/create-mission-dialog";
import { StudentListDialog } from "@/components/admin/dialogs/student-list-dialog";
import {
  ReqGetUsersAchievedMission,
  ReqGetUserHaveNotAchievedMission,
} from "@/requests/user";
import { CommonButton } from "@/components/common/button/CommonButton";
import { MissionFormData } from "@/validation/mission";
import { useMissionQuery } from "@/queries/mission-query";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { AddItemDialog } from "@/components/admin/dialogs/add-item-dialog";
import { ReqCreateMissionHistory } from "@/requests/mission-history";

export default function Page() {
  const { setIsOpenCreateModal, isOpenCreateModal } = useMission();
  const tabs = [
    { id: "EverySession", label: "Thuộc hệ thống" },
    { id: "Manual", label: "Cấu hình ngoài" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const handleUserSearchChange = async (value: string) => {
    setStudentCurrentPage(1);
    setUserSearchQuery(value);
  };

  // Dialog states
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] =
    useState(false);
  const [showStudentListDialog, setShowStudentListDialog] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [studentItemsPerPage, setStudentItemsPerPage] = useState(10);

  const { data: missionList, refetch: refetchMissionList } = useMissionQuery(
    activeTab,
    currentPage,
    itemsPerPage,
    searchQuery
  );

  const { data: studentList } = useQuery({
    queryKey: [
      "studentList",
      studentCurrentPage,
      studentItemsPerPage,
      selectedMission?.id,
      userSearchQuery,
    ],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          mission: selectedMission?.id,
          page: studentCurrentPage,
          pageSize: studentItemsPerPage,
          search: userSearchQuery,
        });
        return await ReqGetUserHaveNotAchievedMission(queryString);
      } catch (error) {
        console.log("error when fetching student list", error);
      }
    },
    enabled: showStudentListDialog && !!selectedMission,
  });

  const [showSuccess, showError] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    refetchMissionList();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEdit = (mission: Mission) => {
    // Only allow editing missions with type "Manual"
    if (mission.type === "Manual") {
      setSelectedMission(mission);
      setIsOpenEditModal(true);
    } else {
      console.log("Cannot edit system missions");
    }
  };

  const handleOpenStudentList = (mission: Mission) => {
    setSelectedMission(mission);
    setShowStudentListDialog(true);
  };

  const addStudentsMutation = useMutation({
    mutationFn: async ({
      missionId,
      studentIds,
    }: {
      missionId: string;
      studentIds: string[];
    }) => {
      const promises = studentIds.map(async (id) => {
        return await ReqCreateMissionHistory({
          data: {
            user: id,
            mission: missionId,
          },
        });
      });

      return await Promise.all(promises);
    },
    onSuccess: () => {
      showSuccess("Thành công", "Thêm học viên thành công!");
      setShowStudentListDialog(false);
      setSelectedStudents([]);
      refetchMissionList();
    },
    onError: (err) => {
      console.error("Error adding students:", err);
      showError("Lỗi", "Có lỗi xảy ra khi thêm học viên");
    },
  });

  const handleAddStudents = async () => {
    if (!selectedMission) return;
    try {
      await addStudentsMutation.mutateAsync({
        missionId: String(selectedMission.id),
        studentIds: selectedStudents.map((student) => student),
      });
    } catch (err) {
      console.error("Error in handleAddStudents:", err);
    }
  };

  const createMissionMutation = useMutation({
    mutationFn: async (data: MissionFormData) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("type", data.type);
      if (data.type === MissionType.EVERY_SESSION) {
        formData.append("actionType", data.actionType || "");
      }
      formData.append("reward", data.reward?.toString() || "");
      formData.append("points", data.points?.toString() || "");
      if (data.class || data.class !== 0) {
        formData.append("class", data.class?.toString() || "");
      }

      if (data.type === MissionType.EVERY_SESSION && data.requiredQuantity) {
        formData.append("requiredQuantity", data.requiredQuantity.toString());
      }

      if (data.imageUrl instanceof File) {
        formData.append("image", data.imageUrl);
      } else if (
        selectedMission?.imageUrl &&
        typeof data.imageUrl === "string"
      ) {
        formData.append("imageUrl", selectedMission.imageUrl);
      }
      if (selectedMission) {
        return await updateMission(selectedMission.id, formData);
      } else {
        return await postMission(formData);
      }
    },
    onSuccess: () => {
      showSuccess("Thành công", "Tạo nhiệm vụ thành công");
    },
    onError: (error) => {
      console.error("Error details:", error);
      showError("Lỗi", "Có lỗi xảy ra khi tạo nhiệm vụ");
    },
    onSettled: () => {
      refetchMissionList();
      setIsOpenCreateModal(false);
      setIsOpenEditModal(false);
    },
  });

  const columns: ColumnDef<Mission>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
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
      header: "Loại",
      cell: ({ row }) => (
        <div>
          {
            MissionTypeToText[
              row.original.type as keyof typeof MissionTypeToText
            ]
          }
        </div>
      ),
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => handleOpenStudentList(row.original)}
            >
              {row.original.type === "Manual" ? (
                <UserPlus className="h-4 w-4" color="#7C6C80" />
              ) : (
                <></>
              )}
            </button>
            <button
              className={`p-2 hover:bg-gray-100 rounded-full ${
                row.original.type !== "Manual"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
              disabled={row.original.type !== "Manual"}
              title={
                row.original.type !== "Manual"
                  ? "Không thể chỉnh sửa nhiệm vụ thuộc hệ thống"
                  : "Chỉnh sửa nhiệm vụ"
              }
            >
              <Edit className="h-4 w-4" color="#7C6C80" />
            </button>
            {/* <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleViewStudents(row.original);
              }}
              title="Xem danh sách học viên đã đạt được nhiệm vụ này"
            >
              <UserRoundSearch className="h-4 w-4" color="#7C6C80" />
            </button> */}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full border-gray-20 overflow-hidden flex flex-col gap-y-4 border">
        <div className="w-full h-[68px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 border-b border-gray-20">
          <div className="text-SubheadLg text-gray-95 mb-2 sm:mb-0 flex items-center justify-center gap-2">
            <CommonCard
              size="small"
              className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
            >
              <PanelLeft width={17} height={17} />
            </CommonCard>
            Nhiệm vụ
          </div>
          <CommonButton
            className="h-10"
            onClick={() => setIsOpenCreateModal(true)}
          >
            Tạo mới
          </CommonButton>
        </div>
        <div className="flex items-center gap-x-4 border-b border-gray-20">
          <Tabs
            tabs={tabs}
            currentTab={activeTab}
            setCurrentTab={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset to first page when changing tabs
            }}
            className="w-[265px] space-x-4"
          />
        </div>
        <div className="flex flex-col gap-y-4 px-4 !h-[calc(100vh-68px-36px-40px-16px)]">
          <Input
            type="text"
            placeholder="Tìm kiếm"
            customClassNames="max-w-[320px]"
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            isSearch={true}
            onKeyDown={handleKeyPress}
          />

          {missionList && (
            <CommonTable
              data={missionList.data}
              isLoading={false}
              columns={columns}
              page={currentPage}
              totalPage={missionList.meta.pagination.pageCount}
              totalDocs={missionList.meta.pagination.total}
              onPageChange={setCurrentPage}
              docsPerPage={itemsPerPage}
              onPageSizeChange={setItemPerPage}
              customTableClassname="!h-[calc(100%-50px)]"
            />
          )}
        </div>
      </div>

      {isOpenCreateModal && (
        <CreateMissionDialog
          open={isOpenCreateModal}
          onOpenChange={setIsOpenCreateModal}
          onSubmit={createMissionMutation.mutate}
          classId={0} // Default class ID, you might want to change this
        />
      )}

      {isOpenEditModal && selectedMission && (
        <CreateMissionDialog
          open={isOpenEditModal}
          onOpenChange={setIsOpenEditModal}
          onSubmit={createMissionMutation.mutate}
          classId={selectedMission.class?.id || 0}
          mission={selectedMission}
        />
      )}

      <AddItemDialog
        open={showStudentListDialog}
        onOpenChange={setShowStudentListDialog}
        title="Học viên chưa hoàn thành nhiệm vụ"
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
        onSearchChange={handleUserSearchChange}
      />

      {/* View students who have achieved this mission */}
      {isViewStudentsDialogOpen && (
        <StudentListDialog
          open={isViewStudentsDialogOpen}
          onOpenChange={setIsViewStudentsDialogOpen}
          title="Danh sách học viên đã đạt được nhiệm vụ"
          mission={selectedMission}
          queryFn={ReqGetUsersAchievedMission}
          queryKey="achievedMission"
        />
      )}
    </>
  );
}
