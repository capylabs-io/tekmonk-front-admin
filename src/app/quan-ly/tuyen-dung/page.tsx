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
import { SplitRenderItem } from "@/components/common/SplitRenderItem";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ReqCreateNews,
  ReqGetAllNews,
  ReqUpdateImage,
  ReqUpdateNews,
  ReqDeleteNews,
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

const hiringSchema = z.object({
  title: z
    .string({ required_error: "Tên bài viết không được để trống" })
    .min(1, "Tên bài viết phải có ít nhất 1 ký tự"),
  tags: z.string().optional(),
  salary: z.string().min(1, "Mức lương không được để trống"),
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

export default function HiringPage() {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const [toggleHiringDialog, setToggleHiringDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHiring, setCurrentHiring] = useState<TNews | null>(null);

  const methods = useForm({
    resolver: zodResolver(hiringSchema),
    defaultValues: {
      title: "",
      tags: "",
      image: null,
      salary: "",
      content: "",
      startTime: new Date(),
      endTime: new Date(),
    },
  });
  const { control, getValues, setValue, reset } = methods;

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["hiring", page, limit],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: limit,
          },
          filters: {
            type: "hiring",
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

  const prepareFormData = (hiringStatus: string) => {
    const formData = new FormData();
    const values = getValues();

    Object.entries({
      title: values.title,
      tags: values.tags,
      content: values.content,
      salary: values.salary,
      startTime: values.startTime?.toISOString() || "",
      endTime: values.endTime?.toISOString() || "",
      type: "hiring",
      status: hiringStatus,
    }).forEach(([key, value]) => formData.append(key, value));

    if (values.image) {
      formData.append("image", values.image);
    }

    return { formData, values: { ...values, status: hiringStatus } };
  };

  const handleHiringSubmit = async (hiringStatus: string) => {
    try {
      show();
      const { formData, values } = prepareFormData(hiringStatus);

      if (isEditing && currentHiring) {
        await ReqUpdateNews(currentHiring.id.toString(), values);
        if (values.image) {
          await ReqUpdateImage(currentHiring.id.toString(), formData);
        }
        success("Thành công", "Cập nhật tin tuyển dụng thành công");
      } else {
        await ReqCreateNews(formData);
        success("Thành công", "Tạo tin tuyển dụng thành công");
      }

      queryClient.invalidateQueries({ queryKey: ["hiring"] });
    } catch (err) {
      console.error("Error submitting hiring:", err);
      error(
        "Không thành công",
        isEditing
          ? "Cập nhật tin tuyển dụng thất bại"
          : "Tạo tin tuyển dụng thất bại"
      );
    } finally {
      hide();
      setToggleHiringDialog(false);
      setIsEditing(false);
      setCurrentHiring(null);
      reset();
    }
  };

  const handleMoveToTrash = async (data: TNews | null) => {
    try {
      show();
      if (data != null) {
        setCurrentHiring(data);
      }
      if (!currentHiring) return;
      await ReqDeleteNews(currentHiring.id.toString());
      success("Thành công", "Đã xóa tin tuyển dụng");
    } catch (err) {
      console.log("Error moving to trash:", err);
      error("Không thành công", "Không tìm thấy tin tuyển dụng");
    } finally {
      hide();
      setToggleHiringDialog(false);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["hiring"] });
    }
  };

  const handleEditHiring = (item: TNews) => {
    setIsEditing(true);
    setCurrentHiring(item);
    reset({
      title: item.title,
      tags: item.tags,
      content: item.content,
      startTime: item.startTime ? new Date(item.startTime) : new Date(),
      endTime: item.endTime ? new Date(item.endTime) : new Date(),
    });
    setToggleHiringDialog(true);
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
          Tuyển dụng
        </div>
        <CommonButton
          className="h-9 text-gray-00"
          variant="primary"
          onClick={() => {
            reset();
            setToggleHiringDialog(true);
          }}
        >
          Tạo tin
        </CommonButton>
      </div>
      <div className="w-full flex flex-col border-y border-gray-20 py-2">
        <div className=" flex-1 border-t border-gray-20">
          <div className="w-full overflow-auto">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">STT</TableHead>
                    <TableHead className="w-[200px]">
                      Tiêu đề tuyển dụng
                    </TableHead>
                    <TableHead>Mức lương</TableHead>
                    <TableHead className="w-[180px]">Tag</TableHead>
                    <TableHead className="w-[180px]">Trạng thái</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-BodySm">
                  {data &&
                    data.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell className="">
                          {item.salary ? item.salary : "Chưa cập nhật"}
                        </TableCell>
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
                          {item.status === "public"
                            ? "Đang tuyển dụng"
                            : "Hết hạn"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditHiring(item)}
                            >
                              <Edit className="h-4 w-4" color="#7C6C80" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleMoveToTrash(item)}
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
            open={toggleHiringDialog}
            onOpenChange={(open) => {
              if (!open) {
                setIsEditing(false);
                setCurrentHiring(null);
                reset({
                  title: "",
                  tags: "",
                  image: null,
                  content: "",
                  startTime: new Date(),
                  endTime: new Date(),
                });
                setToggleHiringDialog(false);
              }
            }}
          >
            <DialogContent className="sm:max-w-[800px] max-h-full bg-gray-00 overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {isEditing ? "Chỉnh sửa tin" : "Tạo bài tin mới"}
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

              <Controller
                control={control}
                name="salary"
                render={({ field: { value, onChange }, fieldState }) => (
                  <InputField
                    value={value}
                    onChange={onChange}
                    title="Mức lương"
                    type="text"
                    error={fieldState && fieldState.error?.message}
                    placeholder="VD: 10 triệu, 10-15tr, Thương lượng"
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
                    setToggleHiringDialog(false);
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
                    onClick={() => handleHiringSubmit("draft")}
                  >
                    {isEditing ? "Đưa về bản nháp" : "Lưu bản nháp"}
                  </CommonButton>
                  <CommonButton
                    className="text-white h-[48px] w-[133px]"
                    onClick={() => {
                      setIsEditing(false);
                      handleHiringSubmit("public");
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
