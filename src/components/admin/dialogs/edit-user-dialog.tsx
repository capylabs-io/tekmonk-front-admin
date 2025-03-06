"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/ui/label";
import { CommonButton } from "@/components/common/button/CommonButton";
import { User } from "@/types/common-types";
import { useState } from "react";
import { ResetPasswordDialog } from "./reset-password-dialog";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserChange: (user: User | null) => void;
  onSubmit: () => void;
  onDeactivate: () => void;
  onResetPassword: (userId: number) => void;
}

export const EditUserDialog = ({
  open,
  onOpenChange,
  user,
  onUserChange,
  onSubmit,
  onDeactivate,
  onResetPassword,
}: EditUserDialogProps) => {
  const [resetPasswordConfirmOpen, setResetPasswordConfirmOpen] =
    useState(false);

  const handleResetPasswordClick = () => {
    setResetPasswordConfirmOpen(true);
  };

  const handleConfirmResetPassword = () => {
    if (user) {
      onResetPassword(user.id);
      setResetPasswordConfirmOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            Thay đổi tài khoản học viên
          </DialogTitle>
          <div className="text-BodyMd text-gray-60 mb-4">
            Mật khẩu mặc định là 123123
          </div>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">Tên tài khoản</div>
              <Input
                id="username"
                value={user?.username || ""}
                onChange={(e) =>
                  onUserChange(user ? { ...user, username: e } : null)
                }
                type="text"
                placeholder="Nhập thông tin"
                customClassNames="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">Email</div>
              <Input
                type="email"
                id="email"
                value={user?.email || ""}
                onChange={(e) =>
                  onUserChange(user ? { ...user, email: e } : null)
                }
                placeholder="Nhập thông tin"
                customClassNames="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">Tên học viên</div>
              <Input
                id="fullName"
                value={user?.fullName || ""}
                onChange={(e) =>
                  onUserChange(user ? { ...user, fullName: e } : null)
                }
                type="text"
                placeholder="Nhập thông tin"
                customClassNames="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">
                Ngày tháng năm sinh
              </div>
              <Input
                id="dateOfBirth"
                type="date"
                value={user?.dateOfBirth || ""}
                onChange={(e) =>
                  onUserChange(user ? { ...user, dateOfBirth: e } : null)
                }
                placeholder="DD/MM/YYYY"
                customClassNames="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">
                Tên phụ huynh đại diện{" "}
                <span className="text-BodyMd text-gray-60">
                  (không bắt buộc)
                </span>
              </div>
              <Input
                id="parentName"
                type="text"
                value={user?.parentName || ""}
                onChange={(e) =>
                  onUserChange(user ? { ...user, parentName: e } : null)
                }
                placeholder="Nhập thông tin"
                customClassNames="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">
                Số điện thoại{" "}
                <span className="text-BodyMd text-gray-60">
                  (không bắt buộc)
                </span>
              </div>
              <Input
                id="parentPhoneNumber"
                type="tel"
                value={user?.parentPhoneNumber || ""}
                onChange={(e) =>
                  onUserChange(user ? { ...user, parentPhoneNumber: e } : null)
                }
                placeholder="Nhập thông tin"
                customClassNames="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <CommonButton
              className=" h-11"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Quay lại
            </CommonButton>
            <div className="flex gap-2">
              <CommonButton
                variant="secondary"
                onClick={onDeactivate}
                className="h-11 w-[139px]"
              >
                {user?.blocked ? "Kích hoạt" : "Vô hiệu hóa"}
              </CommonButton>
              <CommonButton
                variant="secondary"
                onClick={handleResetPasswordClick}
                className="h-11"
              >
                Đặt lại mật khẩu
              </CommonButton>
              <CommonButton onClick={onSubmit} className="h-11 w-[139px]">
                Lưu thay đổi
              </CommonButton>
            </div>
          </div>
        </div>

        {resetPasswordConfirmOpen && (
          <ResetPasswordDialog
            open={resetPasswordConfirmOpen}
            onOpenChange={setResetPasswordConfirmOpen}
            user={user}
            onConfirm={handleConfirmResetPassword}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
