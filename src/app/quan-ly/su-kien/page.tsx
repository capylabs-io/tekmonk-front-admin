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
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import dynamic from "next/dynamic";
import qs from "qs";
import { useMemo, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Controller, FormProvider, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";

const newsSchema = z.object({
  title: z
    .string({ required_error: "Tên bài viết không được để trống" })
    .min(1, "Tên bài viết phải có ít nhất 1 ký tự"),
  tags: z.string().optional(),
  image: z.any(),
  content: z.string().min(1, "Mô tả không được để trống"),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
});

const modules = {
  toolbar: [
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ header: [1, 2, 3, false] }],
    ["link", "image"],
  ],
};

const formats = [
  "list",
  "bullet",
  "ordered",
  "bold",
  "italic",
  "underline",
  "header",
  "link",
  "image",
];

export default function Page() {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
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
      startTime: new Date(),
      endTime: new Date(),
    },
  });
  const { control, getValues, setValue, reset } = methods;

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("public");

  const tabs = [
    { id: "public", label: "Sự kiện" },
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
    queryKey: ["event", page, limit, activeTab],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: limit,
          },
          filters: {
            type: "event",
            status: activeTab,
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

  const prepareFormData = (eventStatus: string) => {
    const formData = new FormData();
    const values = getValues();

    Object.entries({
      title: values.title,
      tags: values.tags,
      content: values.content,
      startTime: values.startTime?.toISOString() || "",
      endTime: values.endTime?.toISOString() || "",
      type: "event",
      status: eventStatus,
    }).forEach(([key, value]) => formData.append(key, value));

    if (values.image) {
      formData.append("image", values.image);
    }

    return { formData, values: { ...values, status: eventStatus } };
  };

  const handleNewsSubmit = async (eventStatus: string) => {
    try {
      show();
      const { formData, values } = prepareFormData(eventStatus);

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

      queryClient.invalidateQueries({ queryKey: ["event"] });
    } catch (err) {
      console.error("Error submitting news:", err);
      error(
        "Không thành công",
        isEditing ? "Cập nhật bài viết thất bại" : "Tạo bài viết thất bại"
      );
    } finally {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      hide();
      setToggleNewsDialog(false);
      setIsEditing(false);
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
        queryClient.invalidateQueries({ queryKey: ["event"] });
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

  const handleEditNews = (item: any) => {
    setIsEditing(true);
    reset({
      title: item.title,
      tags: item.tags,
      content: item.content,
      startTime: item.startTime ? new Date(item.startTime) : new Date(),
      endTime: item.endTime ? new Date(item.endTime) : new Date(),
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
      <div className="w-full h-auto min-h-[68px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 border-b border-gray-20">
        <div className="text-SubheadLg text-gray-95 mb-2 sm:mb-0 flex items-center justify-center gap-2">
          <CommonCard
            size="small"
            className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
          >
            <PanelLeft width={17} height={17} />
          </CommonCard>
          Sự kiện
        </div>
        <CommonButton
          className="h-9 text-gray-00"
          variant="primary"
          onClick={() => {
            reset();
            setToggleNewsDialog(true);
          }}
        >
          Tạo sự kiện
        </CommonButton>
      </div>
      <div className="w-full flex flex-col border-y border-gray-20 py-2">
        <div className="h-9 w-[265px] border-t border-x border-gray-20 rounded-t-lg flex items-center justify-center text-gray-95 gap-3">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full h-full flex items-center justify-center rounded-t-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 cursor-pointer",
                activeTab === tab.id
                  ? "bg-[#C840B8] text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className=" flex-1 border-t border-gray-20">
          <div className="w-full overflow-auto">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">STT</TableHead>
                    <TableHead className="w-[120px]">Ảnh bìa</TableHead>
                    <TableHead>Tên sự kiện</TableHead>
                    <TableHead className="w-[200px]">
                      Thời gian diễn ra
                    </TableHead>
                    <TableHead className="w-[180px]">Trạng thái</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-BodySm">
                  {data &&
                    data.data.map((item, index) => (
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
                          <TimeConvert
                            time={item.startTime ? item.startTime : ""}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(item.endTime) > new Date()
                            ? "Đang diễn ra"
                            : "Đã kết thúc"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditNews(item)}
                            >
                              <Edit
                                className="h-4 w-4"
                                onClick={() => {
                                  setCurrentNews(item);
                                  setIsEditing(true);
                                }}
                                color="#7C6C80"
                              />
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
          <StudentTablePagination
            showDetails={true}
            totalItems={10}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={(page) => setPage(page)}
            onItemsPerPageChange={(itemsPerPage) => setLimit(itemsPerPage)}
            className=""
            showEllipsisThreshold={7}
          />
        </div>
        <FormProvider {...methods}>
          <Dialog
            open={toggleNewsDialog}
            onOpenChange={(open) => {
              if (!open) {
                setIsEditing(false);
                setCurrentNews(null);
                reset({
                  title: "",
                  tags: "",
                  image: null,
                  content: "",
                  startTime: new Date(),
                  endTime: new Date(),
                });
                setToggleNewsDialog(false);
              }
            }}
          >
            <DialogContent className="sm:max-w-[800px] max-h-full bg-gray-00 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {isEditing ? "Chỉnh sửa sự kiện" : "Tạo bài sự kiện mới"}
                </DialogTitle>
              </DialogHeader>
              <Controller
                control={control}
                name="title"
                render={({ field: { value, onChange }, fieldState }) => (
                  <InputField
                    value={value}
                    onChange={onChange}
                    title="Tiêu đề"
                    type="text"
                    error={fieldState && fieldState.error?.message}
                    placeholder="Nhập tiêu đề bài viết"
                  />
                )}
              />
              {/* news image */}
              <InputImgUploadContest
                title="Đăng tải ảnh bìa"
                value={getValues("image")}
                onChange={handleImageUpload}
                customClassNames="mt-b "
              />

              <Controller
                control={control}
                name="tags"
                render={({ field: { value, onChange }, fieldState }) => (
                  <InputTags
                    value={value}
                    error={fieldState?.error?.message}
                    onValueChange={(tagsString) => {
                      onChange(tagsString);
                    }}
                    tooltipContent="Vui lòng nhập tag và ấn Enter"
                  />
                )}
              />
              <div className="flex items-center w-full">
                <div className="w-1/5">Thời gian diễn ra</div>
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field }) => (
                    <DateRangePicker
                      onChange={(value) => {
                        if (Array.isArray(value)) {
                          setValue("startTime", value[0] || new Date());
                          setValue("endTime", value[1] || new Date());
                        }
                      }}
                      value={[
                        getValues("startTime") || new Date(),
                        getValues("endTime") || new Date(),
                      ]}
                      className="flex-1 !outline-none !border-none h-12"
                    />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="content"
                render={({ field: { value, onChange }, fieldState }) => (
                  <ReactQuill
                    theme="snow"
                    className="w-full rounded-xl bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear"
                    value={value}
                    onChange={onChange}
                    placeholder="Nội dung bài viết"
                    modules={modules}
                    formats={formats}
                  />
                )}
              />

              {/* Dialog Footer */}
              <DialogFooter className="flex items-center justify-between sm:justify-between">
                <CommonButton
                  variant="secondary"
                  className="h-[48px]"
                  childrenClassName="text-SubheadMd"
                  onClick={() => {
                    setToggleNewsDialog(false);
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Thoát
                </CommonButton>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <CommonButton
                      variant="secondary"
                      className="h-[48px]"
                      childrenClassName="!text-[#AD3C34]"
                      onClick={() => handleMoveToTrash(null)}
                    >
                      Xoá
                    </CommonButton>
                  )}
                  <CommonButton
                    variant="secondary"
                    className="h-[48px]"
                    onClick={() => handleNewsSubmit("draft")}
                  >
                    {isEditing ? "Đưa về bản nháp" : "Lưu bản nháp"}
                  </CommonButton>
                  <CommonButton
                    className="text-white h-[48px] w-[133px]"
                    onClick={() => {
                      setIsEditing(false);
                      handleNewsSubmit("public");
                    }}
                  >
                    {isEditing ? "Cập nhật" : "Đăng dự án"}
                  </CommonButton>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </FormProvider>
      </div>
    </div>
  );
}
