"use client";

import { CreateClassDialog } from "@/components/admin/CreateClassDialog";
import { DeleteClassDialog } from "@/components/admin/dialogs/delete-class-dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { ReqDeleteClass, ReqGetClasses } from "@/requests/class";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Class } from "@/types/common-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, PanelLeft, Settings, Trash2 } from "lucide-react";
import qs from "qs";
import { useState, useEffect } from "react";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div
      className="w-[300px] h-[200px] bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/admin/empty-data.png')" }}
    />
    <p className="text-gray-500 mt-4">Không có dữ liệu</p>
    <p className="text-gray-500">Tạo tài khoản mới cho học viên để bắt đầu</p>
    <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
      Tạo tài khoản
    </button>
  </div>
);

export default function Admin() {
  const router = useCustomRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  /* UseStore */
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { show, hide } = useLoadingStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* UseQuery */
  const queryClient = useQueryClient();
  const {
    data: classes,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["class", page, pageSize],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          populate: "*",
          pagination: {
            page: page,
            pageSize: pageSize,
          },
        });
        return await ReqGetClasses(queryString);
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin lớp học");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted,
  });

  const { mutate: deleteClassMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => {
      return ReqDeleteClass(id);
    },
    onSuccess: () => {
      success("Thành công", "Đã xóa lớp học thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting class:", err);
      error("Lỗi", "Có lỗi xảy ra khi xóa lớp học");
    },
    onSettled: () => {
      hide();
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    },
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteClass = (classData: Class) => {
    setClassToDelete(classData);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!classToDelete) return;

    show();
    deleteClassMutation(classToDelete.id);
  };

  const columns: ColumnDef<Class>[] = [
    {
      id: "stt",
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      id: "code",
      header: "Mã lớp",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.code}>
          {row.original.code}
        </div>
      ),
    },
    {
      id: "course",
      header: "Tên khóa",
      cell: ({ row }) => (
        <div
          className="max-w-[150px] truncate"
          title={row.original.course?.name}
        >
          {row.original.course?.name}
        </div>
      ),
    },
    {
      id: "teacher",
      header: "Tên giảng viên",
      cell: ({ row }) => (
        <div
          className="max-w-[200px] truncate"
          title={row.original.teacher?.username}
        >
          {row.original.teacher?.username}
        </div>
      ),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate">
          {new Date(row.original.endTime) > new Date()
            ? "Đang diễn ra"
            : "Đã kết thúc"}
        </div>
      ),
    },
    {
      id: "action",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            disabled={row.original.course?.isDisabled}
            className={`p-2 hover:bg-gray-100 rounded-full ${row.original.course?.isDisabled
              ? "opacity-50 cursor-not-allowed"
              : ""
              }`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`${ROUTE.MANAGE_CLASS}/${row.original.id}`);
            }}
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClass(row.original);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-full h-full border-r border-gray-20 overflow-y-auto">
        <div className="flex items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-2">
            <CommonCard
              size="small"
              className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
            >
              <PanelLeft width={17} height={17} />
            </CommonCard>
            <div className="flex items-center justify-center">
              <div className="text-SubheadLg text-gray-95">Lớp học</div>
            </div>
          </div>
          <CommonButton className="ml-auto h-9" onClick={handleOpenDialog}>
            Tạo lớp
          </CommonButton>
        </div>
        <div className="p-4 flex-1 w-full">
          {classes && classes.meta.pagination.total === 0 ? (
            <EmptyState />
          ) : (
            <div className="w-full">
              {classes && (
                <CommonTable
                  data={classes?.data}
                  isLoading={isLoading}
                  columns={columns}
                  page={page}
                  totalPage={classes.meta.pagination.pageCount}
                  totalDocs={classes.meta.pagination.total}
                  onPageChange={setPage}
                  docsPerPage={pageSize}
                  onPageSizeChange={setPageSize}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <CreateClassDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <DeleteClassDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        classData={classToDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
