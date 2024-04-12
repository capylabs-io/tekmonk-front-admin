"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { MenuLayout } from "@/components/home/MenuLayout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Logout } from "@/components/common/Logout";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
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
            <ArrowLeft size={16} className="text-black" />
          </Button>
        </div>
        <div className="flex flex-col mt-4 grow">
          <MenuLayout />
          <Logout />
        </div>
      </div>
      <div className="py-5 overflow-y-auto w-full">{children}</div>
    </section>
  );
}
