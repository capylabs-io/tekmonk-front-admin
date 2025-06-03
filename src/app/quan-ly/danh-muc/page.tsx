"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
import { Input } from "@/components/common/Input";
import {
  ReqCreateCategory,
  ReqUpdateCategory,
  ReqDeleteCategory,
  ReqGetCategory,
} from "@/requests/category";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
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
import { useDebounce } from "@/hooks/useDebounceValue";
const CreateCategoryDialog = dynamic(
  () =>
    import("@/components/admin/dialogs/create-category-dialog").then(
      (mod) => mod.CreateCategoryDialog
    ),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

// Simple loading component
const LoadingState = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div
      className="w-[300px] h-[200px] bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/admin/empty-data.png')" }}
    />
    <p className="text-gray-500 mt-4">Không có dữ liệu</p>
    <p className="text-gray-500">Tạo danh mục mới để bắt đầu</p>
    <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
      Tạo danh mục
    </button>
  </div>
);

export default function Categories() {
  // All state declarations
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchQueryDebounce = useDebounce(searchQuery, 1000);

  /* UseStore */
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { show, hide } = useLoadingStore();

  /* UseQuery */
  const { data: categories, refetch } = useQuery({
    queryKey: ["category", page, pageSize, searchQueryDebounce],
    queryFn: async () => {
      try {
        const filters: any = {};

        // Add search filters if search query exists
        if (searchQueryDebounce) {
          filters.$or = [
            {
              name: {
                $containsi: searchQueryDebounce,
              },
            },
            {
              code: {
                $containsi: searchQueryDebounce,
              },
            },
          ];
        }

        const queryString = qs.stringify({
          pagination: {
            page,
            pageSize: pageSize,
          },
          filters,
        });
        return await ReqGetCategory(queryString);
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin danh mục");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted, // Only run query when component is mounted
  });

  const { mutate: createCategoryMutation, isPending: isCreating } = useMutation(
    {
      mutationFn: (data: any) => {
        return ReqCreateCategory(data);
      },
      onSuccess: () => {
        success("Thành công", "Đã tạo khóa học thành công");
        refetch();
      },
      onError: (err) => {
        console.error("Error creating Category:", err);
        error("Lỗi", "Có lỗi xảy ra khi tạo khóa học");
      },
      onSettled: () => {
        hide();
        setIsDialogOpen(false);
      },
    }
  );

  const { mutate: updateCategoryMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: (data: any) => {
        const { id, ...dataUpdate } = data;
        return ReqUpdateCategory(id.toString(), dataUpdate);
      },
      onSuccess: () => {
        success("Thành công", "Đã cập nhật danh mục thành công");
        refetch();
      },
      onError: (err) => {
        console.error("Error updating Category:", err);
        error("Lỗi", "Có lỗi xảy ra khi cập nhật danh mục");
      },
      onSettled: () => {
        hide();
        setIsDialogOpen(false);
        setCategoryToEdit(null);
      },
    }
  );

  const { mutate: deleteCategoryMutation, isPending: isDeleting } = useMutation(
    {
      mutationFn: (id: number) => {
        return ReqDeleteCategory(id.toString());
      },
      onSuccess: () => {
        success("Thành công", "Đã xóa danh mục thành công");
        refetch();
      },
      onError: (err) => {
        console.error("Error deleting Category:", err);
        error("Lỗi", "Có lỗi xảy ra khi xóa danh mục");
      },
      onSettled: () => {
        hide();
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      },
    }
  );

  // Effect hooks
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handler functions
  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setCategoryToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (category: any) => {
    setDialogMode("edit");
    setCategoryToEdit(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (category: any) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    show();
    deleteCategoryMutation(categoryToDelete.id);
  };

  const handleFormSubmit = (data: any) => {
    show();
    // Handle transform data
    const courseData = {
      ...data,
    };
    if (dialogMode === "create") {
      createCategoryMutation(courseData);
    } else {
      updateCategoryMutation({ ...courseData, id: categoryToEdit?.id });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Mã",
      cell: ({ row }) => <span>{get(row, "original.code", "")}</span>,
    },
    {
      header: "Tên danh mục",
      cell: ({ row }) => <span>{row.original.name}</span>,
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
              handleDeleteCategory(row.original);
            }}
          >
            <Trash2 className="h-4 w-4" color="#7C6C80" />
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
              <div className="text-SubheadLg text-gray-95">Danh mục</div>
            </div>
          </div>
          <CommonButton
            variant="primary"
            className="h-9 !w-max px-6"
            onClick={handleOpenCreateDialog}
          >
            Tạo danh mục
          </CommonButton>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã danh mục..."
            customClassNames="max-w-[320px] m-2"
            value={searchQuery}
            onChange={handleSearch}
            isSearch={true}
          />
        </div>
        <div className="p-4">
          {categories && (
            <CommonTable
              data={categories?.data}
              isLoading={false}
              columns={columns}
              page={page}
              totalPage={categories.meta.pagination.pageCount}
              totalDocs={categories.meta.pagination.total}
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
            <DialogTitle className="text-xl">Xoá danh mục</DialogTitle>
            <DialogDescription>
              <div className="text-gray-95 text-BodySm">
                Danh mục sau khi bị xoá sẽ không còn tồn tại trên hệ thống. Bạn
                có muốn xoá danh mục này không?
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
      <Suspense fallback={<div>Loading...</div>}>
        {isMounted && (
          <CreateCategoryDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleFormSubmit}
            categoryToEdit={categoryToEdit}
            mode={dialogMode}
          />
        )}
      </Suspense>
    </>
  );
}
