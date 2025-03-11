"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import StudentTablePagination from "@/components/admin/student-table-pagination";
import { CommonCard } from "@/components/common/CommonCard";
import { TimeConvert } from "@/components/common/TimeConvert";
import { InputField } from "@/components/contest/InputField";
import { InputImgUploadContest } from "@/components/contest/InputImgUploadContest";
import { InputTags } from "@/components/contest/InputTags";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ReqCreateNews,
  ReqDeleteNews,
  ReqGetAllNews,
  ReqUpdateImage,
  ReqUpdateNews,
} from "@/requests/news";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { TNews } from "@/types/common-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import qs from "qs";
import { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
import { SplitRenderItem } from "@/components/common/SplitRenderItem";
import { eventSchema, newsSchema } from "@/validation/news";
import { quillFormats, quillModules } from "@/contants/config/react-quill";
import { Tabs } from "@/components/new/tabs";
import { AdminHeader } from "@/components/new/admin-header";
import { NewsDialogManager } from "@/components/new/news-dialog-manager";

export default function News() {
  const [toggleNewsDialog, setToggleNewsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<TNews | null>(null);

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

  const [limit, setLimit] = useState(10);
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

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["news", page, limit, activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: limit,
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
  });

  const handleImageUpload = (file: File | null) => {
    if (file) setValue("image", file as any);
  };

  const prepareFormData = (newsStatus: string) => {
    const formData = new FormData();
    const values = getValues();

    Object.entries({
      title: values.title,
      tags: values.tags,
      content: values.content,
      type: "news",
      status: newsStatus,
    }).forEach(([key, value]) => formData.append(key, value));

    if (values.image) {
      formData.append("image", values.image);
    }

    return { formData, values: { ...values, status: newsStatus } };
  };

  const handleNewsSubmit = async (newsStatus: string) => {
    try {
      show();
      const { formData, values } = prepareFormData(newsStatus);

      if (isEditing && currentNews) {
        await ReqUpdateNews(currentNews.id.toString(), values);
        if (values.image) {
          await ReqUpdateImage(currentNews.id.toString(), formData);
        }
        success("Thành công", "Cập nhật bài viết thành công");
      } else {
        await ReqCreateNews(formData);
        success("Thành công", "Tạo bài viết thành công");
      }

      queryClient.invalidateQueries({ queryKey: ["news"] });
    } catch (err) {
      console.error("Error submitting news:", err);
      error(
        "Không thành công",
        isEditing ? "Cập nhật bài viết thất bại" : "Tạo bài viết thất bại"
      );
    } finally {
      hide();
      setToggleNewsDialog(false);
      setIsEditing(false);
      setCurrentNews(null);
      reset();
    }
  };

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
        const dataUpdate = {
          status: "trash",
        };
        await ReqUpdateNews(currentNews.id.toString(), dataUpdate);
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
      <AdminHeader
        title="Tin tức"
        buttonTitle="Tạo bài viết"
        onClickButton={() => {
          reset();
          setToggleNewsDialog(true);
        }}
      />
      <div className="w-full flex flex-col border-y border-gray-20 py-2">
        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
          className="w-[265px]"
        />
        <div className=" flex-1 border-t border-gray-20">
          <div className="w-full overflow-auto">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">STT</TableHead>
                    <TableHead className="w-[120px]">Ảnh bìa</TableHead>
                    <TableHead>Tên bài viết</TableHead>
                    <TableHead className="w-[200px]">Chủ đề</TableHead>
                    <TableHead className="w-[180px]">Ngày đăng</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-BodySm">
                  {data &&
                    data.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell>
                          <Image
                            src={
                              item.thumbnail
                                ? item.thumbnail
                                : "/placeholder.svg"
                            }
                            alt={item.title}
                            width={100}
                            height={60}
                            className="rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="">{item.title}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {item.tags && (
                              <SplitRenderItem
                                items={item.tags.split(",")}
                                className="rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
                                remainingItemsClassName="rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
                                tooltipContentClassName="rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TimeConvert
                            time={item.createdAt ? item.createdAt : ""}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditNews(item)}
                            >
                              <Edit className="h-4 w-4" color="#7C6C80" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-60"
                              onClick={async () => {
                                await handleMoveToTrash(item);
                              }}
                            >
                              <Trash2 className="h-4 w-4" color="#7C6C80" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          {data && (
            <StudentTablePagination
              showDetails={true}
              totalItems={data?.meta.pagination.total}
              currentPage={page}
              itemsPerPage={limit}
              onPageChange={(page) => setPage(page)}
              onItemsPerPageChange={(itemsPerPage) => setLimit(itemsPerPage)}
              className=""
              showEllipsisThreshold={7}
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
