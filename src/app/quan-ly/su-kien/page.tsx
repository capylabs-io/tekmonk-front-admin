"use client";

import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import StudentTablePagination from "@/components/admin/student-table-pagination";
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
import { ReqGetAllNews } from "@/requests/news";
import { TNews } from "@/types/common-types";
import { useQuery } from "@tanstack/react-query";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import qs from "qs";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-quill/dist/quill.snow.css";
import { NewsDialogManager } from "@/components/new/news-dialog-manager";
import { AdminHeader } from "@/components/new/admin-header";
import { Tabs } from "@/components/new/tabs";

export default function Page() {
  const [toggleNewsDialog, setToggleNewsDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<TNews | null>(null);

  const [limit, setLimit] = useState(10);
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

  const { data, isLoading, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["event", page, limit, activeTab.id],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page: page,
            pageSize: limit,
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
  });

  const handleEditNews = (item: TNews) => {
    setCurrentNews(item);
    setIsEditing(true);
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
        title="Sự kiện"
        buttonTitle="Tạo sự kiện"
        onClickButton={() => {
          setCurrentNews(null);
          setIsEditing(false);
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
                              <Edit className="h-4 w-4" color="#7C6C80" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-60"
                              onClick={() => {
                                setCurrentNews(item);
                                setToggleNewsDialog(true);
                                setIsEditing(true);
                                // The dialog will handle the deletion in standalone mode
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
            totalItems={data?.meta?.pagination?.total || 0}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={(page) => setPage(page)}
            onItemsPerPageChange={(itemsPerPage) => setLimit(itemsPerPage)}
            className=""
            showEllipsisThreshold={7}
          />
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
          standalone={true}
          queryKey={["event", page.toString(), limit.toString(), activeTab.id]}
        />
      </div>
    </div>
  );
}
