"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

type Props = {
  imageUrl: string;
  title: string;
  price: string;
  isOwner?: boolean;
  onClick?: () => void;
};
export const AvatarCard = ({ imageUrl, title, price, onClick, isOwner }: Props) => {
  const [isPurchased, setIsPurchased] = useState(false)
  const handleOnClick = () => {
    onClick && onClick?.();
  };
  const handlePurchased = () => {
    setIsPurchased((prev) => !prev)
  }
  return (
    <div className="w-[170px] cursor-pointer" >
      <Image
        src={imageUrl}
        alt="avatar pic"
        width={170}
        height={100}
        className="rounded-xl"
      />
      <div className="w-full mt-2 text-sm text-black truncate">{title}</div>
      {
        isPurchased ?
          <div className="p-0.5 bg-green-400 w-max rounded-full flex items-center justify-center mt-1">
            <Check size={16} color="white" />
          </div>
          :
          <div className="w-full mt-1 text-sm text-primary-900 flex gap-x-2 items-center" onClick={handleOnClick}>
            <Image
              src="/image/home/coin.png"
              alt="coin pic"
              width={18}
              height={18}
              className="shadow-xl"
            />
            <div className="text-BodyXs text-gray-95">
              {price}
            </div>
          </div>
      }
    </div>
  );
};
