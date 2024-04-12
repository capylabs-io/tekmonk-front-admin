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
  Newspaper,
  UserRoundPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Role } from "@/app/contants/role";
import { useUserStore } from "@/store/UserStore";
import { get } from "lodash";
import { ROUTES } from "@/const/routes";

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

  const renderNewsMenu = useMemo(
    () =>
      currentRole === Role.SUPERADMIN || currentRole === Role.ADMIN
        ? true
        : false,
    [currentRole]
  );

  const renderHiringMenu = useMemo(
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
        active={pathname === ROUTES.HOME}
        iconElement={<Home size={20} />}
        url={ROUTES.HOME}
      />
      {renderStudentMenu && (
        <MenuCard
          active={pathname === ROUTES.STUDENT}
          title="Học viên"
          iconElement={<User size={20} />}
          url={ROUTES.STUDENT}
        />
      )}
      {renderTeacherMenu && (
        <MenuCard
          title="Giảng viên"
          active={pathname.includes(ROUTES.TEACHER)}
          iconElement={<GraduationCap size={20} />}
          url={ROUTES.TEACHER}
        />
      )}
      {renderClassesMenu && (
        <MenuCard
          title="Lớp học"
          active={pathname.includes(ROUTES.CLASSES)}
          iconElement={<DoorClosed size={20} />}
          url={ROUTES.CLASSES}
        />
      )}
      {renderProjectMenu && (
        <MenuCard
          title="Dự án của học viên"
          active={pathname.includes(ROUTES.PROJECT)}
          iconElement={<CircleUserRound size={20} />}
          url={ROUTES.PROJECT}
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
      {renderNewsMenu && (
        <MenuCard
          title="Tin tức"
          active={pathname.includes(ROUTES.NEWS)}
          iconElement={<Newspaper size={20} />}
          url={ROUTES.NEWS}
        />
      )}
      {renderHiringMenu && (
        <MenuCard
          title="Tuyển dụng"
          active={pathname.includes(ROUTES.HIRING)}
          iconElement={<UserRoundPlus size={20} />}
          url={ROUTES.HIRING}
        />
      )}
    </div>
  );
};
