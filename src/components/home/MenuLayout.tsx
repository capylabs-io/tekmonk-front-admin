/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import { MenuCard } from "./MenuCard";
import classNames from "classnames";
import {
  BookOpenText,
  CircleUserRound,
  DoorClosed,
  GraduationCap,
  Home,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Role } from "@/app/contants/role";
import { useUserStore } from "@/store/UserStore";
import { get } from "lodash";

type Props = {
  customClassName?: string;
};
const BASE_CLASS = "grow";
export const MenuLayout = ({ customClassName }: Props) => {
  const currentRole = useUserStore((state) =>
    get(state.userInfo, "role.name", "").toLowerCase()
  );

  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      {(currentRole === Role.SUPERADMIN || currentRole === Role.ADMIN) && (
        <MenuCard
          title="Dashboard"
          active={usePathname() === "/home"}
          iconElement={<Home size={20} />}
          url="/home"
        />
      )}
      {(currentRole === Role.SUPERADMIN ||
        currentRole === Role.ADMIN ||
        currentRole === Role.TEACHER) && (
        <MenuCard
          active={usePathname() === "/student"}
          title="Học viên"
          iconElement={<User size={20} />}
          url="/student"
        />
      )}
      {currentRole === Role.SUPERADMIN ||
        (currentRole === Role.ADMIN && (
          <MenuCard
            title="Giảng viên"
            active={usePathname().includes("/teacher")}
            iconElement={<GraduationCap size={20} />}
            url="/teacher"
          />
        ))}
      {currentRole === Role.SUPERADMIN ||
        ((currentRole === Role.ADMIN || currentRole === Role.TEACHER) && (
          <MenuCard
            title="Lớp học"
            active={usePathname().includes("/classes")}
            iconElement={<DoorClosed size={20} />}
            url="/classes"
          />
        ))}
      {currentRole === Role.COLLABORATOR && (
        <MenuCard
          title="Tin tức"
          active={usePathname().includes("/new")}
          url="/new"
          iconElement={<BookOpenText size={20} />}
        />
      )}
      {(currentRole === Role.SUPERADMIN || currentRole === Role.ADMIN) && (
        <MenuCard
          title="Dự án của học viên"
          active={usePathname().includes("/product")}
          iconElement={<CircleUserRound size={20} />}
          url="/product"
        />
      )}
      <MenuCard
        title="Tuyển dụng"
        active={usePathname().includes("/recruitment")}
        iconElement={<CircleUserRound size={20} />}
        url="/recruitment"
      />
      <MenuCard
        title="Quảng cáo"
        active={usePathname().includes("/advertisement")}
        iconElement={<CircleUserRound size={20} />}
        url="/advertisement"
      />
    </div>
  );
};
