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
import CommonLayout from "@/components/common/CommonLayout";

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
  const handleRidirectAdminPage = () => {
    router.push(ROUTE.ADMIN);
  };
  const events = useEvents().slice(1, 4);
  const projects = useProjects().slice(1, 5);

  return (
    <>
      <CommonLayout
        leftSidebar={
          <div className="h-full flex flex-col px-10 py-5 border-gray-200 border-r col-span-2">
            <div className="">
              <Image
                src="/image/app-logo.png"
                alt="app logo"
                width={159}
                height={32}
                className="ml-1.5 xl:block hidden"
              />
              <Image
                src="/Logo.png"
                alt="app logo"
                width={34}
                height={32}
                className="ml-1.5 xl:hidden block"
              />
            </div>
            <div className="flex flex-col mt-4 grow">
              <MenuLayout customClassName="" />
              <div className="grow-0 px-3 w-full md:block hidden">
                <div className="flex flex-col gap-y-4 mt-4">
                  <CommonButton
                    className="w-full !rounded-3xl h-12"
                    variant="secondary"
                    onClick={handleRidirectAdminPage}
                  >
                    Quản lý
                  </CommonButton>
                  <CommonButton
                    className="w-full !rounded-3xl h-12"
                    onClick={handleOpenModal}
                  >
                    Đăng tải
                  </CommonButton>
                </div>
                <UserProfileLink userName={userName} userRank={userRank} />
              </div>
            </div>
          </div>
        }
        mainContent={
          <div className="col-span-6 py-5 overflow-y-auto">{children}</div>
        }
        rightSidebar={
          <>
            <div className="h-full flex flex-col gap-y-4 px-10 py-5 border-gray-200 border-l col-span-3">
              {!usePathname().includes("/project") ? (
                <>
                  <PointCard point="9999" />
                  <EventList listEvent={events} />
                  <div className="w-full rounded-xl bg-[url('/image//home/banner-layout.png')] bg-no-repeat bg-cover h-full" />
                </>
              ) : (
                <>
                  <AuthorCard
                    imageUrl="bg-[url('/image/user/profile-pic-2.png')]"
                    userName={userName}
                    specialName="Học Bá Thanh Xuân"
                    userRank={
                      <span
                        className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
                      >
                        IV
                      </span>
                    }
                    likedCount="134"
                    projectCount="5"
                  />
                  <AuthorProjectsCard projects={projects} />
                </>
              )}
            </div>
          </>
        }
      />
      <CreateProfileModal />
    </>
  );
}
