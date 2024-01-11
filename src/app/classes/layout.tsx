"use client";
import {
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MenuLayout } from "@/components/home/MenuLayout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("HENRY NGUYEN");
  const [userRank, setUserRank] = useState("BẠC IV");
  const router = useRouter();
  return (
    <section className="w-full h-screen flex">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="h-full flex flex-col p-4 border-gray-200 border-r w-[320px]">
        <div className="grow-0 flex justify-between items-center">
          <Image
            src="/image/app-logo.png"
            alt="app logo"
            width={159}
            height={32}
            className="ml-1.5"
          />
          <Button className="bg-white shadow-md !p-2 !rounded-lg">
            <ArrowLeft size={16} className="text-black"/>
          </Button>
        </div>
        <div className="flex flex-col mt-4 grow">
          <MenuLayout />
          <div className="grow-0 px-3 w-full">
            <div className="flex items-center mt-8 w-full justify-between">
              <div
                className="flex items-center gap-x-2 cursor-pointer"
                onClick={() => router.push("/home/profile")}
              >
                <div className="h-10 w-10 rounded-full flex flex-col bg-[url('/image/home/profile-pic.png')] bg-yellow-100 items-center justify-center" />
                <div>
                  <p className="text-sm truncate">{userName}</p>
                  <p className="text-sm text-gray-500">{userRank}</p>
                </div>
              </div>
              <button type="button">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5 overflow-y-auto">{children}</div>
    </section>
  );
}
