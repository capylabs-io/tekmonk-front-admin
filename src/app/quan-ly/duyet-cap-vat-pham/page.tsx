"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CheckCircle, Edit, PanelLeft, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { get } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qs from "qs";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ReqGetClaimedItem, ReqUpdateClaimedItem } from "@/requests/claimed-item";
import { ClaimedItemStatusEnum } from "@/types/shop";
import { Tabs } from "@/components/new/tabs";
import { Input } from "@/components/common/Input";

// Simple loading component
const LoadingState = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center py-12">
//     <div
//       className="w-[300px] h-[200px] bg-contain bg-no-repeat bg-center"
//       style={{ backgroundImage: "url('/admin/empty-data.png')" }}
//     />
//     <p className="text-gray-500 mt-4">Không có dữ liệu</p>
//     <p className="text-gray-500">Tạo tài khoản mới cho học viên để bắt đầu</p>
//     <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
//       Tạo tài khoản
//     </button>
//   </div>
// );

export default function VerifyClaimedItem() {
  // All state declarations
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToEdit, setClaimedItemToEdit] = useState<any | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  /* UseStore */
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { show, hide } = useLoadingStore();
  const [activeTab, setActiveTab] = useState<{ id: string; label: string }>({
    id: "pending",
    label: "Đợi phê duyệt",
  });
  const tabs = [
    { id: "pending", label: "Đợi phê duyệt" },
    { id: "verified", label: "Đã phê duyệt" },
  ];
  /* UseQuery */
  const { data: courses, refetch } = useQuery({
    queryKey: ["course", page, pageSize, searchQuery],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          populate: ["user"],
          pagination: {
            page,
            pageSize: pageSize,
          },
          filters: {
            $or: [
              { code: { $containsi: searchQuery } },
              { itemCode: { $containsi: searchQuery } },
            ],
          },
        });
        return await ReqGetClaimedItem(queryString);
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin vật phẩm");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted, // Only run query when component is mounted
  });



  // Effect hooks
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = () => {
    setSearchQuery(textSearch);
  };

  const handleOpenEditDialog = (course: any) => {
    setDialogMode("edit");
    setClaimedItemToEdit(course);
    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = async (id: string) => {
    try {
      await ReqUpdateClaimedItem(id, {
        status: ClaimedItemStatusEnum.CLAIMED,
      });
      success("Thành công", "Đã duyệt cấp vật phẩm");
      refetch();
    } catch (err) {
      error("Lỗi", "Không thể duyệt cấp vật phẩm");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Mã quy đổi",
      cell: ({ row }) => <div>{get(row.original, "code", "Không có")}</div>,
    },
    // {
    //   header: "Mã vật phẩm",
    //   cell: ({ row }) => <span>{get(row.original, "itemCode", "Không có")}</span>,
    // },
    {
      header: "Số lượng",
      cell: ({ row }) => <span>{get(row.original, "quantity", "Không có")}</span>,
    },
    {
      header: "Người dùng",
      cell: ({ row }) => <span>{get(row.original, "user.username", "Không có")}</span>,
    },
    {
      header: "Ngày tạo",
      cell: ({ row }) => <span>{get(row.original, "createdAt", "Không có")}</span>,
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {
            get(row.original, "status", "") === ClaimedItemStatusEnum.PENDING ?
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                  setClaimedItemToEdit(row.original);
                }}
              >
                <CheckCircle className="h-5 w-5" color="#7C6C80" />
              </button> :
              <div className="flex items-center justify-center">
                <div className="text-base text-primary-50">Đã duyệt</div>
              </div>
          }
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return <LoadingState />;
  }

  return (
    <>
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
              <div className="text-SubheadLg text-gray-95">Duyệt cấp vật phẩm</div>
            </div>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
          className="w-full !justify-start space-x-5 px-4 border-b border-gray-20"
        />
        {
          activeTab.id === 'pending' && (
            <div className="w-full h-[calc(100%-40px-12px)] overflow-y-auto p-4">
              <div className="flex justify-between items-center">
                <Input
                  type="text"
                  isSearch={true}
                  value={textSearch}
                  onChange={setTextSearch}
                  placeholder="Tìm kiếm vật phẩm theo mã quy đổi"
                  customClassNames="max-w-[410px] h-10 mb-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onSearch={handleSearch}
                />
              </div>
              {courses && (
                <CommonTable
                  data={courses?.data.filter((item: any) => item.status === ClaimedItemStatusEnum.PENDING)}
                  isLoading={false}
                  columns={columns}
                  page={page}
                  totalPage={courses.meta.pagination.pageCount}
                  totalDocs={courses.meta.pagination.total}
                  onPageChange={setPage}
                  docsPerPage={pageSize}
                  onPageSizeChange={setPageSize}
                />
              )}
            </div>
          )
        }
        {
          activeTab.id === 'verified' && (
            <div className="w-full h-[calc(100%-40px-12px)] overflow-y-auto p-4">
              <div className="flex justify-between items-center">
                <Input
                  type="text"
                  isSearch={true}
                  value={textSearch}
                  onChange={setTextSearch}
                  placeholder="Tìm kiếm vật phẩm theo mã quy đổi"
                  customClassNames="max-w-[410px] h-10 mb-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onSearch={handleSearch}
                />
              </div>
              {courses && (
                <CommonTable
                  data={courses?.data.filter((item: any) => item.status === ClaimedItemStatusEnum.CLAIMED)}
                  isLoading={false}
                  columns={columns}
                  page={page}
                  totalPage={courses.meta.pagination.pageCount}
                  totalDocs={courses.meta.pagination.total}
                  onPageChange={setPage}
                  docsPerPage={pageSize}
                  onPageSizeChange={setPageSize}
                />
              )}
            </div>
          )
        }
      </div>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] max-h-full bg-gray-00 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Duyệt cấp vật phẩm</DialogTitle>
            <DialogDescription>
              <div className="text-gray-95 text-BodySm">
                Bạn có muốn duyệt cấp vật phẩm này không?
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setIsDialogOpen(false);
              }}
            >
              Thoát
            </CommonButton>
            <CommonButton
              variant="primary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                handleConfirmPurchase(courseToEdit.id);
                setIsDialogOpen(false);
              }}
            >
              Duyệt
            </CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
