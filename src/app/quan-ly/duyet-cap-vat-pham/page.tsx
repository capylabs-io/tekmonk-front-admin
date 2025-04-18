"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Edit, PanelLeft, Trash2 } from "lucide-react";
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

  /* UseStore */
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { show, hide } = useLoadingStore();

  /* UseQuery */
  const { data: courses, refetch } = useQuery({
    queryKey: ["course", page, pageSize],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          pagination: {
            page,
            pageSize: pageSize,
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


  const handleOpenEditDialog = (course: any) => {
    setDialogMode("edit");
    setClaimedItemToEdit(course);
    setIsDialogOpen(true);
  };


  const columns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Mã quy đổi",
      cell: ({ row }) => <span>{row.original.itemCode}</span>,
    },
    {
      header: "Mã vật phẩm",
      cell: ({ row }) => <div>{row.original.code}</div>,
    },
    {
      header: "Số lượng",
      cell: ({ row }) => <span>{row.original.quantity}</span>,
    },
    {
      header: "Người dùng",
      cell: ({ row }) => <span>{row.original.user.username}</span>,
    },
    {
      header: "Ngày tạo",
      cell: ({ row }) => <span>{row.original.createdAt}</span>,
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Check className="h-4 w-4" color="#7C6C80" />
          </button>
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
        <div className="p-4">
          {courses && (
            <CommonTable
              data={courses?.data}
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
      </div>
    </>
  );
}
