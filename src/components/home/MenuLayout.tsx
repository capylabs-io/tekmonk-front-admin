"use client";
import React from "react";
import { MenuCard } from "./MenuCard";
import classNames from "classnames";
import {
  Bell,
  Goal,
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
        active={usePathname() === "/trang-chu"}
        iconElement={<Home size={20} />}
        url="/trang-chu"
      />
      <MenuCard
        active={usePathname() === "/thong-bao"}
        title="Thông báo"
        iconElement={<Bell size={20} />}
        url="/thong-bao"
      />
      <MenuCard
        title="Nhiệm vụ"
        active={usePathname().includes("/nhiem-vu")}
        iconElement={<Goal size={20} />}
        url="/nhiem-vu"
      />
      <MenuCard
        title="Cửa hàng"
        active={usePathname().includes("/cua-hang")}
        url="/cua-hang"
        iconElement={<ShoppingCart size={20} />}
      />
      <MenuCard
        title="Bảng xếp hạng"
        active={usePathname().includes("/bang-xep-hang")}
        iconElement={<Zap size={20} />}
        url="/bang-xep-hang"
      />
      {/* <MenuCard
        title="Tin tức"
        active={usePathname().includes("/tin-tuc")}
        iconElement={<Newspaper size={20} />}
        url="/tin-tuc"
      /> */}
      <MenuCard
        title="Hồ sơ"
        active={usePathname() === "/trang-chu/ho-so"}
        iconElement={<User size={20} />}
        url="/trang-chu/ho-so"
      />
    </div>
  );
};
