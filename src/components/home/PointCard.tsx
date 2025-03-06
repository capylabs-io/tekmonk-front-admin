"use client";
import React from "react";
import Image from "next/image";
import classNames from "classnames";

type Props = {
  point: string;
  customClassName?: string;
};
const BASE_CLASS =
  "rounded-xl border border-gray-200 p-4 flex justify-between text-primary-900 items-center";
export const PointCard = ({ point, customClassName }: Props) => {
  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <span className="text-sm">KHO ĐIỂM</span>
      <div className="flex gap-x-1">
        <span className="font-bold text-base">{point}</span>
        <Image
          src="/image/home/coin.png"
          alt="coin pic"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};
