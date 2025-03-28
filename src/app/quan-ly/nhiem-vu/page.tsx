"use client";

import { Edit, PanelLeft } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { AchievementFormData } from "@/components/achievement/CreateAchievementModal";
import { useState } from "react";
import { getMission } from "@/requests/mission";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Tabs } from "@/components/new/tabs";
import { useMission } from "@/hooks/useMission";
import { Mission } from "@/types/mission";
import { Input } from "@/components/common/Input";

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

  const { data: missionList, refetch: refetchMissionList } = useQuery({
    queryKey: ["missionList", activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            type: activeTab.id,
          },
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
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                // Add edit handler here
              }}
            >
              <Edit className="h-4 w-4" color="#7C6C80" />
            </button>
          </div>
        );
      },
    },
  ];

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
            Nhiệm vụ
          </div>
        </div>
        <div className="flex items-center gap-x-4 border-b border-gray-20">
          <Tabs
            tabs={tabs}
            currentTab={activeTab}
            setCurrentTab={setActiveTab}
            className="w-[265px] space-x-4"
          />
        </div>
        <div className="flex flex-col gap-y-4 px-4 !h-[calc(100vh-68px-36px-40px-16px)]">
          <Input
            type="text"
            placeholder="Tìm kiếm"
            customClassNames="max-w-[320px]"
          />

          {missionList && (
            <CommonTable
              data={missionList.data}
              isLoading={false}
              columns={columns}
              page={page}
              totalPage={totalPage}
              totalDocs={totalDocs}
              onPageChange={setPage}
              docsPerPage={limit}
              onPageSizeChange={setLimit}
              customTableClassname="!h-[calc(100%-50px)]"
            />
          )}
        </div>
      </div>
    </>
  );
}
