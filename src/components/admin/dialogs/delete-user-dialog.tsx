"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/common-types";
import { CommonButton } from "@/components/common/button/CommonButton";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export const DeleteUserDialog = ({
  open,
  onOpenChange,
  user,
  onConfirm,
}: DeleteUserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-[368px]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-HeadingSm text-gray-95 p-0">
            Xóa tài khoản
          </DialogTitle>
        </DialogHeader>
        <div className="text-BodyMd text-gray-95 mt-4">
          Tài khoản sau khi bị xoá sẽ không còn tồn tại trên hệ thống. Bạn có
          muốn xoá tài khoản này không?
        </div>
        <DialogFooter className=" items-center gap-2 mt-2">
          <div className="flex justify-between w-full">
            <CommonButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="w-[91px] h-12"
            >
              Quay lại
            </CommonButton>
            <CommonButton
              variant="primary"
              onClick={onConfirm}
              className="w-[149px] h-12"
            >
              Xác nhận
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
