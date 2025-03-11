"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import {
  ReqCreateCourse,
  ReqGetCourses,
  ReqUpdateCourse,
  ReqDeleteCourse,
} from "@/requests/course";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
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
import qs from "qs";
import { CreateCourseDialog } from "@/components/admin/dialogs/create-course-dialog";

export default function Courses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<any | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
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
        return await ReqGetCourses(queryString);
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin khóa học");
      }
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: createCourseMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: any) => {
      return ReqCreateCourse(data);
    },
    onSuccess: () => {
      success("Thành công", "Đã tạo khóa học thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error creating course:", err);
      error("Lỗi", "Có lỗi xảy ra khi tạo khóa học");
    },
    onSettled: () => {
      hide();
      setIsDialogOpen(false);
    },
  });

  const { mutate: updateCourseMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => {
      const { id, ...dataUpdate } = data;
      return ReqUpdateCourse(id.toString(), dataUpdate);
    },
    onSuccess: () => {
      success("Thành công", "Đã cập nhật khóa học thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error updating course:", err);
      error("Lỗi", "Có lỗi xảy ra khi cập nhật khóa học");
    },
    onSettled: () => {
      hide();
      setIsDialogOpen(false);
      setCourseToEdit(null);
    },
  });

  const { mutate: deleteCourseMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => {
      return ReqDeleteCourse(id.toString());
    },
    onSuccess: () => {
      success("Thành công", "Đã xóa khóa học thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting course:", err);
      error("Lỗi", "Có lỗi xảy ra khi xóa khóa học");
    },
    onSettled: () => {
      hide();
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    },
  });

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setCourseToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (course: any) => {
    setDialogMode("edit");
    setCourseToEdit(course);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = (course: any) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete) return;

    show();
    deleteCourseMutation(courseToDelete.id);
  };

  const handleFormSubmit = (data: any) => {
    show();
    if (dialogMode === "create") {
      createCourseMutation(data);
    } else {
      updateCourseMutation({ ...data, id: courseToEdit?.id });
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Mã",
      cell: ({ row }) => <div>{row.original.code}</div>,
    },
    {
      header: "Tên khoá",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      header: "Loại",
      cell: ({ row }) => <span>{get(row, "original.type", "")}</span>,
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
              handleOpenEditDialog(row.original);
            }}
          >
            <Edit className="h-4 w-4" color="#7C6C80" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCourse(row.original);
            }}
          >
            <Trash2 className="h-4 w-4" color="#7C6C80" />
          </button>
        </div>
      ),
    },
  ];
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
          <CommonButton
            variant="primary"
            className="h-9 !w-max px-6"
            onClick={handleOpenCreateDialog}
          >
            Tạo khóa học
          </CommonButton>
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
            <DialogTitle className="text-xl">Xoá khoá học</DialogTitle>
            <DialogDescription>
              <div className="text-gray-95 text-BodySm">
                Khoá học sau khi bị xoá sẽ không còn tồn tại trên hệ thống. Bạn
                có muốn xoá khoá học này không?
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
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div>
        <CreateCourseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          courseToEdit={courseToEdit}
          mode={dialogMode}
        />
      </div>
    </>
  );
}
