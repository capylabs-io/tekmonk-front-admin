"use client";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  title: string;
  active: boolean;
  iconElement: ReactNode;
  url?: string;
};
const BASE_CLASS =
  "flex gap-x-3  px-3 py-4 rounded-xl items-center font-medium hover:bg-primary-25 hover:text-primary-600 cursor-pointer";
export const MenuCard = ({ title, active, url, iconElement }: Props) => {
  const router = useRouter();
  const handleOnClick = () => {
    url && router.push(url);
  };
  return (
    <div
      className={classNames(
        BASE_CLASS,
        active && "bg-primary-25 text-primary-600",
      )}
      onClick={handleOnClick}
    >
      {iconElement}
      <span>{title}</span>
    </div>
  );
};
