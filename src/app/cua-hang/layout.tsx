"use client";
import { Button } from "@/components/common/button/Button";
import { EventList } from "@/components/home/EventList";
import { PointCard } from "@/components/home/PointCard";
import Image from "next/image";
import { useState } from "react";
import { CreateProfileModal } from "@/components/home/CreateProfileModal";
import { useProfileStore } from "@/store/ProfileStore";
import { MenuLayout } from "@/components/home/MenuLayout";
import { useRouter, usePathname } from "next/navigation";
import { FilterGroup } from "@/components/shop/FilterGroup";
import UserProfileLink from "@/components/common/UserProfileLink";
import { useEvents } from "@/lib/hooks/useEvent";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("HENRY NGUYEN");
  const [userRank, setUserRank] = useState("BẠC IV");
  const [show, hide] = useProfileStore((state) => [state.show, state.hide]);
  const events = useEvents().slice(1, 4);

  const router = useRouter();
  const handleOpenModal = () => {
    show();
  };

  return (
    <section className="w-full grid grid-cols-11 h-screen">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="h-full flex flex-col px-10 py-5 border-gray-200 border-r col-span-2">
        <div className="grow-0">
          <Image
            src="/image/app-logo.png"
            alt="app logo"
            width={159}
            height={32}
            className="ml-1.5"
          />
        </div>
        <div className="flex flex-col mt-4 grow">
          <MenuLayout />
          <div className="grow-0 px-3 w-full">
            <Button className="w-full !rounded-3xl" onClick={handleOpenModal}>
              Đăng tải
            </Button>
            <UserProfileLink userName={userName} userRank={userRank} />
          </div>
        </div>
      </div>
      <div className="col-span-6 py-5 overflow-y-auto">{children}</div>
      <div className="h-full flex flex-col px-10 py-5 border-gray-200 border-l col-span-3">
        <PointCard point="9999" />

        {usePathname().includes("/shop/") ? (
          <FilterGroup customClassName="mt-4" />
        ) : (
          <>
            <EventList customClassName="mt-4" listEvent={events} />
            <div className="w-full mt-4 rounded-xl bg-[url('/image//home/banner-layout.png')] bg-no-repeat bg-cover h-full" />
          </>
        )}
      </div>
      <CreateProfileModal />
    </section>
  );
}
