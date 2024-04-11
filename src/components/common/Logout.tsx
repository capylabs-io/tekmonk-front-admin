"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();
  const handleLogout = () => {
    useUserStore.getState().clear();
    router.push("/login");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="grow-0 p-3 w-full flex items-center">
          <LogOut size={18} className="text-red-500 mr-4" />
          <div className="text-black">Đăng xuất</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-6">
          <span>Xác nhận đăng xuất</span>
          <div>Bạn chắc chắn muốn đăng xuất tài khoản chứ?</div>
          <DialogFooter className="sm:justify-end px-6 mt-12">
            <DialogClose className="!rounded-xl text-sm px-6 py-3 border">
              Huỷ
            </DialogClose>
            <Button
              className="!rounded-xl text-sm !py-2"
              onClick={handleLogout}
            >
              Chắc chắn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
