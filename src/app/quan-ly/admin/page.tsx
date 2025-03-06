"use client";

import { CreateClassDialog } from "@/components/admin/CreateClassDialog";
import { DeleteClassDialog } from "@/components/admin/dialogs/delete-class-dialog";
import StudentTablePagination from "@/components/admin/student-table-pagination";
import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReqDeleteClass, ReqGetClasses } from "@/requests/class";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Class } from "@/types/common-types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "qs";
import { useState } from "react";

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
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* UseStore */
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { show, hide } = useLoadingStore();

  /* UseQuery */
  const { data: classes, refetch } = useQuery({
    queryKey: ["class", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          populate: "*",
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
          },
        });
        return await ReqGetClasses(queryString);
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

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
        <div className="p-4 flex-1">
          {classes && classes.meta.pagination.total === 0 ? (
            <EmptyState />
          ) : (
            <div className="rounded-md border min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Mã lớp</TableHead>
                    <TableHead>Tên khóa</TableHead>
                    <TableHead>Tên giảng viên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-BodySm">
                  {classes &&
                    classes.data.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer">
                        <TableCell className="text-right">{item.id}</TableCell>
                        <TableCell>
                          <div
                            className="max-w-[200px] truncate"
                            title={item.code}
                          >
                            {item.code}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-[150px] truncate"
                            title={item.course?.name}
                          >
                            {item.course?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-[200px] truncate"
                            title={item.teacher?.username}
                          >
                            {item.teacher?.username}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[100px] truncate">
                            {new Date(item.endTime) > new Date()
                              ? "Đang diễn ra"
                              : "Đã kết thúc"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-2 hover:bg-gray-100 rounded-full"
                              onClick={() =>
                                router.push(`/quan-ly/admin/${item.id}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-100 rounded-full"
                              onClick={() => handleDeleteClass(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        {classes && (
          <StudentTablePagination
            totalItems={classes.meta.pagination.total}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
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
