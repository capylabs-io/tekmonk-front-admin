"use client";

import { PanelLeft, UserPlus, Edit, UserRoundSearch } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { CreateAchievementDialog } from "@/components/achievement/CreateAchievementModal";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import qs from "qs";
import { Tabs } from "@/components/new/tabs";
import { Mission } from "@/types/mission";
import {
  ReqGetAllAchievement,
  ReqCreateAchievement,
  ReqUpdateAchievement,
} from "@/requests/achievement";
import { Input } from "@/components/common/Input";
import { CommonButton } from "@/components/common/button/CommonButton";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { AddItemDialog } from "@/components/admin/dialogs/add-item-dialog";
import { ReqGetUserHaveAchievedAchievement } from "@/requests/user";
import {
  ReqCreateAchievementHistory,
  ReqGetAchievementHistory,
} from "@/requests/achievement-history";
import { StudentListDialog } from "@/components/admin/dialogs/student-list-dialog";
import { AchievementType, TAchievement } from "@/types/achievement";
import { AchievementFormData } from "@/validation/achievement";

export default function Page() {
  const tabs = [
    { id: "Auto", label: "Thuộc hệ thống" },
    { id: "Manual", label: "Cấu hình ngoài" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showStudentListDialog, setShowStudentListDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<TAchievement | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [studentItemsPerPage, setStudentItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [isViewStudentsDialogOpen, setIsViewStudentsDialogOpen] =
    useState(false);

  const { data: achievementList, refetch: refetchAchievementList } = useQuery({
    queryKey: [
      "achievementList",
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
        return await ReqGetAllAchievement(queryString);
      } catch (error) {
        console.log("error when fetching achievement list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: studentList } = useQuery({
    queryKey: [
      "studentList",
      studentCurrentPage,
      studentItemsPerPage,
      selectedAchievement?.id,
    ],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          achievement: selectedAchievement?.id,
          page: studentCurrentPage,
          pageSize: studentItemsPerPage,
        });
        return await ReqGetUserHaveAchievedAchievement(queryString);
      } catch (error) {
        console.log("error when fetching student list", error);
      }
    },
    enabled: showStudentListDialog && !!selectedAchievement,
  });

  const createAchievementMutation = useMutation({
    mutationFn: async (data: AchievementFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.imageUrl) {
        formData.append("imageUrl", data.imageUrl);
      }
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("reward", data.reward.toString());
      formData.append("points", data.points.toString());
      if (data.type === AchievementType.EVERY_SESSION) {
        formData.append("actionType", data.actionType || "");
        formData.append(
          "requiredQuantity",
          data.requiredQuantity?.toString() || ""
        );
      }
      return await ReqCreateAchievement(formData);
    },
    onSuccess: () => {
      success("Thành công", "Tạo Thành tựu thành công!");
      setIsCreateModalOpen(false);
      refetchAchievementList();
    },
    onError: (err) => {
      console.error("Error creating achievement:", err);
      error("Lỗi", "Có lỗi xảy ra khi tạo Thành tựu");
    },
  });

  const updateAchievementMutation = useMutation({
    mutationFn: async (data: AchievementFormData) => {
      if (!selectedAchievement) return null;

      const formData = new FormData();
      formData.append("title", data.title);
      if (data.imageUrl) {
        formData.append("imageUrl", data.imageUrl);
      }
      formData.append("type", "Manual");
      formData.append("description", data.description);
      formData.append("reward", data.reward.toString());
      formData.append("points", data.points.toString());
      if (data.type === AchievementType.EVERY_SESSION) {
        formData.append("actionType", data.actionType || "");
        formData.append(
          "requiredQuantity",
          data.requiredQuantity?.toString() || ""
        );
      }
      return await ReqUpdateAchievement(selectedAchievement.id, formData);
    },
    onSuccess: () => {
      success("Thành công", "Cập nhật Thành tựu thành công!");
      setIsEditModalOpen(false);
      setSelectedAchievement(null);
      refetchAchievementList();
    },
    onError: (err) => {
      console.error("Error updating achievement:", err);
      error("Lỗi", "Có lỗi xảy ra khi cập nhật Thành tựu");
    },
  });

  const addStudentsMutation = useMutation({
    mutationFn: async ({
      achievementId,
      studentIds,
    }: {
      achievementId: string;
      studentIds: string[];
    }) => {
      // Remove the try-catch block from here as it prevents the error from propagating
      // to the onError handler, making the mutation always appear successful
      const promises = studentIds.map(async (id) => {
        return await ReqCreateAchievementHistory({
          data: {
            user: id,
            achievement: achievementId,
          },
        });
      });

      // Use Promise.all to properly handle all requests and catch any errors
      return await Promise.all(promises);
    },
    onSuccess: () => {
      success("Thành công", "Thêm học viên thành công!");
      setShowStudentListDialog(false);
      setSelectedStudents([]);
      refetchAchievementList();
    },
    onError: (err) => {
      console.error("Error adding students:", err);
      error("Lỗi", "Có lỗi xảy ra khi thêm học viên");
    },
  });

  const handleCreateAchievement = async (data: AchievementFormData) => {
    try {
      await createAchievementMutation.mutateAsync(data);
    } catch (err) {
      console.error("Error in handleCreateAchievement:", err);
    }
  };

  const handleUpdateAchievement = async (data: AchievementFormData) => {
    try {
      await updateAchievementMutation.mutateAsync(data);
    } catch (err) {
      console.error("Error in handleUpdateAchievement:", err);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedAchievement) return;
    try {
      await addStudentsMutation.mutateAsync({
        achievementId: String(selectedAchievement.id),
        studentIds: selectedStudents.map((student) => student),
      });
    } catch (err) {
      console.error("Error in handleAddStudents:", err);
    }
  };

  const handleOpenStudentList = (achievement: TAchievement) => {
    setSelectedAchievement(achievement);
    setShowStudentListDialog(true);
  };

  const handleEdit = (achievement: TAchievement) => {
    // Only allow editing achievements with type "Manual"
    if (achievement.type === AchievementType.MANUAL) {
      setSelectedAchievement(achievement);
      setIsEditModalOpen(true);
    } else {
      console.log("Cannot edit system achievements");
      error("Lỗi", "Không thể chỉnh sửa Thành tựu hệ thống");
    }
  };

  const handleViewStudentsAchieved = (achievement: TAchievement) => {
    setSelectedAchievement(achievement);
    setIsViewStudentsDialogOpen(true);
  };

  const columns: ColumnDef<TAchievement>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "icon",
      cell: ({ row }) => (
        <div
          className="bg-center bg-no-repeat bg-cover h-[44px] rounded-xl w-[44px]"
          style={{
            backgroundImage: `url(${row.original?.imageUrl})`,
          }}
        ></div>
      ),
    },
    {
      header: "Tên Thành tựu",
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
            {/* <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleViewStudentsAchieved(row.original);
              }}
              title="Xem danh sách học viên đã đạt được Thành tựu này"
            >
              <UserRoundSearch className="h-4 w-4" color="#7C6C80" />
            </button> */}
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
                  ? "Không thể chỉnh sửa Thành tựu hệ thống"
                  : "Chỉnh sửa Thành tựu"
              }
            >
              <Edit className="h-4 w-4" color="#7C6C80" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    refetchAchievementList();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="w-full border-gray-20 overflow-hidden flex flex-col gap-y-4 border">
        <div className="w-full h-[68px]  flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 border-b border-gray-20">
          <div className="text-SubheadLg text-gray-95 mb-2 sm:mb-0 flex items-center justify-center gap-2">
            <CommonCard
              size="small"
              className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
            >
              <PanelLeft width={17} height={17} />
            </CommonCard>
            Thành tựu
          </div>
          <CommonButton className="" onClick={() => setIsCreateModalOpen(true)}>
            Tạo Thành tựu
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
          <div className="flex items-center justify-between gap-x-4">
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
          </div>

          {achievementList && (
            <CommonTable
              data={achievementList.data}
              isLoading={false}
              columns={columns}
              page={currentPage}
              totalPage={achievementList.meta.pagination.pageCount}
              totalDocs={achievementList.meta.pagination.total}
              onPageChange={setCurrentPage}
              docsPerPage={itemsPerPage}
              onPageSizeChange={setItemPerPage}
              customTableClassname="!h-[calc(100%-50px)]"
            />
          )}
        </div>
      </div>

      <CreateAchievementDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateAchievement}
        isLoading={createAchievementMutation.isPending}
      />

      {isEditModalOpen && selectedAchievement && (
        <CreateAchievementDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleUpdateAchievement}
          isLoading={updateAchievementMutation.isPending}
          achievement={selectedAchievement}
        />
      )}

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

      {isViewStudentsDialogOpen && (
        <StudentListDialog
          open={isViewStudentsDialogOpen}
          onOpenChange={setIsViewStudentsDialogOpen}
          title="Danh sách học viên đã đạt được Thành tựu"
          mission={selectedAchievement}
          queryFn={ReqGetAchievementHistory}
          queryKey="achievedAchievement"
        />
      )}
    </>
  );
}
