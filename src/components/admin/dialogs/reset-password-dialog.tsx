"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/common-types";
import { CommonButton } from "@/components/common/button/CommonButton";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
}

export const ResetPasswordDialog = ({
  open,
  onOpenChange,
  user,
  onConfirm,
}: ResetPasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-[400px]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-HeadingSm text-gray-95 p-0">
            Đặt lại mật khẩu
          </DialogTitle>
        </DialogHeader>
        <div className="text-BodySm  mt-4">
          <p>
            Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản{" "}
            <span className="font-semibold">
              {user?.fullName || user?.username}
            </span>
            ?
          </p>
          <p className="mt-2">
            Mật khẩu mới sẽ được đặt thành{" "}
            <span className="font-semibold">123123</span>.
          </p>
        </div>
        <DialogFooter className="items-center gap-2 mt-2">
          <div className="flex justify-between w-full">
            <CommonButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="w-[91px] h-12"
            >
              Hủy
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
