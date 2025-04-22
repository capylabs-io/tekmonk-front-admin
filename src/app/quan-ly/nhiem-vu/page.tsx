"use client";

import { Edit, PanelLeft } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { getMission } from "@/requests/mission";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Tabs } from "@/components/new/tabs";
import { useMission } from "@/hooks/useMission";
import { Mission } from "@/types/mission";
import { Input } from "@/components/common/Input";
import { CreateMissionDialog } from "@/components/class/create-mission-dialog";
import { StudentListDialog } from "@/components/admin/dialogs/student-list-dialog";
import { ReqGetUsersAchievedMission } from "@/requests/user";
import { CommonButton } from "@/components/common/button/CommonButton";

export default function Page() {
  const {
    totalPage,
    totalDocs,
    limit,
    page,
    isOpenCreateModal,
    setLimit,
    setPage,
    setIsOpenCreateModal,
  } = useMission();
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

  // Dialog states
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] =
    useState(false);

  const { data: missionList, refetch: refetchMissionList } = useQuery({
    queryKey: [
      "missionList",
      activeTab.id,
      currentPage,
      itemsPerPage,
      searchQuery,
    ],
    queryFn: async () => {
      try {
        const filters = {
          type: activeTab.id,
        };

        // Only add search filter if searchQuery is not empty
        if (searchQuery) {
          Object.assign(filters, {
            $or: [
              {
                title: {
                  $containsi: searchQuery,
                },
              },
              {
                description: {
                  $containsi: searchQuery,
                },
              },
            ],
          });
        }

        const queryString = qs.stringify({
          filters,
          populate: ["class", "teacher"],
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
          },
        });
        return await getMission(queryString);
      } catch (error) {
        console.log("error when fetching mission list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

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

  const handleViewStudents = (mission: Mission) => {
    setSelectedMission(mission);
    setIsViewStudentsDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    refetchMissionList();
    setIsOpenEditModal(false);
    setSelectedMission(null);
  };

  const handleCreateSuccess = () => {
    refetchMissionList();
    setIsOpenCreateModal(false);
  };

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
      cell: ({ row }) => <div>{row.original.type}</div>,
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
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
          onSubmit={handleCreateSuccess}
          classId={0} // Default class ID, you might want to change this
        />
      )}

      {isOpenEditModal && selectedMission && (
        <CreateMissionDialog
          open={isOpenEditModal}
          onOpenChange={setIsOpenEditModal}
          onSubmit={handleUpdateSuccess}
          classId={selectedMission.class?.id || 0}
          mission={selectedMission}
        />
      )}

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
