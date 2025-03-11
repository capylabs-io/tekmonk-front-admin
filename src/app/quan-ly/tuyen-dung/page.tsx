"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import StudentTablePagination from "@/components/admin/student-table-pagination";
import { CommonCard } from "@/components/common/CommonCard";
import { TimeConvert } from "@/components/common/TimeConvert";
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
import { ReqGetAllNews } from "@/requests/news";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { TNews } from "@/types/common-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { useState } from "react";
import { NewsDialogManager } from "@/components/new/news-dialog-manager";
import { Tabs } from "@/components/new/tabs";
import { eventSchema, hiringSchema } from "@/validation/news";

// Define extended TNews type with uploadedImage property
type TNewsWithUpload = TNews & {
  uploadedImage?: File;
  id?: number | string;
  salary?: string;
};

export default function Hiring() {
  const [toggleHiringDialog, setToggleHiringDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHiring, setCurrentHiring] = useState<TNews | null>(null);

  const [limit, setLimit] = useState(10);
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

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["hiring", page, limit, activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: limit,
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
  });

  const handleEditHiring = (item: TNews) => {
    setCurrentHiring(item);
    setIsEditing(true);
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
                    <TableHead>Tên tin tuyển dụng</TableHead>
                    <TableHead className="w-[150px]">Mức lương</TableHead>
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
                        <TableCell>{item.salary || "Thương lượng"}</TableCell>
                        <TableCell>
                          <TimeConvert
                            time={item.startTime ? item.startTime : ""}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(item.endTime) > new Date()
                            ? "Đang tuyển"
                            : "Đã kết thúc"}
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
                              className="h-8 w-8 text-gray-60"
                              onClick={() => {
                                setCurrentHiring(item);
                                setToggleHiringDialog(true);
                                setIsEditing(true);
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
              totalItems={data?.meta?.pagination?.total || 0}
              currentPage={page}
              itemsPerPage={limit}
              onPageChange={(page) => setPage(page)}
              onItemsPerPageChange={(itemsPerPage) => setLimit(itemsPerPage)}
              className=""
              showEllipsisThreshold={7}
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
