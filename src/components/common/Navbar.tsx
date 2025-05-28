"use client";

import { ROUTE } from "@/contants/router";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuCard } from "@/components/home/MenuCard";
import {
  Award,
  Bell,
  FileBadge,
  FileCheck,
  Flag,
  Goal,
  Home,
  List,
  ListOrdered,
  Newspaper,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Ticket,
  User,
} from "lucide-react";
import { useCustomRouter } from "./router/CustomRouter";
import { useUserStore } from "@/store/UserStore";
import UserProfileLink from "./UserProfileLink";
import { get } from "lodash";
import { Role } from "@/contants/role";
import { useNavbarStore } from "@/store/navbar-store";
import { MyClassIcon } from "./navbar/MyClassIcon";
import { ClassManagementIcon } from "./navbar/ClassManagementIcon";
import { CourseManagementIcon } from "./navbar/CourseManagementIcon";
import { HiringIcon } from "./navbar/HiringIcon";
import { EventIcon } from "./navbar/EventIcon";
import { AchievementIcon } from "./navbar/AchievementIcon";

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

  const pathname = usePathname();

  return (
    <div>
      <div className="h-full md:flex flex-col p-3 xl:w-[248px] w-[64px] hidden bg-gradient-to-b from-white to-gray-50/30 border-r border-gray-100">
        <div className="grow-0 pb-4">
          <Image
            src="/image/app-logo.png"
            alt="app logo"
            width={159}
            height={32}
            className="ml-1.5 xl:block hidden cursor-pointer transition-transform hover:scale-105"
            onClick={handleRidirectHomePage}
          />
        </div>
        <div className="flex flex-col grow mt-2 overflow-y-auto gap-1 custom-scrollbar pr-1">
          {/* Group 1: tài khoản, lớp học, khóa học */}
          <div className="xl:px-3 py-2 mb-1">
            <div className="xl:flex items-center gap-2 hidden">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <p className="text-xs text-gray-600 font-semibold tracking-wide uppercase">
                Quản lý chính
              </p>
            </div>
          </div>
          <MenuCard
            title="Tài khoản"
            active={pathname.includes(ROUTE.ACCOUNT)}
            iconElement={({ isHovered }) => (
              <User
                size={20}
                color={
                  pathname.includes(ROUTE.ACCOUNT) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.ACCOUNT}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            active={pathname.includes(ROUTE.MY_CLASS)}
            title="Lớp của tôi"
            iconElement={({ isHovered }) => (
              <MyClassIcon
                active={pathname.includes(ROUTE.MY_CLASS)}
                isHovered={isHovered}
              />
            )}
            url={ROUTE.MY_CLASS}
            hidden={!hasAccess([Role.TEACHER])}
          />
          <MenuCard
            title="Lớp học"
            active={pathname.includes(ROUTE.MANAGE_CLASS)}
            url={ROUTE.MANAGE_CLASS}
            iconElement={({ isHovered }) => (
              <ClassManagementIcon
                active={pathname.includes(ROUTE.MANAGE_CLASS)}
                isHovered={isHovered}
              />
            )}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Khóa học"
            active={pathname.includes(ROUTE.COURSES)}
            iconElement={({ isHovered }) => (
              <CourseManagementIcon
                active={pathname.includes(ROUTE.COURSES)}
                isHovered={isHovered}
              />
            )}
            url={ROUTE.COURSES}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />

          {/* Enhanced Divider */}
          <div className="relative my-3 mx-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-2">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Group 2: nhiệm vụ, thành tựu, chứng chỉ */}
          <div className="xl:px-3 py-2 mb-1">
            <div className="xl:flex items-center gap-2 hidden">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <p className="text-xs text-gray-600 font-semibold tracking-wide uppercase">
                Hệ thống học tập
              </p>
            </div>
          </div>
          <MenuCard
            title="Nhiệm vụ"
            active={pathname.includes(ROUTE.MISSION)}
            iconElement={({ isHovered }) => (
              <Goal
                size={20}
                color={
                  pathname.includes(ROUTE.MISSION) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.MISSION}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Thành tựu"
            active={pathname.includes(ROUTE.ACHIEVEMENT)}
            iconElement={({ isHovered }) => (
              <AchievementIcon
                active={pathname.includes(ROUTE.ACHIEVEMENT)}
                isHovered={isHovered}
              />
            )}
            url={ROUTE.ACHIEVEMENT}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Cấu hình Chứng chỉ"
            active={pathname.includes(ROUTE.CERTIFICATE_CONFIG)}
            iconElement={({ isHovered }) => (
              <SlidersHorizontal
                size={20}
                color={
                  pathname.includes(ROUTE.CERTIFICATE_CONFIG) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.CERTIFICATE_CONFIG}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Xin cấp Chứng chỉ"
            active={pathname.includes(ROUTE.CERTIFICATE_REQUEST)}
            iconElement={({ isHovered }) => (
              <FileCheck
                size={20}
                color={
                  pathname.includes(ROUTE.CERTIFICATE_REQUEST) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.CERTIFICATE_REQUEST}
            hidden={!hasAccess([Role.CLASSMANAGEMENT, Role.TEACHER])}
          />
          <MenuCard
            title="Chứng chỉ"
            active={pathname.includes(ROUTE.CERTIFICATE)}
            iconElement={({ isHovered }) => (
              <Award
                size={20}
                color={
                  pathname.includes(ROUTE.CERTIFICATE) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.CERTIFICATE}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />

          {/* Enhanced Divider */}
          <div className="relative my-3 mx-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-2">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Group 3: tin tức, sự kiện, tuyển dụng */}
          <div className="xl:px-3 py-2 mb-1">
            <div className="xl:flex items-center gap-2 hidden">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
              <p className="text-xs text-gray-600 font-semibold tracking-wide uppercase">
                Nội dung
              </p>
            </div>
          </div>
          <MenuCard
            title="Tin tức"
            active={pathname.includes(ROUTE.NEWS)}
            iconElement={({ isHovered }) => (
              <Newspaper
                size={20}
                color={
                  pathname.includes(ROUTE.NEWS) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.NEWS}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Sự kiện"
            active={pathname.includes(ROUTE.EVENTS)}
            iconElement={({ isHovered }) => (
              <EventIcon
                active={pathname.includes(ROUTE.EVENTS)}
                isHovered={isHovered}
              />
            )}
            url={ROUTE.EVENTS}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Tuyển dụng"
            active={pathname.includes(ROUTE.HIRING)}
            iconElement={({ isHovered }) => (
              <HiringIcon
                active={pathname.includes(ROUTE.HIRING)}
                isHovered={isHovered}
              />
            )}
            url={ROUTE.HIRING}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />

          {/* Enhanced Divider */}
          <div className="relative my-3 mx-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-2">
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Group 4: remaining items */}
          <div className="xl:px-3 py-2 mb-1">
            <div className="xl:flex items-center gap-2 hidden">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-500 to-slate-600"></div>
              <p className="text-xs text-gray-600 font-semibold tracking-wide uppercase">
                Khác
              </p>
            </div>
          </div>
          <MenuCard
            title="Phê duyệt bài viết"
            active={pathname.includes(ROUTE.VERIFIED)}
            iconElement={({ isHovered }) => (
              <Flag
                size={20}
                color={
                  pathname.includes(ROUTE.VERIFIED) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.VERIFIED}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Danh mục"
            active={pathname.includes(ROUTE.CATEGORY)}
            iconElement={({ isHovered }) => (
              <List
                size={20}
                color={
                  pathname.includes(ROUTE.CATEGORY) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.CATEGORY}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Cấu hình Cửa Hàng"
            active={pathname.includes(ROUTE.SHOP_CONFIG)}
            iconElement={({ isHovered }) => (
              <ShoppingCart
                size={20}
                color={
                  pathname.includes(ROUTE.SHOP_CONFIG) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.SHOP_CONFIG}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
          <MenuCard
            title="Cấp vật phẩm"
            active={pathname.includes(ROUTE.CLAIMED_ITEM)}
            iconElement={({ isHovered }) => (
              <Ticket
                size={20}
                color={
                  pathname.includes(ROUTE.CLAIMED_ITEM) || isHovered
                    ? "#BC4CAC"
                    : undefined
                }
              />
            )}
            url={ROUTE.CLAIMED_ITEM}
            hidden={!hasAccess([Role.CLASSMANAGEMENT])}
          />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <UserProfileLink
            userName={get(userInfo, ["username"], "")}
            userRank={userRole}
          />
        </div>
      </div>
    </div>
  );
};
