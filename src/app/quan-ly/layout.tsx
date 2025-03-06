"use client";
import { Button } from "@/components/common/button/Button";
import { EventList } from "@/components/home/EventList";
import { PointCard } from "@/components/home/PointCard";
import Image from "next/image";
import { useEvents } from "@/lib/hooks/useEvent";
import { useState } from "react";
import { CreateProfileModal } from "@/components/home/CreateProfileModal";
import { useProfileStore } from "@/store/ProfileStore";
import { MenuLayout } from "@/components/home/MenuLayout";
import { usePathname } from "next/navigation";
import { AuthorCard } from "@/components/project/AuthorCard";
import { AuthorProjectsCard } from "@/components/project/AuthorProjectsCard";
import UserProfileLink from "@/components/common/UserProfileLink";
import { useProjects } from "@/lib/hooks/useProject";
import { CommonButton } from "@/components/common/button/CommonButton";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { MenuCard } from "@/components/home/MenuCard";
import {
  Bell,
  Goal,
  Home,
  Newspaper,
  ShoppingCart,
  User,
  Zap,
} from "lucide-react";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useCustomRouter();
  const [userName, setUserName] = useState("HENRY NGUYEN");
  const [userRank, setUserRank] = useState("BẠC IV");
  const [show, hide] = useProfileStore((state) => [state.show, state.hide]);
  const handleOpenModal = () => {
    show();
  };
  const handleRidirectHomePage = () => {
    router.push(ROUTE.HOME);
  };

  return (
    <section className="w-full flex min-h-screen container mx-auto">
      {/* Include shared UI here e.g. a header or sidebar */}
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
        <div className="flex flex-col mt-4">
          <div>
            <MenuCard
              title="Tài khoản"
              active={usePathname() === "/home"}
              iconElement={<Home size={20} />}
              url={ROUTE.ADMIN + ROUTE.ACCOUNT}
            />
            <MenuCard
              active={usePathname() === "/notification"}
              title="Lớp của tôi"
              iconElement={<Bell size={20} />}
              url={ROUTE.ADMIN + ROUTE.MY_CLASS}
            />
            <MenuCard
              title="Phê duyệt"
              active={usePathname().includes("/quan-ly/phe-duyet")}
              iconElement={<Goal size={20} />}
              url="/quan-ly/phe-duyet"
            />
            <MenuCard
              title="Quản lý lớp học"
              active={usePathname().includes("/shop")}
              url="/shop"
              iconElement={<ShoppingCart size={20} />}
            />
            <MenuCard
              title="Quảng cáo"
              active={usePathname().includes("/leaderboard")}
              iconElement={<Zap size={20} />}
              url="/leaderboard"
            />
            <MenuCard
              title="Tin tức"
              active={usePathname().includes("/news")}
              iconElement={<Newspaper size={20} />}
              url={ROUTE.ADMIN + "/tin-tuc"}
            />
            <MenuCard
              title="Tuyển dụng"
              active={usePathname() === "/home/profile"}
              iconElement={<User size={20} />}
              url={ROUTE.ADMIN + ROUTE.HIRING}
            />
            <MenuCard
              title="Sự kiện"
              active={usePathname() === "/home/profile"}
              iconElement={<User size={20} />}
              url={ROUTE.ADMIN + ROUTE.EVENTS}
            />
            <MenuCard
              title="Khóa học"
              active={usePathname() === "/home/khoa-hoc"}
              iconElement={<User size={20} />}
              url={ROUTE.ADMIN + ROUTE.COURSES}
            />
            <MenuCard
              title="ADMIN"
              active={usePathname() === "/home/profile"}
              iconElement={<User size={20} />}
              url={ROUTE.ADMIN + "/admin"}
            />
          </div>
          <div className="grow-0 px-3 w-full">
            <CommonButton
              className="w-full !rounded-3xl h-12 xl:block hidden"
              variant="secondary"
              onClick={handleRidirectHomePage}
            >
              Bảng tin Tekmonk
            </CommonButton>

            <UserProfileLink userName={userName} userRank={userRank} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto border-gray-200 border">
        {children}
      </div>
    </section>
  );
}
