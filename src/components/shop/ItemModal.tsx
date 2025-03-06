import { useProfileStore } from "@/store/ProfileStore";
import { X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/button/Button";
import { InputFileUpdload } from "../common/InputFileUpload";
import { InputTags } from "../contest/InputTags";
type Props = {
  isShowing: boolean
  imageUrl: string;
  title: string;
  price: string;
  type: string;
  close: () => void
}
export const ItemModal = ({ isShowing, close, imageUrl, title, price, type }: Props) => {
  const [tags, setTags] = useState("");
  return isShowing && (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/60">
      <div className="relative mx-auto flex w-[440px] flex-col justify-center gap-y-4 rounded-3xl bg-white p-6">
        <div className="text-HeadingSm text-gray-95">
          Thông tin vật phẩm
        </div>
        <Image src={imageUrl} height={200} width={200} alt="test" className="rounded-xl mx-auto" />
        <div className="flex flex-col gap-y-2">
          <div className="text-SubheadMd flex items-center gap-x-2">
            <div className="text-gray-60">Tên:</div>
            <div className="text-gray-95">{title}</div>
          </div>
          <div className="text-SubheadMd flex items-center gap-x-2">
            <div className="text-gray-60">Loại:</div>
            <div className="text-gray-95">{type}</div>
          </div>
          <div className="text-SubheadMd flex items-center gap-x-2">
            <div className="text-gray-60">Giá:</div>
            <div className="text-gray-95">{price}</div>
          </div>
        </div>

        <div className="flex justify-between w-ful">
          <Button className=" !bg-gray-00 border border-gray-20 !text-primary-95 w-[100px]"
            style={{
              boxShadow:
                "0px 4px 0px #ebe4ec"
            }}
            onClick={close}>
            <div className="!text-sm !font-normal"> Thoát</div>
          </Button>
          <Button className="w-[150px] !font-medium border border-primary-70" style={{
            boxShadow:
              "0px 4px 0px #9a1595"
          }}>
            <div className="!text-sm !font-normal"> Mua vật phẩm</div>
          </Button>
        </div>
      </div>
    </div>
  )
};
