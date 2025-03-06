"use client";

import { CreateClassDialog } from "@/components/admin/CreateClassDialog";
import { DeleteClassDialog } from "@/components/admin/dialogs/delete-class-dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ReqDeleteClass } from "@/requests/class";
import { ReqGetCourses } from "@/requests/course";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Class } from "@/types/common-types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
import { useState } from "react";
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

export default function Courses() {
  const router = useCustomRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
  /* UseStore */
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { show, hide } = useLoadingStore();

  /* UseQuery */
  const { data: classes, refetch } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      try {
        return await ReqGetCourses();
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin lớp học");
      }
    },
    refetchOnWindowFocus: false,
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
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    },
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // const handleItemsPerPageChange = (newItemsPerPage: number) => {
  //   setItemsPerPage(newItemsPerPage);
  //   setCurrentPage(1);
  // };

  const handleDeleteClass = (classData: Class) => {
    setClassToDelete(classData);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!classToDelete) return;

    show();
    deleteClassMutation(classToDelete.id);
  };
  const mockData = [
    {
      id: 1,
      name: 'Khoá học dạy làm giàu cho trẻ nhỏ từ 7- 17 tuổi',
      numberSession: 1,
      description: 'Code Scratch',
      code: 'A1-23',
    },
    {
      id: 2,
      name: 'Khoá học dạy làm giàu cho trẻ nhỏ từ 7- 17 tuổi',
      numberSession: 1,
      description: 'Robotic',
      code: 'A1-23',
    },
    {
      id: 3,
      name: 'Khoá học dạy làm giàu cho trẻ nhỏ từ 7- 17 tuổi',
      numberSession: 1,
      description: 'Code Unity',
      code: 'A1-23',
    },

  ]
  const columns: ColumnDef<any>[] =
    [
      {
        header: 'STT',
        cell: ({ row }) => <span>{row.index + 1}</span>,

      },
      {
        header: 'Mã',
        cell: ({ row }) => (
          <div >
            {row.original.code}
          </div>
        ),
      },
      {
        header: 'Tên khoá',
        cell: ({ row }) => <span>{row.original.code}</span>,
      },
      {
        header: 'Loại',
        cell: ({ row }) => (
          <span>
            {get(row, 'original.description', '')}
          </span>
        ),
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true)
                // Add edit handler here
              }}
            >
              <Edit className="h-4 w-4" color="#7C6C80" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true)
                // Add edit handler here
              }}
            >
              <Trash2 className="h-4 w-4" color="#7C6C80" />
            </button>
          </div>
        ),
      },
    ]
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
              <div className="text-SubheadLg text-gray-95">Khóa học</div>
            </div>
          </div>
          <CommonButton variant="primary" className="h-9 !w-max px-6" onClick={handleOpenDialog}>
            Tạo khóa học
          </CommonButton>
        </div>
        <div className="p-4">
          <CommonTable
            data={mockData}
            isLoading={false}
            columns={columns}
            page={page}
            totalPage={totalPage}
            totalDocs={totalDocs}
            onPageChange={setPage}
          />
        </div>
      </div>
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] max-h-full bg-gray-00 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Xoá khoá học
            </DialogTitle>
            <DialogDescription>
              <div className="text-gray-95 text-BodySm">
                Khoá học sau khi bị xoá sẽ không còn tồn tại trên hệ thống. Bạn có
                muốn xoá khoá học này không?
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setDeleteDialogOpen(false);
              }}
            >
              Thoát
            </CommonButton>
            <CommonButton
              variant="primary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setDeleteDialogOpen(false);
              }}
            >
              Từ chối
            </CommonButton>

          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CreateClassDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

    </>
  );
}
