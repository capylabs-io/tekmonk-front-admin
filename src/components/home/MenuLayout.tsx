"use client";
import React, { useMemo } from "react";
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

  const pathname = usePathname();

  // const renderDashboard = useMemo(
  //   () =>
  //     currentRole === Role.SUPERADMIN || currentRole === Role.ADMIN
  //       ? true
  //       : false,
  //   [currentRole]
  // );

  const renderStudentMenu = useMemo(
    () =>
      currentRole === Role.SUPERADMIN ||
      currentRole === Role.ADMIN ||
      currentRole === Role.TEACHER
        ? true
        : false,
    [currentRole]
  );

  const renderTeacherMenu = useMemo(
    () =>
      currentRole === Role.SUPERADMIN ||
      currentRole === Role.ADMIN ||
      (currentRole === Role.TEACHER && pathname.includes("/teacher"))
        ? true
        : false,
    [currentRole, pathname]
  );

  const renderClassesMenu = useMemo(
    () =>
      currentRole === Role.SUPERADMIN ||
      currentRole === Role.ADMIN ||
      (currentRole === Role.TEACHER && pathname.includes("/classes"))
        ? true
        : false,
    [currentRole, pathname]
  );

  const renderPostsMenu = useMemo(
    () => currentRole === Role.COLLABORATOR,
    [currentRole]
  );

  const renderProjectMenu = useMemo(
    () =>
      currentRole === Role.SUPERADMIN || currentRole === Role.ADMIN
        ? true
        : false,
    [currentRole]
  );

  const renderAdvertisementMenu = useMemo(
    () =>
      currentRole === Role.SUPERADMIN || currentRole === Role.ADMIN
        ? true
        : false,
    [currentRole]
  );

  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <MenuCard
        title="Dashboard"
        active={pathname === "/home"}
        iconElement={<Home size={20} />}
        url="/home"
      />
      {renderStudentMenu && (
        <MenuCard
          active={pathname === "/student"}
          title="Học viên"
          iconElement={<User size={20} />}
          url="/student"
        />
      )}
      {renderTeacherMenu && (
        <MenuCard
          title="Giảng viên"
          active={pathname.includes("/teacher")}
          iconElement={<GraduationCap size={20} />}
          url="/teacher"
        />
      )}
      {renderClassesMenu && (
        <MenuCard
          title="Lớp học"
          active={pathname.includes("/classes")}
          iconElement={<DoorClosed size={20} />}
          url="/classes"
        />
      )}
      {renderProjectMenu && (
        <MenuCard
          title="Dự án của học viên"
          active={pathname.includes("/product")}
          iconElement={<CircleUserRound size={20} />}
          url="/product"
        />
      )}
      {renderPostsMenu && (
        <MenuCard
          title="Đăng bài"
          active={pathname.includes("/post")}
          url="/post"
          iconElement={<BookOpenText size={20} />}
        />
      )}
      {renderAdvertisementMenu && (
        <MenuCard
          title="Quảng cáo"
          active={pathname.includes("/advertisement")}
          iconElement={<CircleUserRound size={20} />}
          url="/advertisement"
        />
      )}
    </div>
  );
};
