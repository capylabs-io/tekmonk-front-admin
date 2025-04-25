"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTable } from "@/components/common/CommonTable";
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
import { CreateShopItem } from "@/components/shop/CreateShopItem";
import { ReqCreateShopItem, ReqDeleteShopItem, ReqGetShopItem, ReqUpdateShopItem, ReqUpdateShopItemWithImage } from "@/requests/shop";
import Image from "next/image";
import { ShopItemEnum } from "@/types/shop";


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

export default function ConfigShop() {
  // All state declarations
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToEdit, setShopItemToEdit] = useState<any | null>(null);
  const [courseToDelete, setShopItemToDelete] = useState<any | null>(null);
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
          populate: ["category"],
          pagination: {
            page,
            pageSize: pageSize,
          },
        });
        return await ReqGetShopItem(queryString);
      } catch (err) {
        error("Lỗi", "Không thể lấy thông tin vật phẩm");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted, // Only run query when component is mounted
  });
  const { mutate: createShopItemMutation, isPending: isCreating } = useMutation({
    mutationFn: async (data: any) => {
      const { image, ...dataUpdate } = data;
      const formData = new FormData();
      formData.append("name", dataUpdate.name);
      formData.append("price", dataUpdate.price);
      formData.append("description", dataUpdate.description);
      formData.append("category", dataUpdate.category.id);
      formData.append("type", dataUpdate.type);
      formData.append("quantity", dataUpdate.quantity);
      if (image) {
        formData.append("image", image);
      }
      return await ReqCreateShopItem(formData);
    },
    onSuccess: () => {
      success("Thành công", "Đã tạo vật phẩm thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error creating course:", err);
      error("Lỗi", "Có lỗi xảy ra khi tạo vật phẩm");
    },
    onSettled: () => {
      hide();
      setIsDialogOpen(false);
    },
  });
  const { mutate: updateShopItemMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => {
      const { id, image, ...dataUpdate } = data;
      if (image && image instanceof File) {
        // Xử lý cập nhật với hình ảnh mới
        const formData = new FormData();
        formData.append("name", dataUpdate.name);
        formData.append("price", dataUpdate.price);
        formData.append("description", dataUpdate.description);
        formData.append("category", dataUpdate.category.id);
        formData.append("type", dataUpdate.type);
        formData.append("quantity", dataUpdate.quantity);
        formData.append('image', image);
        // Bỏ trường image ra khỏi dữ liệu

        return ReqUpdateShopItemWithImage(id.toString(), formData);
      } else {
        // Cập nhật bình thường không có hình ảnh mới
        return ReqUpdateShopItem(id.toString(), dataUpdate);
      }
    },
    onSuccess: () => {
      success("Thành công", "Đã cập nhật vật phẩm thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error updating course:", err);
      error("Lỗi", "Có lỗi xảy ra khi cập nhật vật phẩm");
    },
    onSettled: () => {
      hide();
      setIsDialogOpen(false);
      setShopItemToEdit(null);
    },
  });

  const { mutate: deleteShopItemMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => {
      return ReqDeleteShopItem(id.toString());
    },
    onSuccess: () => {
      success("Thành công", "Đã xóa vật phẩm thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting course:", err);
      error("Lỗi", "Có lỗi xảy ra khi xóa vật phẩm");
    },
    onSettled: () => {
      hide();
      setDeleteDialogOpen(false);
      setShopItemToDelete(null);
    },
  });

  // Effect hooks
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handler functions
  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setShopItemToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (course: any) => {
    setDialogMode("edit");
    setShopItemToEdit(course);
    setIsDialogOpen(true);
  };

  const handleDeleteShopItem = (course: any) => {
    setShopItemToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete) return;
    show();
    deleteShopItemMutation(courseToDelete.id);
  };

  const handleFormSubmit = (data: any, image?: File | null) => {
    show();

    if (dialogMode === "create") {
      createShopItemMutation({ ...data, image: image });
    } else {
      updateShopItemMutation({ ...data, id: courseToEdit?.id, image: image });
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Tên vật phẩm",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      header: "Hình ảnh",
      cell: ({ row }) => <div>
        <Image
          src={row.original.image || ''}
          alt="avatar pic"
          width={170}
          height={100}
          className="rounded-xl max-h-[100px] max-w-[170px] object-cover"
        />

      </div>,
    },
    {
      header: "Số lượng",
      cell: ({ row }) => <span>{row.original.type === ShopItemEnum.VIRTUAL ? 'Không giới hạn' : row.original.quantity}</span>,
    },
    {
      header: "Loại vật phẩm",
      cell: ({ row }) => <span>{get(row, "original.category.name", "")}</span>,
    },
    {
      header: "Giá tiền",
      cell: ({ row }) => <span>{row.original.price}</span>,
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
              handleDeleteShopItem(row.original);
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
              <div className="text-SubheadLg text-gray-95">Cấu hình cửa hàng</div>
            </div>
          </div>
          <CommonButton
            variant="primary"
            className="h-9 !w-max px-6"
            onClick={handleOpenCreateDialog}
          >
            Tạo vật phẩm
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
            <DialogTitle className="text-xl">Xoá vật phẩm</DialogTitle>
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
      <Suspense fallback={<div>Loading...</div>}>
        {isMounted && (
          <CreateShopItem open={isDialogOpen} initialData={courseToEdit} onOpenChange={setIsDialogOpen} onSubmit={handleFormSubmit} isEdit={dialogMode === "edit"} />
        )}
      </Suspense>
    </>
  );
}
