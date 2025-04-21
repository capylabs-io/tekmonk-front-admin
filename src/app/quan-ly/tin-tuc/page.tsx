"use client";

import { Edit, Trash2, PanelLeft } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import { TimeConvert } from "@/components/common/TimeConvert";
import { Button } from "@/components/ui/button";
import { ReqDeleteNews, ReqGetAllNews, ReqUpdateNews } from "@/requests/news";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { TNews } from "@/types/common-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { SplitRenderItem } from "@/components/common/SplitRenderItem";
import { newsSchema } from "@/validation/news";
import { Tabs } from "@/components/new/tabs";
import { NewsDialogManager } from "@/components/new/news-dialog-manager";
import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";

export default function News() {
  const [toggleNewsDialog, setToggleNewsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<TNews | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const methods = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      tags: "",
      image: null,
      content: "",
    },
  });
  const { control, getValues, setValue, reset } = methods;

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<{ id: string; label: string }>({
    id: "public",
    label: "Tin tức",
  });

  const tabs = [
    { id: "public", label: "Tin tức" },
    { id: "draft", label: "Bản nháp" },
    { id: "trash", label: "Thùng rác" },
  ];

  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["news", page, pageSize, activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: pageSize,
          },
          filters: {
            type: "news",
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

  const handleMoveToTrash = async (data: TNews | null) => {
    try {
      show();
      if (data != null) {
        setCurrentNews(data);
      }
      if (!currentNews) return;
      if (currentNews.status === "trash") {
        await ReqDeleteNews(currentNews.id.toString());
      } else {
        const formData = new FormData();
        formData.append("status", "trash");
        await ReqUpdateNews(currentNews.id.toString(), formData);
        success("Thành công", "Đã chuyển bài viết vào thùng rác");
        queryClient.invalidateQueries({ queryKey: ["news"] });
      }
    } catch (err) {
      console.log("Error moving to trash:", err);
      error("Không thành công", "Không tìm thấy bài viết");
    } finally {
      hide();
      setToggleNewsDialog(false);
      setIsEditing(false);
      {
        currentNews &&
          success(
            "Thành công",
            currentNews.status === "trash"
              ? "Đã xóa bài viết"
              : "Đã chuyển bài viết vào thùng rác"
          );
      }
    }
  };

  const handleEditNews = (item: TNews) => {
    setIsEditing(true);
    setCurrentNews(item);
    reset({
      title: item.title,
      tags: item.tags,
      content: item.content,
    });
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
      header: "Tên bài viết",
      cell: ({ row }) => <span>{row.original.title}</span>,
    },
    {
      header: "Chủ đề",
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
          {row.original.tags && (
            <SplitRenderItem
              items={row.original.tags.split(",")}
              className="rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
              remainingItemsClassName="rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
              tooltipContentClassName="rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
            />
          )}
        </div>
      ),
    },
    {
      header: "Ngày đăng",
      cell: ({ row }) => (
        <TimeConvert
          time={row.original.createdAt ? row.original.createdAt : ""}
        />
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
              handleMoveToTrash(row.original);
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
            <div className="text-SubheadLg text-gray-95">Tin tức</div>
          </div>
        </div>
        <CommonButton
          variant="primary"
          className="h-9 !w-max px-6"
          onClick={() => {
            reset();
            setToggleNewsDialog(true);
          }}
        >
          Tạo bài viết
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
          type="news"
          isOpen={toggleNewsDialog}
          onClose={() => {
            setToggleNewsDialog(false);
            setIsEditing(false);
            setCurrentNews(null);
          }}
          initialData={currentNews}
          isEditing={isEditing}
          schema={newsSchema}
        />
      </div>
    </div>
  );
}
