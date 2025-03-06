"use client";
import React, { useState } from "react";
import Image from "next/image";

type Props = {
  imageUrl: string;
  title: string;
  price: string;
  isPurchased?: boolean;
  onClick?: () => void;
};
import { Copy } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/Dialog";

import { Button } from "../common/button/Button";
import { Label } from "../common/Label";
import * as DialogPrimitive from "@radix-ui/react-dialog";
export const BackgroundCard = ({
  imageUrl,
  title,
  price,
  isPurchased,
  onClick,
}: Props) => {
  const [purchased, setPurchased] = useState(false);
  const handleOnClick = () => {
    onClick && onClick?.();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-[170px] cursor-pointer" onClick={handleOnClick}>
          <Image
            src={imageUrl}
            alt="avatar pic"
            width={170}
            height={100}
            className="rounded-xl"
          />
          <div className="w-full mt-2 text-sm text-black truncate text-left">
            {title}
          </div>
          <div className="w-full mt-2 text-sm text-primary-900 flex gap-x-2">
            <Image
              src="/image/home/coin.png"
              alt="coin pic"
              width={24}
              height={24}
            />
            {price}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!purchased ? (
          <>
            <div className="w-full flex justify-center">
              <div className="text-SubheadLg">Thông tin item</div>
            </div>
            <hr className="border-t border-gray-200" />
            <div className="w-full flex flex-col items-center justify-center gap-y-5">
              <div className="text-bodySm text-gray-600">
                Item đã mua không thể hoàn lại và chỉ mua được một lần.
              </div>
              <Image
                src={imageUrl}
                alt="avatar pic"
                width={200}
                height={200}
                className="rounded-xl"
              />
              <div className="flex flex-col items-center">
                <div className="text-bodyMd">Hình nền</div>
                <div className="text-SubheadLg">{title}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex justify-center">
              <div className="text-SubheadLg">Thông tin item</div>
            </div>
            <hr className="border-t border-gray-200" />
            <div className="w-full flex flex-col items-center justify-center gap-y-5">
              <Image
                src={imageUrl}
                alt="avatar pic"
                width={200}
                height={200}
                className="rounded-xl"
              />
              <div className="flex flex-col items-center">
                <div className="text-SubheadLg">{title}</div>
                <div className="text-bodyMd">Hình nền</div>
              </div>
              <div className="text-bodySm text-gray-600">
                Item đã mua không thể hoàn lại và chỉ mua được một lần.
              </div>
            </div>
          </>
        )}

        <DialogFooter className="sm:justify-center">
          <DialogClose>
            <Button outlined className="!px-12 !rounded-3xl text-base !py-2">
              Huỷ
            </Button>
          </DialogClose>
          {!purchased ? (
            <Button
              className="!px-12 !rounded-3xl text-base !py-2"
              onClick={() => setPurchased((prev) => !prev)}
            >
              Mua
            </Button>
          ) : (
            <Button className="!px-12 !rounded-3xl text-base !py-2">
              Đến kho đồ
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
