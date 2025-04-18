"use client";

import { Edit, Trash2, PanelLeft } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import { TimeConvert } from "@/components/common/TimeConvert";
import { ReqGetAllNews } from "@/requests/news";
import { TNews } from "@/types/common-types";
import { useQuery } from "@tanstack/react-query";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import qs from "qs";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "react-quill/dist/quill.snow.css";
import { NewsDialogManager } from "@/components/new/news-dialog-manager";
import { Tabs } from "@/components/new/tabs";
import { eventSchema } from "@/validation/news";
import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";

export default function Event() {
  const [toggleNewsDialog, setToggleNewsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<TNews | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<{ id: string; label: string }>({
    id: "public",
    label: "Sự kiện",
  });

  const tabs = [
    { id: "public", label: "Sự kiện" },
    { id: "draft", label: "Bản nháp" },
    { id: "trash", label: "Thùng rác" },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["event", page, pageSize, activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: pageSize,
          },
          filters: {
            type: "event",
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

  const handleEditNews = (item: TNews) => {
    setCurrentNews(item);
    setIsEditing(true);
    setToggleNewsDialog(true);
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
      header: "Tên sự kiện",
      cell: ({ row }) => <span>{row.original.title}</span>,
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
            ? "Đang diễn ra"
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
              handleEditNews(row.original);
            }}
          >
            <Edit className="h-4 w-4" color="#7C6C80" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentNews(row.original);
              setToggleNewsDialog(true);
              setIsEditing(true);
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
            <div className="text-SubheadLg text-gray-95">Sự kiện</div>
          </div>
        </div>
        <CommonButton
          variant="primary"
          className="h-9 !w-max px-6"
          onClick={() => {
            setCurrentNews(null);
            setIsEditing(false);
            setToggleNewsDialog(true);
          }}
        >
          Tạo sự kiện
        </CommonButton>
      </div>
      <div className="w-full flex flex-col border-y border-gray-20 py-2">
        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
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

        <NewsDialogManager
          type="event"
          isOpen={toggleNewsDialog}
          onClose={() => {
            setToggleNewsDialog(false);
            setIsEditing(false);
            setCurrentNews(null);
          }}
          initialData={currentNews}
          isEditing={isEditing}
          schema={eventSchema}
        />
      </div>
    </div>
  );
}
