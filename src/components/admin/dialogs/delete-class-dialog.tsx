"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import { Class } from "@/types/common-types";

interface DeleteClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteClassDialog = ({
  open,
  onOpenChange,
  classData,
  onConfirm,
  isLoading = false,
}: DeleteClassDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            Xóa lớp học
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-95 text-BodySm">
            Bạn có chắc chắn muốn xóa lớp học{" "}
            <span className="font-semibold">{classData?.name}</span>?
          </p>
          <p className="text-gray-95 mt-2 text-BodySm">
            Hành động này không thể hoàn tác và tất cả dữ liệu liên quan đến lớp
            học này sẽ bị xóa vĩnh viễn.
          </p>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <CommonButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </CommonButton>
          <CommonButton
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Đang xóa..." : "Xóa lớp học"}
          </CommonButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
