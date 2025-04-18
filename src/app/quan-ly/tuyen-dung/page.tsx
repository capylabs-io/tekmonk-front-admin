"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import { CommonCard } from "@/components/common/CommonCard";
import { TimeConvert } from "@/components/common/TimeConvert";
import { ReqGetAllNews } from "@/requests/news";
import { TNews } from "@/types/common-types";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { useState, useEffect } from "react";
import { NewsDialogManager } from "@/components/new/news-dialog-manager";
import { Tabs } from "@/components/new/tabs";
import { hiringSchema } from "@/validation/news";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";

export default function Hiring() {
  const [toggleHiringDialog, setToggleHiringDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHiring, setCurrentHiring] = useState<TNews | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<{ id: string; label: string }>({
    id: "public",
    label: "Tuyển dụng",
  });

  const tabs = [
    { id: "public", label: "Tin tức" },
    { id: "draft", label: "Bản nháp" },
    { id: "trash", label: "Thùng rác" },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["hiring", page, pageSize, activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: pageSize,
          },
          filters: {
            type: "hiring",
            status: activeTab.id,
          },
          sort: ["id:asc"],
          populate: "*",
        });
        return await ReqGetAllNews(queryString);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: isMounted,
  });

  const handleEditHiring = (item: TNews) => {
    setCurrentHiring(item);
    setIsEditing(true);
    setToggleHiringDialog(true);
  };

  const columns: ColumnDef<TNews>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Ảnh bìa",
      cell: ({ row }) => (
        <Image
          src={
            row.original.thumbnail ? row.original.thumbnail : "/placeholder.svg"
          }
          alt={row.original.title}
          width={100}
          height={60}
          className="rounded-md object-cover"
        />
      ),
    },
    {
      header: "Tên tin tuyển dụng",
      cell: ({ row }) => <span>{row.original.title}</span>,
    },
    {
      header: "Mức lương",
      cell: ({ row }) => <span>{row.original.salary || "Thương lượng"}</span>,
    },
    {
      header: "Thời gian diễn ra",
      cell: ({ row }) => (
        <TimeConvert
          time={row.original.startTime ? row.original.startTime : ""}
        />
      ),
    },
    {
      header: "Trạng thái",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.endTime) > new Date()
            ? "Đang tuyển"
            : "Đã kết thúc"}
        </span>
      ),
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleEditHiring(row.original);
            }}
          >
            <Edit className="h-4 w-4" color="#7C6C80" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentHiring(row.original);
              setIsEditing(true);
              setToggleHiringDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4" color="#7C6C80" />
          </button>
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return <Loading />;
  }

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div>
        Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ admin để biết thêm chi
        tiết
      </div>
    );

  return (
    <div className="w-full h-full border-r border-gray-20 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b w-full">
        <div className="flex items-center gap-2">
          <CommonCard
            size="small"
            className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
          >
            <PanelLeft width={17} height={17} />
          </CommonCard>
          <div className="flex items-center justify-center">
            <div className="text-SubheadLg text-gray-95">Tuyển dụng</div>
          </div>
        </div>
        <CommonButton
          variant="primary"
          className="h-9 !w-max px-6"
          onClick={() => {
            setCurrentHiring(null);
            setIsEditing(false);
            setToggleHiringDialog(true);
          }}
        >
          Tạo tin tuyển dụng
        </CommonButton>
      </div>
      <div className="w-full flex flex-col border-y border-gray-20 py-2">
        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          setCurrentTab={(tab) => setActiveTab(tab)}
          className="w-[265px] gap-6 px-4"
        />
        <div className="p-4">
          {data && (
            <CommonTable
              data={data?.data}
              isLoading={isLoading}
              columns={columns}
              page={page}
              totalPage={data.meta.pagination.pageCount}
              totalDocs={data.meta.pagination.total}
              onPageChange={setPage}
              docsPerPage={pageSize}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>

        {/* Use the NewsDialogManager in standalone mode for hiring */}
        <NewsDialogManager
          type="hiring"
          isOpen={toggleHiringDialog}
          onClose={() => {
            setToggleHiringDialog(false);
            setIsEditing(false);
            setCurrentHiring(null);
          }}
          initialData={currentHiring}
          isEditing={isEditing}
          schema={hiringSchema}
        />
      </div>
    </div>
  );
}
