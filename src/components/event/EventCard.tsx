"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  imageUrl: string;
  title: string;
  createdAt: string;
  id?: string;
};
export const EventCard = ({ imageUrl, title, createdAt, id }: Props) => {
  const router = useRouter();

  const handleOnClick = () => {
    id && router.push(`event/${id}`);
  };
  return (
    <div className="w-[310px] cursor-pointer" onClick={handleOnClick}>
      <Image
        src={imageUrl}
        alt="new pic"
        width={337}
        height={100}
        className="rounded-xl"
      />
      <div className="w-full mt-2 text-base">{title}</div>
      <div className="w-full mt-2 text-sm text-primary-900">{createdAt}</div>
    </div>
  );
};
