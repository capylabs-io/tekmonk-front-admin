"use client"
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/common/Dialog";
export default function Account() {
  const handleOnClick = () => {
    
  };
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Học Sinh
      </div>
      <hr className="bg-gray-200 w-full my-4" />
      <div className="border rounded-xl border-gray-200 mx-8 w-2/3 grid grid-cols-5 p-4">
        <div className="col-span-2 my-auto">
          <div className="text-SubheadSm !font-normal">
            Ảnh đại diện
          </div>
          <div className="text-SubheadSm !font-normal text-gray-400">
            Hình ảnh hiển
          </div>
        </div>
        <div className="col-span-3 flex justify-between">
          <div className="h-14 w-14 rounded-full flex flex-col bg-[url('/image/home/profile-pic.png')] bg-no-repeat bg-contain bg-yellow-100 items-center justify-center" />
          <div className="flex items-start gap-x-6">
            <Button className="bg-transparent !text-black text-SubheadSm !p-0">Xoá</Button>
            <Button className="bg-transparent !text-primary-600 text-SubheadSm !p-0">Cập nhật</Button>
          </div>
        </div>
      </div>
      <div className="border rounded-xl border-gray-200 mx-8 w-2/3 p-4 mt-4">
        <div className="grid grid-cols-5">
          <div className="col-span-2 my-auto">
            <div className="text-SubheadSm !font-normal">
              Tên thành viên
            </div>
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              placeholder="Nhập tên thành viên"
              customInputClassNames="text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-4">
          <div className="col-span-2 my-auto">
            <div className="text-SubheadSm !font-normal">
              Số điện thoại
            </div>
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              placeholder="Nhập số điện thoại"
              customInputClassNames="text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-4">
          <div className="col-span-2 my-auto">
            <div className="text-SubheadSm !font-normal">
              Địa chỉ
            </div>
          </div>
          <div className="col-span-3">
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              customInputClassNames="text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-4">
          <div className="col-span-2 my-auto">
            <div className="text-SubheadSm !font-normal">
              Mật khẩu
            </div>
          </div>
          <div className="col-span-3">
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              customInputClassNames="text-sm"
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-transparent !text-primary-600 text-SubheadSm !p-0">Đổi mật khẩu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogFooter className="sm:justify-center">
                <DialogClose>
                  <Button outlined className="!px-12 !rounded-3xl text-base !py-2">
                    Huỷ
                  </Button>
                </DialogClose>
                <Button
                  className="!px-12 !rounded-3xl text-base !py-2"
                >
                  Mua
                </Button>

              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div >
    </>
  );
}