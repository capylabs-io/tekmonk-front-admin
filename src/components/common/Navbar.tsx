"use client";

import { ROUTE } from "@/contants/router";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuCard } from "@/components/home/MenuCard";
import { Bell, Goal, Home, Newspaper, Settings, ShoppingCart, User } from "lucide-react";
import { useCustomRouter } from "./router/CustomRouter";
import { useUserStore } from "@/store/UserStore";
import UserProfileLink from "./UserProfileLink";
import { get } from "lodash";
import { Role } from "@/contants/role";
import { useNavbarStore } from "@/store/navbar-store";

export const Navbar = () => {
  const router = useCustomRouter();

  /** UseStore */
  const [userInfo] = useUserStore((state) => [state.userInfo]);
  const [isExpand, setIsExpand] = useNavbarStore((state) => [
    state.isExpand,
    state.setIsExpand,
  ]);

  const userRole = get(userInfo, ["user_role", "code"], "");

  const handleRidirectHomePage = () => {
    router.push(ROUTE.MAIN);
  };

  // Helper function to check if the current user has one of the allowed roles
  const hasAccess = (allowedRoles: string[] | undefined) => {
    // If no roles specified, show to everyone
    if (!allowedRoles || allowedRoles.length === 0) return true;
    // Otherwise, check if user's role is in the allowed roles
    return allowedRoles.includes(userRole);
  };

  return (
    <div>
      <div className="h-full md:flex flex-col p-2  xl:w-[248px] w-[64px] hidden">
        <div className="grow-0">
          <Image
            src="/image/app-logo.png"
            alt="app logo"
            width={159}
            height={32}
            className="ml-1.5 xl:block hidden cursor-pointer"
            onClick={handleRidirectHomePage}
          />
        </div>
        <div className="flex flex-col grow mt-4">
          <MenuCard
            title="Tài khoản"
            active={usePathname().includes(ROUTE.ACCOUNT)}
            iconElement={<Home size={20} />}
            url={ROUTE.ACCOUNT}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            active={usePathname().includes(ROUTE.MY_CLASS)}
            title="Lớp của tôi"
            iconElement={<Bell size={20} />}
            url={ROUTE.MY_CLASS}
            hidden={!hasAccess([Role.CLASSMANAGEMENT, Role.TEACHER])}
          />
          {/* <MenuCard
              title="Phê duyệt"
              active={usePathname().includes(ROUTE.APPROVAL)}
              iconElement={<Goal size={20} />}
              url={ROUTE.APPROVAL}
            /> */}
          <MenuCard
            title="Quản lý lớp học"
            active={usePathname().includes(ROUTE.MANAGE_CLASS)}
            url={ROUTE.MANAGE_CLASS}
            iconElement={<ShoppingCart size={20} />}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Example: only admin and class management can see this
          />

          <MenuCard
            title="Tin tức"
            active={usePathname().includes(ROUTE.NEWS)}
            iconElement={<Newspaper size={20} />}
            url={ROUTE.NEWS}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Visible to all roles
          />
          <MenuCard
            title="Tuyển dụng"
            active={usePathname().includes(ROUTE.HIRING)}
            iconElement={<User size={20} />}
            url={ROUTE.HIRING}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Visible to all roles
          />
          <MenuCard
            title="Sự kiện"
            active={usePathname().includes(ROUTE.EVENTS)}
            iconElement={<User size={20} />}
            url={ROUTE.EVENTS}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Visible to all roles
          />
          <MenuCard
            title="Khóa học"
            active={usePathname().includes(ROUTE.COURSES)}
            iconElement={<User size={20} />}
            url={ROUTE.COURSES}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Visible to all roles
          />
          <MenuCard
            title="Phê duyệt"
            active={usePathname().includes(ROUTE.VERIFIED)}
            iconElement={<Goal size={20} />}
            url={ROUTE.VERIFIED}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Visible to all roles
          />
          <MenuCard
            title="Thành tích"
            active={usePathname().includes(ROUTE.ACHIEVEMENT)}
            iconElement={<Goal size={20} />}
            url={ROUTE.ACHIEVEMENT}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])} // Visible to all roles
          />
          <MenuCard
            title="Nhiệm vụ"
            active={usePathname().includes(ROUTE.MISSION)}
            iconElement={<Goal size={20} />}
            url={ROUTE.MISSION}
          />
          <MenuCard
            title="Cấu hình Chứng chỉ"
            active={usePathname().includes(ROUTE.CERTIFICATE_CONFIG)}
            iconElement={<Settings size={20} />}
            url={ROUTE.CERTIFICATE_CONFIG}
          />
          <MenuCard
            title="Xin cấp Chứng chỉ"
            active={usePathname().includes(ROUTE.CERTIFICATE_REQUEST)}
            iconElement={<Goal size={20} />}
            url={ROUTE.CERTIFICATE_REQUEST}
          />
          <MenuCard
            title="Quản lý Chứng chỉ"
            active={usePathname().includes(ROUTE.CERTIFICATE)}
            iconElement={<Goal size={20} />}
            url={ROUTE.CERTIFICATE}
          />
        </div>

        <UserProfileLink
          userName={get(userInfo, ["username"], "")}
          userRank={userRole}
        />
      </div>
    </div>
  );
};
