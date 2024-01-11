"use client";
import React from "react";
import { MenuCard } from "./MenuCard";
import classNames from "classnames";
import {
  Bell,
  BookOpenText,
  CircleUserRound,
  DoorClosed,
  Goal,
  GraduationCap,
  Home,
  Newspaper,
  ShoppingCart,
  User,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  customClassName?: string;
};
const BASE_CLASS = "grow";
export const MenuLayout = ({ customClassName }: Props) => {
  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <MenuCard
        title="Trang chủ"
        active={usePathname() === "/home"}
        iconElement={<Home size={20} />}
        url="/home"
      />
      <MenuCard
        active={usePathname() === "/student"}
        title="Học viên"
        iconElement={<User size={20} />}
        url="/student"
      />
      <MenuCard
        title="Giảng viên"
        active={usePathname().includes("/teacher")}
        iconElement={<GraduationCap size={20} />}
        url="/teacher"
      />
      <MenuCard
        title="Bài giảng"
        active={usePathname().includes("/course")}
        url="/course"
        iconElement={<BookOpenText size={20} />}
      />
      <MenuCard
        title="Lớp học"
        active={usePathname().includes("/classes")}
        iconElement={<DoorClosed size={20} />}
        url="/classes"
      />
      <MenuCard
        title="Tài khoản"
        active={usePathname().includes("/account")}
        iconElement={<CircleUserRound size={20} />}
        url="/account"
      />
    </div>
  );
};
