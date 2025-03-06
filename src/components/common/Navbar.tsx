"use client";

import { ROUTE } from "@/contants/router";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuCard } from "@/components/home/MenuCard";
import { Bell, Goal, Home, Newspaper, ShoppingCart, User } from "lucide-react";
import { useCustomRouter } from "./router/CustomRouter";
import { CommonButton } from "./button/CommonButton";
import { useUserStore } from "@/store/UserStore";

export const Navbar = () => {
  const router = useCustomRouter();

  /** UseStore */
  const [clear] = useUserStore((state) => [state.clear]);

  const handleRidirectHomePage = () => {
    router.push(ROUTE.MAIN);
  };

  const handleLogout = () => {
    clear();
    router.push(ROUTE.LOGIN);
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
        <div className="flex flex-col mt-4">
          <div>
            <MenuCard
              title="Tài khoản"
              active={usePathname() === "/home"}
              iconElement={<Home size={20} />}
              url={ROUTE.ACCOUNT}
            />
            <MenuCard
              active={usePathname() === "/notification"}
              title="Lớp của tôi"
              iconElement={<Bell size={20} />}
              url={ROUTE.MY_CLASS}
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
              url={"/admin"}
              iconElement={<ShoppingCart size={20} />}
            />

            <MenuCard
              title="Tin tức"
              active={usePathname().includes("/news")}
              iconElement={<Newspaper size={20} />}
              url={"/tin-tuc"}
            />
            <MenuCard
              title="Tuyển dụng"
              active={usePathname() === "/home/profile"}
              iconElement={<User size={20} />}
              url={ROUTE.HIRING}
            />
            <MenuCard
              title="Sự kiện"
              active={usePathname() === "/home/profile"}
              iconElement={<User size={20} />}
              url={ROUTE.EVENTS}
            />
            <MenuCard
              title="Khóa học"
              active={usePathname() === "/home/khoa-hoc"}
              iconElement={<User size={20} />}
              url={ROUTE.COURSES}
            />
            <CommonButton
              variant="destructive"
              className="h-12"
              onClick={handleLogout}
            >
              Đăng xuất
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};
